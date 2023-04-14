import { Ref, useEffect, useRef, useState } from 'react';
import { httpGet, httpPost, shortenMusicName, validateVideoId } from '../utils/common';
import { MusicComponent } from './Music';
import * as S from './styles/MusicManager';
import { FieldValues, useForm } from 'react-hook-form';
import { SearchResultList } from './SearchResultList';
import { useRecoilState } from 'recoil';
import { currentMusicNodeInfoAtom, isPlayingAtom, musicMapAtom } from '../store';
import YouTube, { YouTubePlayer } from 'react-youtube';
import { usePrevMusicNodeStack } from './hooks/usePrevMusicNodeStack';
import { Music } from '../domain/Music';
import { SearchMusicInfoModal } from './SearchMusicInfoModal';

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

interface MusicManagerProps {
  handleMusicClick: () => void;
  youtubePlayerRef: Ref<YouTubePlayer>;
}

export const MusicManager = ({ handleMusicClick, youtubePlayerRef }) => {
  const { register, handleSubmit, getValues, setValue } = useForm();

  const searchButtonRef = useRef<HTMLButtonElement>();
  const [searchResultList, setSearchResultList] = useState([]);
  const [musicName, setMusicName] = useState(); // 서버에 전송되는 실제 값
  const [videoIdInputted, setVideoIdInputted] = useState(false);
  const musicNameInputRef = useRef<HTMLInputElement>();
  const [isValidVideoIdInputValue, setIsValidVideoIdInputValue] = useState(false);
  const [thumbnail, setThumbnail] = useState('');

  const [latestAutoSetMusicName, setLatestAutoSetMusicName] = useState<string>();
  const [selectedMusicId, setSelectedMusicId] = useState<number>();
  const searchFilter = new SearchFilter();
  const [query, setQuery] = useState<string>('');
  const [currentMusicInfo, setCurrentMusicInfo] = useRecoilState(currentMusicNodeInfoAtom);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingAtom);
  const prevMusicNodeStack = usePrevMusicNodeStack();
  const [musicMap, setMusicMap] = useRecoilState(musicMapAtom);
  const [hoveredMusicId, setHoveredMusicId] = useState<number>();

  const filteredMusicList = searchFilter.filter(Array.from(musicMap.values()), query);

  useEffect(() => {
    if (!youtubePlayerRef.current) return;

    if (isPlaying) youtubePlayerRef.current.playVideo();
    else youtubePlayerRef.current.pauseVideo();
  }, [isPlaying]);

  useEffect(() => {
    const resetHoveredMusic = () => {
      setHoveredMusicId(null);
    };

    document.addEventListener('mouseover', resetHoveredMusic);

    return () => {
      document.removeEventListener('mouseover', resetHoveredMusic);
    };
  }, []);

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

  const handleGoPrevButtonClick = () => {
    if (prevMusicNodeStack.empty()) {
      alert('이전에 재생한 곡이 없어요.');
      return;
    }
    setCurrentMusicInfo(prevMusicNodeStack.pop());
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

    prevMusicNodeStack.push(currentMusicInfo);
    setCurrentMusicInfo({ id: next, musicName, videoId });
  };

  const handleMusicMouseOver = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setHoveredMusicId(id);
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
    <S.MusicManager>
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
              <li key={`music-${id}`} onClick={_handleMusicClick(id)} onMouseOver={(e) => handleMusicMouseOver(e, id)}>
                <MusicComponent id={id} name={name} videoId={videoId} selected={selectedMusicId === id} hovered={hoveredMusicId === id} />
              </li>
            );
          })}
        </S.MusicList>
      </S.MusicListSection>

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
            onPause={() => setIsPlaying(false)}
            onPlay={() => setIsPlaying(true)}
            onEnd={handleVideoEnd}
            onReady={({ target }) => {
              youtubePlayerRef.current = target;
            }}
          />
          <S.MiniPlayMusicTitle>{shortenMusicName(currentMusicInfo.musicName)}</S.MiniPlayMusicTitle>
        </S.MiniPlayerMusicInfo>
        <S.MiniPlayerController>
          <div onClick={handleGoPrevButtonClick}>{`<<`}</div>
          <div onClick={handlePlayButtonClick}>{isPlaying ? `||` : '▶︎'}</div>
          <div onClick={handleSkipButtonClick}>{`>>`}</div>
        </S.MiniPlayerController>
      </S.MiniPlayer>
    </S.MusicManager>
  );
};
