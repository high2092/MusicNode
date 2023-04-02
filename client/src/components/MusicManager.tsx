import { useEffect, useRef, useState } from 'react';
import { httpGet, httpPost } from '../utils';
import { Music } from './Music';
import * as S from './styles/MusicManager';
import { FieldValues, useForm } from 'react-hook-form';
import { SearchResultList } from './SearchResultList';

export const MusicManager = ({ musicList, setMusicList, handleMusicClick, insert }) => {
  const { register, handleSubmit, getValues, setValue } = useForm();
  const searchButtonRef = useRef<HTMLButtonElement>();
  const [searchResultList, setSearchResultList] = useState([]);
  const [musicName, setMusicName] = useState(); // 서버에 전송되는 실제 값
  const musicNameInputRef = useRef<HTMLInputElement>();
  const [latestAutoSetMusicName, setLatestAutoSetMusicName] = useState<string>();

  const handleMusicSubmit = async (formData: FieldValues) => {
    const { videoId } = formData;

    const response = await httpPost('music', { name: musicName, videoId });

    if (response.ok) {
      const { id } = await response.json();
      setMusicList((musicList) => [...musicList, { id, name: musicName, videoId }]);
    }
  };

  const handleSearchButtonClick = async () => {
    if (!searchButtonRef.current) return;

    searchButtonRef.current.disabled = true;

    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?q=${musicName}&type=video&part=snippet&key=AIzaSyBRIksBm7Nk5plCJDZ3LOeUOjFzse9gf1w`, {
      method: 'GET',
    });

    setTimeout(() => {
      searchButtonRef.current.disabled = false;
    }, 1000);

    if (!response.ok) {
      console.log(response.statusText);
      return;
    }

    const { items } = await response.json();

    setSearchResultList(items.map(({ id: { videoId }, snippet: { title } }) => ({ title, videoId })));
  };

  const handleMusicNameInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearchButtonClick();
    }
  };

  const handleMusicNameInputChange = ({ target }) => {
    setMusicName(target.value);
  };

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

  return (
    <S.MusicManager>
      <div>
        <div>음악 목록</div>
        <S.MusicList>
          {musicList.map(({ id, name, videoId }) => {
            return (
              <li key={`music-${id}`} onClick={handleMusicClick(id)}>
                <Music id={id} name={name} videoId={videoId} />
              </li>
            );
          })}
        </S.MusicList>
      </div>

      <div>
        <div>음악 추가</div>
        <form onSubmit={handleSubmit(handleMusicSubmit)}>
          <S.MusicNameInput ref={musicNameInputRef} placeholder="이름" onKeyDown={handleMusicNameInputKeyDown} onChange={handleMusicNameInputChange} byUser={musicName !== latestAutoSetMusicName} />
          <button type="button" onClick={handleSearchButtonClick} ref={searchButtonRef}>
            검색
          </button>
          <input {...register('videoId')} placeholder="비디오 ID" />
          <button>음악 추가하기</button>
        </form>
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
      </div>
    </S.MusicManager>
  );
};
