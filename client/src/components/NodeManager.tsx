import { useCallback, useRef } from 'react';
import ReactFlow, { Node, Edge, NodeChange, EdgeChange, NodePositionChange, MiniMap } from 'reactflow';
import { createPlaylistByHead, httpPatch, httpPost, validateVideoId } from '../utils/common';
import { DragTransferTypes, ReactFlowObjectTypes, convertClassListStringToReactFlowType, createArrowEdge } from '../utils/ReactFlow';
import { useRecoilState } from 'recoil';
import { MusicNode } from '../domain/MusicNode';
import { clickEventPositionAtom, currentMusicNodeInfoAtom, isPlayingAtom, isVisiblePlaylistModalAtom, musicMapAtom, musicNodeMapAtom, reactFlowInstanceAtom, selectedPlaylistAtom } from '../store';
import { ReactFlowNode } from '../domain/ReactFlowNode';
import { Music } from '../domain/Music';

import 'reactflow/dist/style.css';

class SelectedObject {
  id: string;
  type: ReactFlowObjectType;
}

type ReactFlowObjectType = typeof ReactFlowObjectTypes[keyof typeof ReactFlowObjectTypes];

interface NodeListProps {
  nodes: Node[];
  edges: Edge[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  onNodesChange: (nodesChange: NodeChange[]) => void;
  onEdgesChange: (edgesChange: EdgeChange[]) => void;
  showMiniMap: boolean;
}

export const NodeManager = ({ nodes, setNodes, onNodesChange, edges, setEdges, onEdgesChange, showMiniMap }: NodeListProps) => {
  const [musicMap, setMusicMap] = useRecoilState(musicMapAtom);
  const [musicNodeMap, setMusicNodeMap] = useRecoilState(musicNodeMapAtom);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingAtom); // TODO: replace with selector
  const [currentMusicInfo, setCurrentMusicInfo] = useRecoilState(currentMusicNodeInfoAtom);
  const [isVisiblePlaylistModal, setIsVisiblePlaylistModal] = useRecoilState(isVisiblePlaylistModalAtom);
  const [clickEventPosition, setClickEventPosition] = useRecoilState(clickEventPositionAtom);
  const [playlist, setPlaylist] = useRecoilState(selectedPlaylistAtom);
  const [reactFlowInstance, setReactFlowInstance] = useRecoilState(reactFlowInstanceAtom);

  const selectedObjectRef = useRef<SelectedObject>(new SelectedObject());

  const handleEdgeUpdate = async (oldEdge, newConnection) => {
    const { source: id, target: next } = newConnection;
    const response = await httpPatch(`node/${id}`, { next });
    if (response.ok) {
      setEdges((edges) => {
        edges = edges.filter((edge) => edge.id !== oldEdge.id);
        edges.push(createArrowEdge(newConnection));
        return edges;
      });
    }
  };

  const onConnect = useCallback(
    // TODO: TypeScript
    async (params) => {
      // 역방향 연결을 허용하지 않음
      if (selectedObjectRef.current?.type === ReactFlowObjectTypes.EDGE_TARGET) return;

      const { source: id, target: next } = params;
      const response = await httpPatch(`node/${id}`, { next });

      if (response.ok) {
        setEdges((edges) => {
          edges = edges.filter((edge) => edge.source !== params.source);
          edges.push(createArrowEdge(params));
          return edges;
        });
        setMusicNodeMap((musicMap) => {
          const node = musicMap.get(Number(params.source));
          return musicMap.set(node.id, { ...node, next: Number(params.target) });
        });
      }
    },
    [setEdges]
  );

  const handleNodeDoubleClick = (e: React.MouseEvent, node: ReactFlowNode) => {
    setCurrentMusicInfo(node);
    setIsPlaying(true);
  };

  const handleNodeContextMenu = (e: React.MouseEvent, node: Node) => {
    setPlaylist(createPlaylistByHead(Number(node.id), musicNodeMap));

    setClickEventPosition({
      x: e.clientX,
      y: e.clientY,
    });

    setIsVisiblePlaylistModal(true);
  };

