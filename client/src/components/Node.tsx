import * as S from './styles/Node';
import { useRouter } from 'next/router';

export const Node = ({ id, prev, next }) => {
  const router = useRouter();

  const handleNodeClick = () => {
    router.push(`/music-node/${id}`);
  };

  return <S.Node onClick={handleNodeClick}>{`${prev ?? '-'} | ${id} | ${next ?? '-'}`}</S.Node>;
};
