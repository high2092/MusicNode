import { useRecoilState, useRecoilValue } from 'recoil';
import { selectedPlaylistAtom, playlistMapAtom } from '../store';

export const Playlist = ({ id, name }) => {
  const playlistMap = useRecoilValue(playlistMapAtom);
  const [playlist, setPlaylist] = useRecoilState(selectedPlaylistAtom);
  const handleClick = (id: number) => () => {
    const playlist = playlistMap.get(id);
    setPlaylist(playlist);
  };

  return <div onClick={handleClick(id)}>{name}</div>;
};