  const handleReactFlowMouseDownCapture = ({ target }) => {
    selectedObjectRef.current = {
      id: target.dataset.id,
      type: convertClassListStringToReactFlowType(target.classList.value),
    };
  };

  const handleEdgesDelete = async (edges: Edge[]) => {
    const response = await httpPost(`node/disconnect`, {
      targets: edges.map((edge) => Number(edge.target)),
    });
    if (!response.ok) {
      setEdges((eds) => {
        return [...eds, ...edges];
      });
    } else {
      setMusicNodeMap((musicMap) => {
        const newMusicMap = new Map(musicMap);
        edges.forEach((edge) => (newMusicMap.get(Number(edge.source)).next = null));
        return newMusicMap;
      });
    }

    selectedObjectRef.current = new SelectedObject();
  };

  const timeoutRef = useRef<NodeJS.Timeout>();
  const _onNodesChange = (nodesChange: NodePositionChange[]) => {
    onNodesChange(nodesChange);

    const CHANGE_STOP_CRITERIA_MILLI = 700;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(async () => {
      const nodeMoves = nodesChange.map((nodeChange) => {
        const { id, position } = nodes.find((node) => node.id === nodeChange.id);
        return { id: Number(id), position };
      });

      const response = await httpPost('node/move', {
        nodeMoves,
      });

      if (!response.ok) {
        console.error(response.statusText);
        return;
      }
    }, CHANGE_STOP_CRITERIA_MILLI);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const { musicId, musicName, type, videoId } = JSON.parse(e.dataTransfer.getData('application/reactflow'));

    const EPSILON = 50;

    const position = reactFlowInstance.project({
      x: e.clientX - EPSILON,
      y: e.clientY - EPSILON,
    });

    switch (type) {
      case DragTransferTypes.SEARCH_RESULT: {
        if (!validateVideoId(videoId)) return;

        const response = await httpPost('node/simple', { musicName, videoId }); // TODO: API 하나 따로 만들기

        if (response.ok) {
          const { musicId, nodeId } = await response.json();
          console.log(musicId, nodeId);
          setMusicMap(musicMap.set(musicId, new Music({ id: musicId, name: musicName, videoId })));
          setMusicNodeMap(musicNodeMap.set(nodeId, new MusicNode({ id: nodeId, musicId, videoId, musicName, position })));
          setNodes((nodes) => nodes.concat(new ReactFlowNode({ id: nodeId, musicName, videoId, position })));
        }
        break;
      }

      case DragTransferTypes.MUSIC: {
        const response = await httpPost('node', { musicId });

        if (response.ok) {
          const { id } = await response.json();

          const music = musicMap.get(musicId);
          setMusicNodeMap(musicNodeMap.set(id, new MusicNode({ id, musicId: music.id, musicName: music.name, videoId: music.videoId, position })));
          setNodes((nodes) => nodes.concat(new ReactFlowNode({ id, musicName: music.name, videoId: music.videoId, position })));
        }
        break;
      }
    }
  };

  const handleNodesDelete = async (nodes: Node[]) => {
    const response = await httpPost('node/delete', {
      nodes: nodes.map((node) => Number(node.id)),
    });

    if (!response.ok) {
      console.error(response.statusText);
      return;
    }
  };

  return (
    <div style={{ width: '100vw', height: '50vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={_onNodesChange}
        onEdgesChange={onEdgesChange}
        onEdgeUpdate={handleEdgeUpdate}
        onConnect={onConnect}
        onNodeContextMenu={handleNodeContextMenu}
        onNodeDoubleClick={handleNodeDoubleClick}
        onMouseDownCapture={handleReactFlowMouseDownCapture}
        onInit={setReactFlowInstance}
        onNodesDelete={handleNodesDelete}
        onEdgesDelete={handleEdgesDelete}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onContextMenu={(e) => e.preventDefault()}
      >
        {showMiniMap && <MiniMap zoomable pannable />}
      </ReactFlow>
    </div>
  );
};
