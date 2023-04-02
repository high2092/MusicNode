import * as S from './styles/Music';

interface MusicProps {
  id: number;
  name: string;
  videoId: string;
  selected: boolean;
}

export const Music = ({ id, name, videoId, selected }: MusicProps) => {
  return (
    <S.SelectableDiv count={Number(selected) as 0 | 1}>
      {id} | {name} | {videoId}
    </S.SelectableDiv>
  );
};
