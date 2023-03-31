import { useState } from 'react';
import { useForm, FieldValues } from 'react-hook-form';
import { httpGet, httpPost } from '../utils';

interface IMusic {
  id: number;
  name: string;
  videoId: string;
}

interface MusicPageProps {
  initialMusicList: IMusic[];
}

const MusicPage = ({ initialMusicList }: MusicPageProps) => {
  const [musicList, setMusicList] = useState<IMusic[]>(initialMusicList);

  const { register, handleSubmit } = useForm();

  const handleMusicSubmit = async (formData: FieldValues) => {
    const { name, videoId } = formData;

    const response = await httpPost('music', { name, videoId });

    if (response.ok) {
      const { id } = await response.json();
      setMusicList((musicList) => [
        ...musicList,
        {
          id,
          name,
          videoId,
        },
      ]);
    }
  };

  return (
    <div>
      <div>
        {musicList.map(({ id, name, videoId }) => {
          return (
            <div key={id}>
              {name} {videoId}
            </div>
          );
        })}
      </div>
      <form onSubmit={handleSubmit(handleMusicSubmit)}>
        <input {...register('name')} placeholder="이름" />
        <input {...register('videoId')} placeholder="비디오 ID" />
        <button>음악 추가하기</button>
      </form>
    </div>
  );
};

export const getServerSideProps = async () => {
  const response = await httpGet('musics');
  console.log(response);
  const { data } = await response.json();
  console.log(data);

  return {
    props: {
      initialMusicList: data,
    },
  };
};

export default MusicPage;
