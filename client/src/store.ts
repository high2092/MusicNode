import { atom } from 'recoil';

export const musicNodeListAtom = atom<IMusicNode[]>({
  key: 'musicNodeListAtom',
  default: [],
});
