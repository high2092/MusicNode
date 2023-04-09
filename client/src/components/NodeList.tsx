import { useCallback, useEffect, useRef } from 'react';
import * as S from './styles/NodeList';
import ReactFlow, { useNodesState, useEdgesState, addEdge, MarkerType } from 'reactflow';
import type { Node } from 'reactflow';
import { useRouter } from 'next/router';
import { createPlaylistByHead, httpDelete, httpPatch, httpPost, validateVideoId } from '../utils/common';
import { DragTransferTypes, ReactFlowObjectTypes, convertClassListStringToReactFlowType, convertMusicNodeToReactFlowObject, createArrowEdge } from '../utils/ReactFlow';
import { useRecoilState } from 'recoil';

import 'reactflow/dist/style.css';
import { MusicNode } from '../domain/MusicNode';
import { clickEventPositionAtom, currentMusicNodeInfoAtom, isPlayingAtom, isVisiblePlaylistModalAtom, musicMapAtom, musicNodeMapAtom, playlistAtom } from '../store';
import { ReactFlowNode } from '../domain/ReactFlowNode';
import { Position } from '../domain/Position';
import { Music } from '../domain/Music';

class SelectedObject {
  id: string;
  type: ReactFlowObjectType;
}

type ReactFlowObjectType = typeof ReactFlowObjectTypes[keyof typeof ReactFlowObjectTypes];

export const NodeList = ({ nodes, setNodes, onNodesChange, edges, setEdges, onEdgesChange }) => {
  const [musicMap, setMusicMap] = useRecoilState(musicMapAtom);
  const [musicNodeMap, setMusicNodeMap] = useRecoilState(musicNodeMapAtom);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingAtom); // TODO: replace with selector
  const [currentMusicInfo, setCurrentMusicInfo] = useRecoilState(currentMusicNodeInfoAtom);
  const [isVisiblePlaylistModal, setIsVisiblePlaylistModal] = useRecoilState(isVisiblePlaylistModalAtom);
  const [clickEventPosition, setClickEventPosition] = useRecoilState(clickEventPositionAtom);
  const [playlist, setPlaylist] = useRecoilState(playlistAtom);

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
      }
    },
    [setEdges]
  );

  // const handleNodeDoubleClick = (e: React.MouseEvent, node: Node) => {
  //   window.open(`/music-node/${node.id}`);
  // };
  const handleNodeDoubleClick = (e: React.MouseEvent, node: ReactFlowNode) => {
    setCurrentMusicInfo(node);
    setIsPlaying(true);
  };

  /**
   * deprecated
   * 더블클릭으로 대체
   */
  const handleNodeClick = (e: React.MouseEvent, node: Node) => {
    e.stopPropagation();

    setPlaylist(createPlaylistByHead(Number(node.id), musicNodeMap));

    setClickEventPosition({
      x: e.clientX,
      y: e.clientY,
    });

    setIsVisiblePlaylistModal(true);
  };

  // ReactFlow 컴포넌트에 onNodeMouseDown 속성이 있었다면 더 좋았을텐데 아쉽다
  const handleReactFlowMouseDownCapture = ({ target }) => {
    selectedObjectRef.current = {
      id: target.dataset.id,
      type: convertClassListStringToReactFlowType(target.classList.value),
    };
  };

  const handleEdgesDelete = async (edges) => {
    const [edge] = edges;

    const response = await httpPost(`node/${edge.source}/disconnect`, {});
    if (!response.ok) {
      setEdges((edges) => {
        return edges.concat(edge);
      });
    }

    selectedObjectRef.current = new SelectedObject();
  };

  const handleNodeDragStop = async (e, { id, position }) => {
    id = Number(id);
    const response = await httpPatch(`node/${id}`, { position });
    if (!response.ok) {
      console.log('patch failed');
    }
    const node = musicNodeMap.get(id);

    setMusicNodeMap(musicNodeMap.set(id, { ...node, position }));
  };

  const handleReactFlowKeyDown = async ({ key }) => {
    if (key === 'Backspace') {
      const { id, type } = selectedObjectRef.current;
      console.log(id, type);
      switch (type) {
        case ReactFlowObjectTypes.NODE: {
          const response = await httpDelete(`node/${id}`);
          if (response.ok) {
            setMusicNodeMap((musicNodeMap) => {
              musicNodeMap.delete(Number(id));
              return musicNodeMap;
            });
          }
          break;
        }
      }
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const { musicId, musicName, type, videoId } = JSON.parse(e.dataTransfer.getData('application/reactflow'));

    switch (type) {
      case DragTransferTypes.SEARCH_RESULT: {
        if (!validateVideoId(videoId)) return;

        const response = await httpPost('node/simple', { musicName, videoId }); // TODO: API 하나 따로 만들기

        if (response.ok) {
          const { musicId, nodeId } = await response.json();
          console.log(musicId, nodeId);
          setMusicMap(musicMap.set(musicId, new Music({ id: musicId, name: musicName, videoId })));
          setMusicNodeMap(musicNodeMap.set(nodeId, new MusicNode({ id: nodeId, musicId, videoId, musicName })));
          setNodes((nodes) => nodes.concat(new ReactFlowNode({ id: nodeId, musicName, videoId })));
        }
        break;
      }

      case DragTransferTypes.MUSIC: {
        const response = await httpPost('node', { musicId });

        if (response.ok) {
          const { id } = await response.json();

          const music = musicMap.get(musicId);
          setMusicNodeMap(musicNodeMap.set(id, new MusicNode({ id, musicId: music.id, musicName: music.name, videoId: music.videoId, next: null, position: new Position() })));
          setNodes((nodes) => nodes.concat(new ReactFlowNode({ id, musicName: music.name, videoId: music.videoId })));
        }
        break;
      }
    }
  };

  return (
    <S.NodeList>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodeDragStop={handleNodeDragStop}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onEdgeUpdate={handleEdgeUpdate}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        onNodeDoubleClick={handleNodeDoubleClick}
        onMouseDownCapture={handleReactFlowMouseDownCapture}
        // onNodesDelete={handleNodesDelete} // NodeDragStop 이벤트 및 nodes 상태 관리 관련 문제로 동작 X
        onEdgesDelete={handleEdgesDelete}
        onKeyDown={handleReactFlowKeyDown}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      />
    </S.NodeList>
  );
};
