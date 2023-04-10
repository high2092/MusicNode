import { atom, selector } from 'recoil';
import type { ReactFlowInstance } from 'reactflow';
import { MusicInfo } from './domain/MusicInfo';

export const musicMapAtom = atom<Map<number, IMusic>>({
  key: 'musicMapAtom',
  default: new Map<number, IMusic>(),
});

export const musicNodeMapAtom = atom<Map<number, IMusicNode>>({
  key: 'musicNodeMapAtom',
  default: new Map<number, IMusicNode>(),
});

export const currentMusicNodeInfoAtom = atom<IMusicNodeInfo>({
  key: 'currentMusicInfoAtom',
  default: { id: undefined, musicName: 'ㅤ', videoId: undefined },
});

export const isPlayingAtom = atom<boolean>({
  key: 'isPlayingAtom',
  default: false,
});

export const prevMusicNodeStackAtom = atom<IMusicNodeInfo[]>({
  key: 'prevMusicNodeStackAtom',
  default: [],
});

export const isVisiblePlaylistModalAtom = atom<boolean>({
  key: 'isVisiblePlaylistModal',
  default: false,
});

export const clickEventPositionAtom = atom<{ x: number; y: number }>({
  key: 'clickEventPositionAtom',
  default: { x: 0, y: 0 },
});

export const selectedPlaylistAtom = atom<IPlaylist>({
  key: 'selectedPlaylistAtom',
  default: { id: undefined, name: undefined, contents: new Map<number, MusicInfo>() },
});

export const playlistMapAtom = atom<Map<number, IPlaylist>>({
  key: 'playlistMapAtom',
  default: new Map<number, IPlaylist>(),
});

export const reactFlowInstanceAtom = atom<ReactFlowInstance>({
  key: 'reactFlowInstanceAtom',
  default: undefined,
});
