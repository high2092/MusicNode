import styled from '@emotion/styled';

export const MusicManager = styled.div`
  display: flex;

  & > * {
    flex: 1;
    padding: 1rem;
    margin: 0.2rem;
    border: 1px solid black;
    border-radius: 5px;
  }
`;

export const MusicList = styled.ul`
  flex-grow: 1;
  height: 30vh;
  overflow: scroll;
`;

export const MusicNameInput = styled.input<{ byUser: boolean }>`
  ${(props) => (props.byUser ? '' : 'color: #888888')}
`;
