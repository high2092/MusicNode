import { Music } from './Music';
import * as S from './styles/MusicList';

export const MusicList = ({ musicList, handleMusicClick }) => {
  return (
    <S.MusicList>
      {musicList.map(({ id, name, videoId }) => {
        return (
          <li key={`music-${id}`} onClick={handleMusicClick(id)}>
            <Music id={id} name={name} videoId={videoId} />
          </li>
        );
      })}
    </S.MusicList>
  );
};
