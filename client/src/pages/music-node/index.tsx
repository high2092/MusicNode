import { useState } from 'react';
import { httpGet, httpPost } from '../../utils';
import { FieldValues, useForm } from 'react-hook-form';
import { NodeList } from '../../components/NodeList';
import { MusicList } from '../../components/MusicList';

interface NodePageProps {
  initialMusicList: IMusic[];
  initialMusicNodeList: IMusicNode[];
}

const NodePage = ({ initialMusicList, initialMusicNodeList }: NodePageProps) => {
  const [musicList, setMusicList] = useState<IMusic[]>(initialMusicList);
  const [musicNodeList, setMusicNodeList] = useState<IMusicNode[]>(initialMusicNodeList);

  console.log(initialMusicList, initialMusicNodeList);

  const { register, handleSubmit, setValue } = useForm();

  const handleMusicClick = (id: number) => () => {
    setValue('musicId', id);
    console.log(id);
  };

  const handleCreateMusicNode = async (formData: FieldValues) => {
    const { musicId, color } = formData;

    const response = await httpPost('node', { musicId, color });

    if (response.ok) {
      const { id } = await response.json();

      const music = musicList.find((music) => music.id === musicId);
      setMusicNodeList((musicNodeList) => [
        ...musicNodeList,
        {
          id,
          musicId: music.id,
          musicName: music.name,
          videoId: music.videoId,
          next: undefined,
        },
      ]);
    }
  };

  return (
    <div>
      <div>
        <div>노드 목록</div>
        <NodeList musicNodeList={musicNodeList} />
        <form onSubmit={handleSubmit(handleCreateMusicNode)}>
          <label>MUSIC ID</label>
          <input {...register('musicId')} disabled />
          <button>노드 생성하기</button>
        </form>
      </div>
      <hr />
      <div>
        <div>음악 목록</div>
        <MusicList musicList={musicList} handleMusicClick={handleMusicClick} />
      </div>
    </div>
  );
};

export const getServerSideProps = async () => {
  let response: Response;

  response = await httpGet('musics');
  const { data: initialMusicList } = response.ok ? await response.json() : { data: [] };

  response = await httpGet('node');
  const { data: initialMusicNodeList } = response.ok ? await response.json() : { data: [] };

  return {
    props: {
      initialMusicList,
      initialMusicNodeList,
    },
  };
};

export default NodePage;
