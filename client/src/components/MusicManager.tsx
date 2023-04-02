import { httpPost } from '../utils';
import { Music } from './Music';
import * as S from './styles/MusicManager';
import { FieldValues, useForm } from 'react-hook-form';

export const MusicManager = ({ musicList, handleMusicClick, insert }) => {
  const { register, handleSubmit } = useForm();

  const handleMusicSubmit = async (formData: FieldValues) => {
    const { name, videoId } = formData;

    const response = await httpPost('music', { name, videoId });

    if (response.ok) {
      const { id } = await response.json();
    }
  };

  return (
    <S.MusicManager>
      <div>
        <div>음악 목록</div>
        <S.MusicList>
          {musicList.map(({ id, name, videoId }) => {
            return (
              <li key={`music-${id}`} onClick={handleMusicClick(id)}>
                <Music id={id} name={name} videoId={videoId} />
              </li>
            );
          })}
        </S.MusicList>
      </div>

      <div>
        <div>음악 추가</div>
        <form onSubmit={handleSubmit(handleMusicSubmit)}>
          <input {...register('name')} placeholder="이름" />
          <input {...register('videoId')} placeholder="비디오 ID" />
          <button>음악 추가하기</button>
        </form>
      </div>
    </S.MusicManager>
  );
};
