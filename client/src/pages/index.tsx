import { useState } from 'react';
import { httpGet, httpPost } from '../utils';
import { FieldValues, useForm } from 'react-hook-form';
import { NodeList } from '../components/NodeList';
import { MusicManager } from '../components/MusicManager';

interface NodePageProps {
  initialMusicList: IMusic[];
  initialMusicNodeList: IMusicNode[];
  nodeCountInRow: number;
}

const Home = ({ initialMusicList, initialMusicNodeList, nodeCountInRow }: NodePageProps) => {
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
        <NodeList musicNodeList={musicNodeList} nodeCountInRow={nodeCountInRow} />
        <form onSubmit={handleSubmit(handleCreateMusicNode)}>
          <label>MUSIC ID</label>
          <input {...register('musicId')} disabled />
          <button>노드 생성하기</button>
        </form>
      </div>
      <hr />
      <div>
        <MusicManager
          musicList={musicList}
          setMusicList={setMusicList}
          handleMusicClick={handleMusicClick}
          insert={({ id, name, videoId }) => {
            setMusicList((musicList) => [
              ...musicList,
              {
                id,
                name,
                videoId,
              },
            ]);
          }}
        />
      </div>
    </div>
  );
};

const DEFAULT_NODE_COUNT_IN_A_ROW = 5;

export const getServerSideProps = async () => {
  let response: Response;

  response = await httpGet('musics');
  const { data: initialMusicList } = response.ok ? await response.json() : { data: [] };

  response = await httpGet('node');
  const { data: initialMusicNodeList } = response.ok ? await response.json() : { data: [] };

  response = await httpGet(`member/row`);
  const { count: nodeCountInRow } = response.ok ? await response.json() : { count: DEFAULT_NODE_COUNT_IN_A_ROW };

  return {
    props: {
      initialMusicList,
      initialMusicNodeList,
      nodeCountInRow,
    },
  };
};

export default Home;
