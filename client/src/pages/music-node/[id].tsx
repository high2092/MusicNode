import { useRouter } from 'next/router';
import { httpGet } from '../../utils';
import YouTube from 'react-youtube';
import Link from 'next/link';

const Node = ({ id, musicId, musicName, videoId, next }) => {
  console.log(id, musicId, musicName, videoId, next);

  const router = useRouter();

  const handleVideoEnd = ({ target }) => {
    if (next) {
      if (id !== next) router.push(`/music-node/${next}`);
      target.playVideo();
    }
  };

  const jumpToNextNode = () => {
    if (next) router.push(`/music-node/${next}`);
  };

  return (
    <>
      <Link href="/music-node">목록</Link>
      <YouTube
        videoId={videoId}
        opts={{
          playerVars: {
            autoplay: 1,
          },
        }}
        onEnd={handleVideoEnd}
      />
      <button onClick={jumpToNextNode}>다음 노드: {next ?? '-'}</button>
    </>
  );
};

export const getServerSideProps = async ({ params: { id } }) => {
  const response = await httpGet(`node/${id}`);

  const { musicId, musicName, videoId, next } = await response.json();

  if (!musicId) return { props: {} };

  return { props: { musicId, musicName, videoId, next } };
};

export default Node;
