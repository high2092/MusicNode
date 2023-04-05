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

const colorToRgb = (color: string) => {
  const hex = color.slice(1);
  return [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16)];
};

const rgbToColor = (rgbArr: number[]) => {
  return `#${rgbArr.map((c) => c.toString(16).padStart(2, '0')).join('')}`;
};

const lightenColor = (color: string, ratio: number) => {
  const rgb = colorToRgb(color);
  const newRgb = rgb.map((c) => Math.round(c + (255 - c) * ratio));

  return rgbToColor(newRgb);
};

const mixColor = (color1: string, color2: string, ratio: number = 0.5): string => {
  const rgb1 = colorToRgb(color1);
  const rgb2 = colorToRgb(color2);
  const r = Math.round(rgb1[0] * ratio + rgb2[0] * (1 - ratio));
  const g = Math.round(rgb1[1] * ratio + rgb2[1] * (1 - ratio));
  const b = Math.round(rgb1[2] * ratio + rgb2[2] * (1 - ratio));
  return rgbToColor([r, g, b]);
};

const groupingV4 = (musicNodeList: IMusicNode[]) => {
  const visited = [];
  const group = {};
  const stack = [];
  const groups = [];
  const roots = [];

  const prev = {};
  const rank = {};

  let groupNum = 0;
  let isCycle: boolean;

  const dfs: (id: number) => number = (id: number) => {
    if (id === null) {
      isCycle = false;
      return ++groupNum;
    }

    if (group[id]) {
      isCycle = false;
      return group[id];
    }

    // 사이클에 해당
    if (visited[id]) {
      isCycle = true;
      return ++groupNum;
    }

    visited[id] = 1;
    stack.push(id);

    const next = musicNodeList.find((node) => node.id === id).next;

    if (next === null) {
      roots.push(id);
    }

    prev[next] ??= [];
    prev[next].push(id);

    const result = dfs(next);

    groups[result] ??= [];
    groups[result].push(id);

    if (isCycle) rank[id] = 1;

    return (group[id] = result);
  };

  for (const { id } of musicNodeList) {
    dfs(id);
  }

  const dfs2 = (id: number, seq: number) => {
    rank[id] = seq;
    if (!prev[id]) return;
    for (const p of prev[id]) {
      dfs2(p, seq + 1);
    }
  };

  for (const id of roots) {
    dfs2(id, 1);
  }

  return { group, groupNum, groups, rank };
};

/**
 *
 * @param ratio (자신_등수 / 전체)
 * @returns
 */
const 순서에_따른_연하게_할_수준_결정 = (rank, total) => {
  const 정책_영향력 = 0.9;

  // 정책 - 기본적으로 앞 노드가 더 연한 색을 갖도록 구현
  const 앞_노드에_대한_비율_정책 = (P) => () => {
    return Math.pow(P, rank);
  };

  const 순위_비율_정책 = () => {
    return 1 - rank / total;
  };

  // 옵션
  const reverse = (ratio) => {
    return 1 - ratio;
  };

  let ratio: number;

  const 선택한_정책 = 순위_비율_정책;

  ratio = 정책_영향력 * 선택한_정책() + 1 - 정책_영향력;

  ratio = reverse(ratio);

  return ratio;
};

const convertMusicNodeToReactFlowObject = (musicNodeList: IMusicNode[]) => {
  const DEFAULT_WHITE_PAINT_RATIO = 0.5; // 전체적으로 얼마나 옅은 색을 띌 지
  const WHITE = '#ffffff';
  const TEST_COLOR = '#000000';
  const SPECTRUM_FACTOR = 0.9; // 얼마나 다양한 색으로 분포될지

  const { group, groupNum, groups, rank } = groupingV4(musicNodeList);

  const TEST_COLORS = Array.from(
    { length: groupNum + 1 },
    () =>
      `#${Math.floor(Math.random() * Math.pow(2, 24))
        .toString(16)
        .padStart(6, '0')}`
  );

  const initialNodes = musicNodeList.map((node, idx) => ({
    id: node.id.toString(),
    position: node.position,
    data: { label: node.musicName },
    group: group[node.id],
    style: {
      backgroundColor: `${mixColor(WHITE, lightenColor(TEST_COLORS[group[node.id]] ?? TEST_COLOR, 순서에_따른_연하게_할_수준_결정(rank[node.id], groups[group[node.id]].length) * SPECTRUM_FACTOR), DEFAULT_WHITE_PAINT_RATIO)}`,
      fontWeight: 'bold',
    },
  }));

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
