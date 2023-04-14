import { useRecoilState, useRecoilValue } from 'recoil';
import { selectedPlaylistAtom, playlistMapAtom, isVisiblePlaylistModalAtom, clickEventPositionAtom } from '../store';
import * as S from './styles/Playlist';

export const PlaylistComponent = ({ id, name }) => {
  const playlistMap = useRecoilValue(playlistMapAtom);
  const [playlist, setPlaylist] = useRecoilState(selectedPlaylistAtom);
  const [isVisiblePlaylistModal, setIsVisiblePlaylistModal] = useRecoilState(isVisiblePlaylistModalAtom);
  const [clickEventPosition, setClickEventPosition] = useRecoilState(clickEventPositionAtom);
  const handleClick = (id: number) => (e: React.MouseEvent) => {
    e.stopPropagation();

    const playlist = playlistMap.get(id);

    setClickEventPosition({
      x: e.clientX,
      y: e.clientY,
    });
    setPlaylist(playlist);
    setIsVisiblePlaylistModal(true);
  };

  const handleDeleteButtonClick = () => {
    const PLAYLIST_DELETE_CONFIME_MESSAGE = '정말 삭제할까요?';
    if (!confirm(PLAYLIST_DELETE_CONFIME_MESSAGE)) return;
  };

  return (
    <S.Playlist>
      <S.PlaylistName onClick={handleClick(id)}>{name}</S.PlaylistName>
      <S.PlaylistDeleteButton onClick={handleDeleteButtonClick}>x</S.PlaylistDeleteButton>
    </S.Playlist>
  );
};
