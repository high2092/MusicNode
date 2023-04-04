import { useCallback, useEffect, useRef } from 'react';
import * as S from './styles/NodeList';
import ReactFlow, { useNodesState, useEdgesState, addEdge, MarkerType } from 'reactflow';
import type { Node } from 'reactflow';
import { useRouter } from 'next/router';

import 'reactflow/dist/style.css';
import { httpDelete, httpPatch, httpPost } from '../utils';

class SelectedObject {
  id: string;
  type: ReactFlowObjectType;
}

const ReactFlowObjectTypes = {
  NODE: 'node',
  EDGE: 'edge',
  EDGE_SOURCE: 'source',
  EDGE_TARGET: 'target',
  PANE: 'pane',
};

type ReactFlowObjectType = typeof ReactFlowObjectTypes[keyof typeof ReactFlowObjectTypes];

const convertClassListStringToReactFlowType = (classListString: string) => {
  for (const i in ReactFlowObjectTypes) {
    if (classListString.includes(ReactFlowObjectTypes[i])) {
      return ReactFlowObjectTypes[i];
    }
  }

  return null;
};

const createArrowEdge = ({ source, target }: { source: string; target: string }) => {
  return { id: `e${source}-${target}`, source, target, markerEnd: { type: MarkerType.ArrowClosed }, sourceHandle: null, targetHandle: null };
};

const convertMusicNodeToReactFlowObject = (musicNodeList: IMusicNode[]) => {
  const initialNodes = musicNodeList.map((node) => ({ id: node.id.toString(), position: node.position, data: { label: node.musicName } }));
  const initialEdges = [];

  musicNodeList.forEach(({ id, next }) => {
    if (next) initialEdges.push({ source: id.toString(), target: next.toString(), id: `e${id}-${next}`, markerEnd: { type: MarkerType.Arrow } });
  });

  return { initialNodes, initialEdges };
};

export const NodeList = ({ musicNodeList, setMusicNodeList }) => {
  const { initialNodes, initialEdges } = convertMusicNodeToReactFlowObject(musicNodeList);

  const router = useRouter();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const selectedObjectRef = useRef<SelectedObject>(new SelectedObject());

  useEffect(() => {
    setNodes(initialNodes); // hook 때문인지 nodes 생명주기가 React에서 분리되어 있는 듯
  }, [musicNodeList]);

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

  const handleNodeDoubleClick = (e: React.MouseEvent, node: Node) => {
    window.open(`/music-node/${node.id}`);
  };

  /**
   * deprecated
   * 더블클릭으로 대체
   */
  const handleNodeClick = (e: React.MouseEvent, node: Node) => {
    if (selectedObjectRef.current.type === ReactFlowObjectTypes.EDGE_SOURCE || selectedObjectRef.current.type === ReactFlowObjectTypes.EDGE_TARGET) return; // 1곡 반복재생 설정하는 인터페이스에 해당
    window.open(`/music-node/${node.id}`);
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
    const node = musicNodeList.find((node) => node.id === Number(id));

    setMusicNodeList((musicNodeList) => [
      ...musicNodeList,
      {
        ...node,
        position,
      },
    ]);
  };

  const handleReactFlowKeyDown = async ({ key }) => {
    if (key === 'Backspace') {
      const { id, type } = selectedObjectRef.current;
      console.log(id, type);
      switch (type) {
        case ReactFlowObjectTypes.NODE: {
          const response = await httpDelete(`node/${id}`);
          if (response.ok) {
            setMusicNodeList((musicNodeList) => musicNodeList.filter((node) => node.id !== Number(id)));
          }
          break;
        }
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
        onNodeDoubleClick={handleNodeDoubleClick}
        onMouseDownCapture={handleReactFlowMouseDownCapture}
        // onNodesDelete={handleNodesDelete} // NodeDragStop 이벤트 및 nodes 상태 관리 관련 문제로 동작 X
        onEdgesDelete={handleEdgesDelete}
        onKeyDown={handleReactFlowKeyDown}
      />
    </S.NodeList>
  );
};
