import { useCallback, useEffect } from 'react';
import * as S from './styles/NodeList';
import ReactFlow, { useNodesState, useEdgesState, addEdge, MarkerType } from 'reactflow';
import type { Node } from 'reactflow';
import { useRouter } from 'next/router';

import 'reactflow/dist/style.css';

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
  const initialNodes = musicNodeList.map((node, idx) => ({ id: node.id.toString(), position: calculateNodePosition(idx), data: { label: node.id.toString() } }));
  const initialEdges = [];

  musicNodeList.forEach(({ id, next }) => {
    if (next) initialEdges.push({ source: id.toString(), target: next.toString(), id: `e${id}-${next}`, markerEnd: { type: MarkerType.Arrow } });
  });

  return { initialNodes, initialEdges };
};

export const NodeList = ({ musicNodeList }) => {
  const { initialNodes, initialEdges } = convert(musicNodeList);

  const router = useRouter();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    // console.log(musicNodeList.length, nodes.length, initialNodes.length);
    setNodes(initialNodes); // hook 때문인지 nodes 생명주기가 React에서 분리되어 있는 듯
  }, [musicNodeList]);

  const handleEdgeUpdate = (oldEdge, newConnection) => {
    const responseOk = true;
    if (responseOk) {
      setEdges((edges) => {
        edges = edges.filter((edge) => edge.id !== oldEdge.id);
        edges.push(createArrowEdge(newConnection));
        return edges;
      });
    }
  };

  const onConnect = useCallback(
    (params) => {
      const responseOk = true;
      if (responseOk) {
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
    router.push(`/music-node/${node.id}`);
  };

  return (
    <S.NodeList>
      <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onEdgeUpdate={handleEdgeUpdate} onConnect={onConnect} onNodeClick={handleNodeClick} />
    </S.NodeList>
  );
};
