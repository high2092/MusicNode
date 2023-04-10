import { useRecoilValue } from 'recoil';
import { convertPlaylistToCode, copyToClipboard } from '../utils/common';
import { selectedPlaylistAtom } from '../store';
import { MAX_CODE_LENGTH, SHARE_HOST } from '../constants';

export const PlaylistShareButton = () => {
  const playlist = useRecoilValue(selectedPlaylistAtom);
  const handleClick = () => {
    const code = convertPlaylistToCode(playlist);
    const url = `${SHARE_HOST}/${code}`;

    const textToCopy = code.length <= MAX_CODE_LENGTH ? url : code;

    copyToClipboard(textToCopy);

    alert('클립보드에 복사되었어요.'); // TODO: 토스트 메시지로 변경

    console.log(textToCopy);
  };
  return <button onClick={handleClick}>공유하기</button>;
};
