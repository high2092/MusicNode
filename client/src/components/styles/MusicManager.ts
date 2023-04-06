import styled from '@emotion/styled';

export const MusicManager = styled.div`
  display: flex;

  & > * {
    padding: 1rem;
    height: 34vh;
    margin: 0.2rem;
    border: 1px solid black;
    border-radius: 5px;
  }
`;

export const MusicList = styled.ul`
  width: 40vw;
  height: 30vh;
  overflow: scroll;
`;

export const SearchBox = styled.div`
  min-width: 10vw;
  overflow-x: visible;
  overflow-y: hidden;
`;

export const SearchInputSection = styled.div`
  input {
    width: 5rem;
  }
`;

export const MiniPlayer = styled.div`
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

export const MusicNameInput = styled.input<{ byUser: boolean }>`
  ${(props) => (props.byUser ? '' : 'color: #888888')}
`;
