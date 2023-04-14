import { FieldValues, useForm } from 'react-hook-form';
import * as S from '../styles/SearchBox';
import { SearchResultList } from '../SearchResultList';
import { SearchMusicInfoModal } from '../SearchMusicInfoModal';
import { httpPost, validateVideoId } from '../../utils/common';
import { useRef, useState } from 'react';
import { Music } from '../../domain/Music';
import { musicMapAtom } from '../../store';
import { useRecoilState } from 'recoil';

export const SearchBox = () => {
  const [musicMap, setMusicMap] = useRecoilState(musicMapAtom);
  const [searchResultList, setSearchResultList] = useState([]);
  const [musicName, setMusicName] = useState();
  const [videoIdInputted, setVideoIdInputted] = useState(false);
  const [latestAutoSetMusicName, setLatestAutoSetMusicName] = useState<string>();
  const musicNameInputRef = useRef<HTMLInputElement>();
  const [isValidVideoIdInputValue, setIsValidVideoIdInputValue] = useState(false);
  const [thumbnail, setThumbnail] = useState('');
  const searchButtonRef = useRef<HTMLButtonElement>();

  const { register, handleSubmit, setValue, getValues } = useForm();

  const getVideoIdInputValue = () => {
    return getValues('videoId');
  };

  const setMusicNameInputValue = (name) => {
    setMusicName(name);
    musicNameInputRef.current.value = name;
  };

  const setVideoIdInputValue = (videoId) => {
    setValue('videoId', videoId);
  };

  const handleMusicSubmit = async (formData: FieldValues) => {
    const { videoId } = formData;

    if (!(await validateVideoId(videoId))) {
      setIsValidVideoIdInputValue(false);
      return;
    }

    const response = await httpPost('music', { name: musicName, videoId });

    if (response.ok) {
      const { id } = await response.json();
      setMusicMap((musicMap) => new Map(musicMap.set(id, new Music({ id, name: musicName, videoId }))));
    }
  };

  const handleSearchButtonClick = async () => {
    if (!searchButtonRef.current) return;

    searchButtonRef.current.disabled = true;

    setTimeout(() => {
      searchButtonRef.current.disabled = false;
    }, 1000);

    const response = await fetch(`/api/search-youtube?musicName=${musicName}`, {
      method: 'GET',
    });

    if (!response.ok) {
      console.log(response.statusText);
      return;
    }

    const { items } = await response.json();

    setSearchResultList(items.map(({ id: { videoId }, snippet: { title } }) => ({ title, videoId })));
  };

  const handleMusicNameInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearchButtonClick();
    }
  };

  const handleMusicNameInputChange = ({ target }) => {
    setMusicName(target.value);
  };

  const handleSearchInputChange = async (e: React.ChangeEvent) => {
    const target = e.target as HTMLInputElement;

    let videoId = target.value;

    const regex = /^https?:\/\/(?:www\.)?youtube\.com\/watch\?v=([^&]+)/;
    const match = videoId.match(regex);
    if (match) {
      videoId = match[1];
      setValue('videoId', videoId);
    }

    const { isValid, thumbnail } = await validateVideoId(videoId);
    setIsValidVideoIdInputValue(isValid);

    setThumbnail(isValid ? thumbnail : '');
    setVideoIdInputted(target.value.length !== 0);
  };

  return (
    <S.SearchBox>
      <S.SearchInputSection>
        <div>음악 추가</div>
        <form onSubmit={handleSubmit(handleMusicSubmit)}>
          <S.MusicNameInput ref={musicNameInputRef} placeholder="이름" onKeyDown={handleMusicNameInputKeyDown} onChange={handleMusicNameInputChange} byUser={musicName !== latestAutoSetMusicName} />
          <button type="button" onClick={handleSearchButtonClick} ref={searchButtonRef}>
            검색
          </button>

          <S.SearchInput {...register('videoId')} placeholder="비디오 ID" onChange={handleSearchInputChange} isValid={isValidVideoIdInputValue || !videoIdInputted} />
          <button>음악 추가하기</button>
        </form>
      </S.SearchInputSection>
      <div>검색 결과</div>
      <SearchResultList
        musicName={musicName}
        searchResultList={searchResultList}
        latestAutoSetMusicName={latestAutoSetMusicName}
        setLatestAutoSetMusicName={setLatestAutoSetMusicName}
        getVideoIdInputValue={getVideoIdInputValue}
        setMusicNameInputValue={setMusicNameInputValue}
        setVideoIdInputValue={setVideoIdInputValue}
      />
      {videoIdInputted && <SearchMusicInfoModal thumbnail={thumbnail} />}
    </S.SearchBox>
  );
};
