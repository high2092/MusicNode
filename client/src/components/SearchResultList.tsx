import { useState } from 'react';
import { SelectableDiv } from './styles/common';
import { DragTransferTypes } from '../utils/ReactFlow';
import { DragTransferData } from '../domain/DragTransferData';
import * as S from './styles/SearchResultList';

type DragTransferType = typeof DragTransferTypes[keyof typeof DragTransferTypes];

interface SearchResultListProps {
  musicName;
  latestAutoSetMusicName;
  setLatestAutoSetMusicName;
  searchResultList: { title: string; videoId: string }[];
  getVideoIdInputValue;
  setMusicNameInputValue;
  setVideoIdInputValue;
}

export const SearchResultList = ({ musicName: name, latestAutoSetMusicName, setLatestAutoSetMusicName, searchResultList, getVideoIdInputValue, setMusicNameInputValue, setVideoIdInputValue }: SearchResultListProps) => {
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

  const handleDragStart = (e: React.DragEvent, data: DragTransferData) => {
    e.dataTransfer.setData('application/reactflow', JSON.stringify(data));
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    // <S.SearchResultListContainer>
    <S.SearchResultList>
      {searchResultList.map(({ videoId, title }) => (
        <SelectableDiv
          key={videoId}
          onClick={handleSearchResultClick(videoId, title)}
          count={calculateHighlightStrength(videoId, title)}
          onDragStart={(e) => handleDragStart(e, new DragTransferData({ videoId, musicName: title, type: DragTransferTypes.SEARCH_RESULT }))}
          draggable
        >
          {title}
        </SelectableDiv>
      ))}
    </S.SearchResultList>
    // </S.SearchResultListContainer>
  );
};
