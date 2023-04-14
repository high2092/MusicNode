import { FieldValues, useForm } from 'react-hook-form';
import { httpPost } from '../utils/common';
import { selectedPlaylistAtom } from '../store';
import { useRecoilValue } from 'recoil';
import * as S from './styles/PlaylistSubmitForm';

export const PlaylistSubmitForm = () => {
  const { register, handleSubmit } = useForm();
  const playlist = useRecoilValue(selectedPlaylistAtom);

  const handlePlaylistCreate = async (formData: FieldValues) => {
    const contents = JSON.stringify(playlist.contents);
    const response = await httpPost('playlist', {
      name: formData.name,
      contents,
    });

    if (!response.ok) {
      console.log('playlist create failed');
    }

    const PLAYLIST_CREATE_SUCCESS_MESSAGE = '플레이리스트가 생성되었습니다.';
    alert(PLAYLIST_CREATE_SUCCESS_MESSAGE);
  };
  return (
    <S.PlaylistSubmitForm onSubmit={handleSubmit(handlePlaylistCreate)}>
      <S.PlaylistNameInput {...register('name')} placeholder="플레이리스트 이름" />
      <S.PlaylistCreateButton>플레이리스트 생성</S.PlaylistCreateButton>
    </S.PlaylistSubmitForm>
  );
};
