import { atom, selector } from 'recoil';

export const musicNodeListAtom = atom<IMusicNode[]>({
  key: 'musicNodeListAtom',
  default: [],
});

interface ICurrentMusicNodeInfo {
  id: string;
  musicName: string;
  videoId: string;
}

export const currentMusicNodeInfoAtom = atom<ICurrentMusicNodeInfo>({
  key: 'currentMusicInfoAtom',
  default: { id: undefined, musicName: 'ㅤ', videoId: undefined },
});

export const isPlayingAtom = atom<boolean>({
  key: 'isPlayingAtom',
  default: false,
});
