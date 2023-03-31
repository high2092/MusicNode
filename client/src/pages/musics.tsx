import { useState } from 'react';
import { useForm, FieldValues } from 'react-hook-form';

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
        <input {...register('name')} />
        <input {...register('videoId')} />
        <button>음악 추가하기</button>
      </form>
    </div>
  );
};

const API_HOST = 'http://localhost:8080';

const httpGet = async (path: string) => {
  const response = await fetch(`${API_HOST}/${path}`, {
    method: 'GET',
  });
  return response;
};

const httpPost = async (path: string, payload: FieldValues) => {
  const response = await fetch(`${API_HOST}/${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return response;
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
