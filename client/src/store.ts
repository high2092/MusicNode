import { atom, selector } from 'recoil';

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
