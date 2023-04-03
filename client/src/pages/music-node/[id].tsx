import { useRouter } from 'next/router';
import { httpGet } from '../../utils';
import YouTube from 'react-youtube';
import Link from 'next/link';

const Node = ({ id, musicId, musicName, videoId, next }) => {
  console.log(id, musicId, musicName, videoId, next);

  const router = useRouter();

  const handleVideoEnd = () => {
    jumpToNextNode();
  };

  const jumpToNextNode = async () => {
    const response = await httpGet(`node/${id}/next`);

    const { id: next } = await response.json();

    if (!next) {
      alert('마지막 노드입니다.');
      return;
    }

    if (id !== next) router.push(`/music-node/${next}`);
  };

  return (
    <>
      <Link href="/">목록</Link>
      <YouTube
        videoId={videoId}
        opts={{
          playerVars: {
            autoplay: 1,
          },
        }}
        onEnd={handleVideoEnd}
      />
      <button onClick={jumpToNextNode}>다음 노드로</button>
    </>
  );
};

export const getServerSideProps = async ({ params: { id } }) => {
  const response = await httpGet(`node/${id}`);

  const { musicId, musicName, videoId, next } = await response.json();

  if (!musicId) return { props: {} };

  return { props: { id, musicId, musicName, videoId, next } };
};

export default Node;
