import { useRecoilState } from 'recoil';
import { prevMusicNodeStackAtom } from '../../store';

export const usePrevMusicNodeStack = () => {
  const [prevMusicNodeStack, setPrevMusicNodeStack] = useRecoilState(prevMusicNodeStackAtom);

  const stack = {
    push(node: IMusicNodeInfo) {
      setPrevMusicNodeStack((prevMusicNodeStack) => [...prevMusicNodeStack, node]);
    },
    top() {
      return prevMusicNodeStack[prevMusicNodeStack.length - 1];
    },
    pop() {
      const top = prevMusicNodeStack[prevMusicNodeStack.length - 1];
      setPrevMusicNodeStack((prevMusicNodeStack) => prevMusicNodeStack.slice(0, prevMusicNodeStack.length - 1));
      return top;
    },
    empty() {
      return prevMusicNodeStack.length === 0;
    },
  };

  return stack;
};
