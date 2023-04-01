import { httpGet } from '../../utils';
import YouTube from 'react-youtube';

const Node = ({ id, musicId, musicName, videoId }) => {
  console.log(id, musicId, musicName, videoId);
  return <YouTube videoId={videoId} />;
};

export const getServerSideProps = async ({ params: { id } }) => {
  const response = await httpGet(`node/${id}`);

  const { musicId, musicName, videoId } = await response.json();

  if (!musicId) return { props: {} };

  return { props: { musicId, musicName, videoId } };
};

export default Node;
