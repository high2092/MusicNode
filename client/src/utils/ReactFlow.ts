import { MarkerType } from 'reactflow';
import { ReactFlowNode } from '../domain/ReactFlowNode';

export const DragTransferTypes = {
  MUSIC: 'dragTransferMusic',
  SEARCH_RESULT: 'dragTransferSearchResult',
};

export const ReactFlowObjectTypes = {
  NODE: 'node',
  EDGE: 'edge',
  EDGE_SOURCE: 'source',
  EDGE_TARGET: 'target',
  PANE: 'pane',
};

export const convertClassListStringToReactFlowType = (classListString: string) => {
  for (const i in ReactFlowObjectTypes) {
    if (classListString.includes(ReactFlowObjectTypes[i])) {
      return ReactFlowObjectTypes[i];
    }
  }

  return null;
};

export const createArrowEdge = ({ source, target }: { source: string; target: string }) => {
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

const generateRandomHexColor = () => {
  return `#${Math.floor(Math.random() * Math.pow(2, 24))
    .toString(16)
    .padStart(6, '0')}`;
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

export const convertMusicNodeToReactFlowObject = (musicNodeList: IMusicNode[]) => {
  const DEFAULT_WHITE_PAINT_RATIO = 0.5; // 전체적으로 얼마나 옅은 색을 띌 지
  const WHITE = '#ffffff';
  const TEST_COLOR = '#000000';
  const SPECTRUM_FACTOR = 0.9; // 얼마나 다양한 색으로 분포될지

  const { group, groupNum, groups, rank } = groupingV4(musicNodeList);

  const TEST_COLORS = Array.from({ length: groupNum + 1 }, () => generateRandomHexColor());

  const nodes = musicNodeList.map(
    ({ id, musicName, position, videoId }) =>
      new ReactFlowNode({
        id,
        musicName,
        position,
        videoId,
        backgroundColor: `${mixColor(WHITE, lightenColor(TEST_COLORS[group[id]] ?? TEST_COLOR, 순서에_따른_연하게_할_수준_결정(rank[id], groups[group[id]].length) * SPECTRUM_FACTOR), DEFAULT_WHITE_PAINT_RATIO)}`,
      })
  );

  const edges = [];

  musicNodeList.forEach(({ id, next }) => {
    if (next) edges.push({ source: id.toString(), target: next.toString(), id: `e${id}-${next}`, markerEnd: { type: MarkerType.Arrow } });
  });

  return { nodes, edges };
};
