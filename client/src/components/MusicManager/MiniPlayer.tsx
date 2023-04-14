import { useRecoilState } from 'recoil';
import * as S from '../styles/MiniPlayer';
import YouTube, { YouTubePlayer } from 'react-youtube';
import { currentMusicNodeInfoAtom, isPlayingAtom } from '../../store';
import { httpGet, shortenMusicName } from '../../utils/common';
import { usePrevMusicNodeStack } from '../hooks/usePrevMusicNodeStack';
import { useEffect, useRef } from 'react';

export const MiniPlayer = () => {
  const [currentMusicInfo, setCurrentMusicInfo] = useRecoilState(currentMusicNodeInfoAtom);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingAtom);
  const prevMusicNodeStack = usePrevMusicNodeStack();
  const youtubePlayerRef = useRef<YouTubePlayer>();

  const playNextNode = async () => {
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

  const handlePlayButtonClick = () => {
    if (!currentMusicInfo.id) return;
    setIsPlaying((isPlaying) => !isPlaying);
  };

  const handleSkipButtonClick = () => {
    if (!currentMusicInfo.id) return;
    playNextNode();
  };

  const handleGoPrevButtonClick = () => {
    if (prevMusicNodeStack.empty()) {
      alert('이전에 재생한 곡이 없어요.');
      return;
    }
    setCurrentMusicInfo(prevMusicNodeStack.pop());
  };

  useEffect(() => {
    if (!youtubePlayerRef.current) return;

    if (isPlaying) youtubePlayerRef.current.playVideo();
    else youtubePlayerRef.current.pauseVideo();
  }, [isPlaying]);

  return (
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
          onEnd={playNextNode}
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
  );
};
