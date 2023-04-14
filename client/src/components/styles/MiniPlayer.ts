import styled from '@emotion/styled';

export const MiniPlayer = styled.div`
  flex: 3;

  display: flex;

  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

export const MiniPlayerDecoration = styled.div`
  flex: 2;
  display: flex;
  justify-content: space-around;
  align-items: center;

  * {
    text-align: center;
  }

  width: 80%;
`;

export const MiniPlayerDecorationImoticonText = styled.div`
  width: 3rem;
`;

export const MiniPlayerDecorationNowPlayingText = styled.div`
  flex-grow: 1;
`;

export const MiniPlayerMusicInfo = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const MiniPlayerController = styled.div`
  flex: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 30%;
`;

export const MiniPlayMusicTitle = styled.div`
  font-size: 0.9rem;
`;
