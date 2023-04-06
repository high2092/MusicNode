import { useEffect, useRef, useState } from 'react';
import { httpGet, httpPost, shortenMusicName } from '../utils/common';
import { Music } from './Music';
import * as S from './styles/MusicManager';
import { FieldValues, useForm } from 'react-hook-form';
import { SearchResultList } from './SearchResultList';
import { useRecoilState } from 'recoil';
import { currentMusicNodeInfoAtom, isPlayingAtom } from '../store';
import YouTube from 'react-youtube';

class SearchFilter {
  trim(value: string) {
    return value.toLowerCase().replace(/(\s*)/g, '');
  }
  filter(collection: IMusic[], query: string) {
    return collection.filter(({ name }) => {
      return this.trim(name).includes(this.trim(query));
    });
  }
}

export const MusicManager = ({ musicList, setMusicList, handleMusicClick, youtubePlayerRef }) => {
  const { register, handleSubmit, getValues, setValue } = useForm();
  const searchButtonRef = useRef<HTMLButtonElement>();
  const [searchResultList, setSearchResultList] = useState([]);
  const [musicName, setMusicName] = useState(); // 서버에 전송되는 실제 값
  const musicNameInputRef = useRef<HTMLInputElement>();
  const [latestAutoSetMusicName, setLatestAutoSetMusicName] = useState<string>();
  const [selectedMusicId, setSelectedMusicId] = useState<number>();
  const searchFilter = new SearchFilter();
  const [query, setQuery] = useState<string>('');
  const [currentMusicInfo, setCurrentMusicInfo] = useRecoilState(currentMusicNodeInfoAtom);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingAtom);

  const filteredMusicList = searchFilter.filter(musicList, query);

  useEffect(() => {
    if (!youtubePlayerRef.current) return;

    if (isPlaying) youtubePlayerRef.current.playVideo();
    else youtubePlayerRef.current.pauseVideo();
  }, [isPlaying]);

  const handleMusicSubmit = async (formData: FieldValues) => {
    const { videoId } = formData;

    let response: Response;
    response = await fetch(`http://img.youtube.com/vi/${videoId}/mqdefault.jpg`, {
      method: 'GET',
    });

    if (!response.ok) {
      alert('유효하지 않은 비디오 ID입니다.');
      return;
    }

    response = await httpPost('music', { name: musicName, videoId });

    if (response.ok) {
      const { id } = await response.json();
      setMusicList((musicList) => [...musicList, { id, name: musicName, videoId }]);
    }
  };

  const handleSearchButtonClick = async () => {
    if (!searchButtonRef.current) return;

    searchButtonRef.current.disabled = true;

    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?q=${encodeURIComponent(musicName)}&type=video&part=snippet&key=AIzaSyBRIksBm7Nk5plCJDZ3LOeUOjFzse9gf1w`, {
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

  const _handleMusicClick = (id: number) => () => {
    handleMusicClick(id)();
    setSelectedMusicId(id);
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

  const handleVideoEnd = () => {
    jumpToNextNode();
  };

  const handlePlayButtonClick = () => {
    if (!currentMusicInfo.id) return;
    setIsPlaying((isPlaying) => !isPlaying);
  };

  const handleSkipButtonClick = () => {
    if (!currentMusicInfo.id) return;
    jumpToNextNode();
  };

  const jumpToNextNode = async () => {
    const { id } = currentMusicInfo;
    let response = await httpGet(`node/${id}/next`);

    const { id: next } = await response.json();

    if (!next) {
      alert('마지막 노드입니다.');
      return;
    }

    response = await httpGet(`node/${next}`);

    const { musicId, musicName, videoId } = await response.json();

    setCurrentMusicInfo({ id: next, musicName, videoId });
  };

  return (
    <S.MusicManager>
      <div>
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
              <li key={`music-${id}`} onClick={_handleMusicClick(id)}>
                <Music id={id} name={name} videoId={videoId} selected={selectedMusicId === id} />
              </li>
            );
          })}
        </S.MusicList>
      </div>

      <S.SearchBox>
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
      </S.SearchBox>
      <S.MiniPlayer>
        <S.MiniPlayerDecoration>
          <S.MiniPlayerDecorationImoticonText>٩( ᐛ )و</S.MiniPlayerDecorationImoticonText>
          <S.MiniPlayerDecorationNowPlayingText>{`~ Now Playing ~`}</S.MiniPlayerDecorationNowPlayingText>
          <S.MiniPlayerDecorationImoticonText>٩(ˊᗜˋ*)و</S.MiniPlayerDecorationImoticonText>
        </S.MiniPlayerDecoration>
        <S.MiniPlayerMusicInfo>
          <YouTube
            videoId={currentMusicInfo.videoId}
            opts={{
              width: 360,
              height: 180,
              playerVars: {
                autoplay: 1,
              },
            }}
            onEnd={handleVideoEnd}
            onReady={({ target }) => {
              youtubePlayerRef.current = target;
            }}
          />
          <S.MiniPlayMusicTitle>{shortenMusicName(currentMusicInfo.musicName)}</S.MiniPlayMusicTitle>
        </S.MiniPlayerMusicInfo>
        <S.MiniPlayerController>
          <div>{`<<`}</div>
          <div onClick={handlePlayButtonClick}>{isPlaying ? `||` : '▶︎'}</div>
          <div onClick={handleSkipButtonClick}>{`>>`}</div>
        </S.MiniPlayerController>
      </S.MiniPlayer>
    </S.MusicManager>
  );
};
