import { useRecoilValue } from 'recoil';
import * as S from './styles/PlaylistModal';
import { clickEventPositionAtom, playlistAtom } from '../store';
import { httpPost } from '../utils/common';
import { FieldValues, useForm } from 'react-hook-form';

export const PlaylistModal = () => {
  const { x, y } = useRecoilValue(clickEventPositionAtom);

  const playlist = useRecoilValue(playlistAtom);

  const { register, handleSubmit } = useForm();

  const handlePlaylistCreate = async (formData: FieldValues) => {
    const contents = JSON.stringify(Object.fromEntries(playlist));
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
        {Array.from(playlist.values()).map(({ name, cycle }) => (
          <S.MusicInfo>{`${name}${cycle ? ' <' : ''}`}</S.MusicInfo>
        ))}
      </S.Playlist>
      <S.PlaylistSubmitForm onSubmit={handleSubmit(handlePlaylistCreate)}>
        <S.PlaylistNameInput {...register('name')} placeholder="플레이리스트 이름" />
        <S.PlaylistCreateButton>플레이리스트 생성</S.PlaylistCreateButton>
      </S.PlaylistSubmitForm>
    </S.PlaylistModal>
  );
};
