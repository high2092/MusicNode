import { useState } from 'react';
import * as S from './styles/Music';

export const SearchResultList = ({ musicName: name, latestAutoSetMusicName, setLatestAutoSetMusicName, searchResultList, getVideoIdInputValue, setMusicNameInputValue, setVideoIdInputValue }) => {
  const [selectedSearchResultId, setSelectedSearchResultId] = useState<string>();

  const handleSearchResultClick = (videoId: string, title) => () => {
    if (name === latestAutoSetMusicName || name === '' || getVideoIdInputValue() === videoId) {
      _setMusicNameInputValue(title);
    }
    setVideoIdInputValue(videoId);

    setSelectedSearchResultId(videoId); // videoId를 식별자로 사용해도 괜찮겠지..?
  };

  const _setMusicNameInputValue = (title) => {
    setMusicNameInputValue(title);
    setLatestAutoSetMusicName(title);
  };

  const calculateHighlightStrength = (id, title) => {
    if (id !== selectedSearchResultId) return 0;
    if (title === name) return 2;
    return 1;
  };

  return (
    <div>
      {searchResultList.map(({ videoId, title }) => (
        <S.SelectableDiv key={videoId} onClick={handleSearchResultClick(videoId, title)} count={calculateHighlightStrength(videoId, title)}>
          {title}
        </S.SelectableDiv>
      ))}
    </div>
  );
};
