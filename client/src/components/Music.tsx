import * as S from './styles/Music';

interface MusicProps {
  id: number;
  name: string;
  videoId: string;
}

export const Music = ({ id, name, videoId }: MusicProps) => {
  return (
    <S.Music>
      {id} | {name} | {videoId}
    </S.Music>
  );
};
