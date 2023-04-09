import { useRecoilValue } from 'recoil';
import { convertPlaylistToCode } from '../utils/common';
import { selectedPlaylistAtom } from '../store';

export const PlaylistShareButton = () => {
  const playlist = useRecoilValue(selectedPlaylistAtom);
  const handleClick = () => {
    const code = convertPlaylistToCode(playlist);
    alert('클립보드에 복사되었어요.'); // TODO: 토스트 메시지로 변경
    console.log(code);
  };
  return <button onClick={handleClick}>공유하기</button>;
};
