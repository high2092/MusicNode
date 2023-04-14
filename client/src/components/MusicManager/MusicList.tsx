import { useRecoilState } from 'recoil';
import * as S from '../styles/MusicList';
import { musicMapAtom } from '../../store';
import { useEffect, useState } from 'react';
import { MusicComponent } from './MusicList/Music';

class SearchFilter {
  static trim(value: string) {
    return value.toLowerCase().replace(/(\s*)/g, '');
  }

  static filter(collection: IMusic[], query: string) {
    return collection.filter(({ name }) => {
      return this.trim(name).includes(this.trim(query));
    });
  }
}

export const MusicList = () => {
  const [musicMap, setMusicMap] = useRecoilState(musicMapAtom);
  const [selectedMusicId, setSelectedMusicId] = useState<number>();
  const [hoveredMusicId, setHoveredMusicId] = useState<number>();
  const [query, setQuery] = useState<string>('');

  const filteredMusicList = SearchFilter.filter(Array.from(musicMap.values()), query);

  const handleMusicClick = (id: number) => {
    setSelectedMusicId(id);
  };

  const handleMusicMouseOver = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setHoveredMusicId(id);
  };

  useEffect(() => {
    const resetHoveredMusic = () => {
      setHoveredMusicId(null);
    };

    document.addEventListener('mouseover', resetHoveredMusic);
    return () => {
      document.removeEventListener('mouseover', resetHoveredMusic);
    };
  }, []);

  return (
    <S.MusicListSection>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>음악 목록</div>
        <div>
          <label>필터</label>
          <input onChange={(e) => setQuery(e.target.value)} />
        </div>
      </div>
      <S.MusicList>
        {filteredMusicList.map(({ id, name, videoId }) => {
          return (
            <li key={`music-${id}`} onClick={() => handleMusicClick(id)} onMouseOver={(e) => handleMusicMouseOver(e, id)}>
              <MusicComponent id={id} name={name} videoId={videoId} selected={selectedMusicId === id} hovered={hoveredMusicId === id} />
            </li>
          );
        })}
      </S.MusicList>
    </S.MusicListSection>
  );
};
