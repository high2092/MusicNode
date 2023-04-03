import { useCallback, useEffect, useRef } from 'react';
import * as S from './styles/NodeList';
import ReactFlow, { useNodesState, useEdgesState, addEdge, MarkerType } from 'reactflow';
import type { Node } from 'reactflow';
import { useRouter } from 'next/router';

import 'reactflow/dist/style.css';
import { httpDelete, httpPatch } from '../utils';

const ReactFlowObjectTypes = {
  NODE: 'node',
  EDGE: 'edge',
  EDGE_SOURCE: 'source',
  EDGE_TARGET: 'target',
  PANE: 'pane',
};

const calculateNodePosition = (idx: number, nodeCountInRow: number) => {
  const NODE_DEFAULT_POSITION_X = 50;
  const NODE_DEFAULT_POSITION_Y = 50;
  const NODE_POSITION_UNIT_X = 200;
  const NODE_POSITION_UNIT_Y = 100;

  return {
    y: NODE_DEFAULT_POSITION_Y + NODE_POSITION_UNIT_Y * Math.floor(idx / nodeCountInRow),
    x: NODE_DEFAULT_POSITION_X + NODE_POSITION_UNIT_X * (idx % nodeCountInRow),
  };
};

const createArrowEdge = ({ source, target }: { source: string; target: string }) => {
  return { id: `e${source}-${target}`, source, target, markerEnd: { type: MarkerType.ArrowClosed }, sourceHandle: null, targetHandle: null };
};

const convert = (musicNodeList: IMusicNode[], nodeCountInRow: number) => {
  const initialNodes = musicNodeList.map((node, idx) => ({ id: node.id.toString(), position: calculateNodePosition(idx, nodeCountInRow), data: { label: node.musicName } }));
  const initialEdges = [];

  musicNodeList.forEach(({ id, next }) => {
    if (next) initialEdges.push({ source: id.toString(), target: next.toString(), id: `e${id}-${next}`, markerEnd: { type: MarkerType.Arrow } });
  });

  return { initialNodes, initialEdges };
};

export const NodeList = ({ musicNodeList, nodeCountInRow }) => {
  const { initialNodes, initialEdges } = convert(musicNodeList, nodeCountInRow);

  const router = useRouter();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const selectedObjectTypeRef = useRef<string>();

  useEffect(() => {
    setNodes(initialNodes); // hook 때문인지 nodes 생명주기가 React에서 분리되어 있는 듯
  }, [musicNodeList]);

  const handleEdgeUpdate = async (oldEdge, newConnection) => {
    const { source: sourceId, target: targetId } = newConnection;
    const response = await httpPatch(`node/${sourceId}?targetId=${targetId}`);
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
      // if (edgeSourceRef.current !== params.source) return; // 편집점과 노드는 아이디가 별개이므로 아래와 같이 작성
      if (selectedObjectTypeRef.current.includes(ReactFlowObjectTypes.EDGE_TARGET)) return;

      const { source: sourceId, target: targetId } = params;
      const response = await httpPatch(`node/${sourceId}?targetId=${targetId}`);

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

  const handleNodeClick = (e: React.MouseEvent, node: Node) => {
    if (selectedObjectTypeRef.current.includes(ReactFlowObjectTypes.EDGE_SOURCE) || selectedObjectTypeRef.current.includes(ReactFlowObjectTypes.EDGE_TARGET)) return; // 1곡 반복재생 설정하는 인터페이스에 해당
    window.open(`/music-node/${node.id}`);
  };

  // ReactFlow 컴포넌트에 onNodeMouseDown 속성이 있었다면 더 좋았을텐데 아쉽다
  const handleReactFlowMouseDownCapture = ({ target }) => {
    const classListString = target.classList.value;

    for (const i in ReactFlowObjectTypes) {
      if (classListString.includes(ReactFlowObjectTypes[i])) {
        selectedObjectTypeRef.current = ReactFlowObjectTypes[i];
        break;
      }
    }
  };

  const handleNodesDelete = async (nodes) => {
    const [node] = nodes;
    const response = await httpDelete(`node/${node.id}`);
    if (!response.ok) {
      setNodes((nodes) => {
        return nodes.concat(node);
      });
    }

    selectedObjectTypeRef.current = null;
  };

  const handleEdgesDelete = async (edges) => {
    if (selectedObjectTypeRef.current === ReactFlowObjectTypes.NODE) return;

    const [edge] = edges;
    const response = await httpPatch(`node/${edge.source}`);

    if (!response.ok) {
      setEdges((edges) => {
        return edges.concat(edge);
      });
    }

    selectedObjectTypeRef.current = null;
  };

  return (
    <S.NodeList>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onEdgeUpdate={handleEdgeUpdate}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        onMouseDownCapture={handleReactFlowMouseDownCapture}
        onNodesDelete={handleNodesDelete}
        onEdgesDelete={handleEdgesDelete}
      />
    </S.NodeList>
  );
};
