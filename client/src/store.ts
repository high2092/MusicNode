import { atom, selector } from 'recoil';
import { MusicInfo, Playlist } from './domain/MusicInfo';

export const musicListAtom = atom<IMusic[]>({
  key: 'musicListAtom',
  default: [],
});
export const musicNodeListAtom = atom<IMusicNode[]>({
  key: 'musicNodeListAtom',
  default: [],
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

export const playlistAtom = atom<Playlist>({
  key: 'playlistAtom',
  default: new Map<number, MusicInfo>(),
});
