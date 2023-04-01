import { useCallback, useEffect, useRef } from 'react';
import * as S from './styles/NodeList';
import ReactFlow, { useNodesState, useEdgesState, addEdge, MarkerType } from 'reactflow';
import type { Node } from 'reactflow';
import { useRouter } from 'next/router';

import 'reactflow/dist/style.css';
import { httpPatch } from '../utils';

const calculateNodePosition = (idx: number) => {
  const NODE_DEFAULT_POSITION_X = 50;
  const NODE_DEFAULT_POSITION_Y = 50;
  const NODE_POSITION_UNIT_X = 200;
  const NODE_POSITION_UNIT_Y = 100;
  const NUMBER_OF_NODES_IN_A_COLUMN = 3;

  return {
    y: NODE_DEFAULT_POSITION_Y + NODE_POSITION_UNIT_Y * Math.floor(idx / NUMBER_OF_NODES_IN_A_COLUMN),
    x: NODE_DEFAULT_POSITION_X + NODE_POSITION_UNIT_X * (idx % NUMBER_OF_NODES_IN_A_COLUMN),
  };
};

const createArrowEdge = ({ source, target }: { source: string; target: string }) => {
  return { id: `e${source}-${target}`, source, target, markerEnd: { type: MarkerType.ArrowClosed }, sourceHandle: null, targetHandle: null };
};

const convert = (musicNodeList: IMusicNode[]) => {
  const initialNodes = musicNodeList.map((node, idx) => ({ id: node.id.toString(), position: calculateNodePosition(idx), data: { label: node.musicName } }));
  const initialEdges = [];

  musicNodeList.forEach(({ id, next }) => {
    if (next) initialEdges.push({ source: id.toString(), target: next.toString(), id: `e${id}-${next}`, markerEnd: { type: MarkerType.Arrow } });
  });

  return { initialNodes, initialEdges };
};

export const NodeList = ({ musicNodeList }) => {
  const { initialNodes, initialEdges } = convert(musicNodeList);
  console.log(musicNodeList);

  const router = useRouter();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const edgeSourceRef = useRef<string>();

  useEffect(() => {
    // console.log(musicNodeList.length, nodes.length, initialNodes.length);
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
      if (edgeSourceRef.current.includes('target')) return;

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
    if (edgeSourceRef.current.includes('source') || edgeSourceRef.current.includes('target')) return;
    router.push(`/music-node/${node.id}`);
  };

  const handleMouseDownCapture = (e) => {
    // ReactFlow 컴포넌트에 onNodeMouseDown 속성이 있었다면 더 좋았을텐데 아쉽다
    edgeSourceRef.current = e.target.dataset.id;
  };

  const handleEdgesDelete = async (edges) => {
    const [edge] = edges;

    const response = await httpPatch(`node/${edge.source}`);

    if (!response.ok) {
      console.log(1);
      console.log(edge);
      setEdges((edges) => {
        return edges.concat(edge);
      });
    }
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
        onMouseDownCapture={handleMouseDownCapture}
        onEdgesDelete={handleEdgesDelete}
      />
    </S.NodeList>
  );
};
