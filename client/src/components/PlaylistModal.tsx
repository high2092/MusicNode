import { useRecoilValue } from 'recoil';
import * as S from './styles/PlaylistModal';
import { clickEventPositionAtom, selectedPlaylistAtom } from '../store';
import { httpPost } from '../utils/common';
import { FieldValues, useForm } from 'react-hook-form';

interface PlaylistModalProps {
  BottomElement: JSX.Element;
}

export const PlaylistModal = ({ BottomElement }: PlaylistModalProps) => {
  const { x, y } = useRecoilValue(clickEventPositionAtom);

  const playlist = useRecoilValue(selectedPlaylistAtom);

  const { register, handleSubmit } = useForm();

  const handlePlaylistCreate = async (formData: FieldValues) => {
    const contents = JSON.stringify(playlist.contents);
    const response = await httpPost('playlist', {
      name: formData.name,
      contents,
    });

    if (!response.ok) {
      console.log('playlist create failed');
    }
  };

  return (
    <S.PlaylistModal x={x} y={y} onClick={(e) => e.stopPropagation()}>
      <S.Playlist>
        {Array.from(playlist.contents.values()).map(({ name, cycle }, idx) => (
          <S.MusicInfo key={`playlist-${idx}`}>{`${name}${cycle ? ' <' : ''}`}</S.MusicInfo>
        ))}
      </S.Playlist>
      {BottomElement}
    </S.PlaylistModal>
  );
};
