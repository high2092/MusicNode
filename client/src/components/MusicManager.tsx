import * as S from './styles/MusicManager';
import { MiniPlayer } from './MusicManager/MiniPlayer';
import { SearchBox } from './MusicManager/SearchBox';
import { MusicList } from './MusicManager/MusicList';

export const MusicManager = () => {
  return (
    <S.MusicManager>
      <MusicList />
      <SearchBox />
      <MiniPlayer />
    </S.MusicManager>
  );
};
