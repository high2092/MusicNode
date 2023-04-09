import styled from '@emotion/styled';

const MARGIN = 5;

export const PlaylistModal = styled.div<{ x: number; y: number }>`
  position: absolute;
  display: flex;
  flex-direction: column;

  top: ${(props) => `${props.y + MARGIN}px`};
  left: ${(props) => `${props.x + MARGIN}px`};
  border: 1px solid black;
  background-color: white;
`;

export const Playlist = styled.div`
  max-width: 20rem;
  max-height: 10rem;
  overflow-y: scroll;

  display: flex;
  flex-direction: column;
`;

export const MusicInfo = styled.div`
  border: 1px solid black;
`;

export const PlaylistSubmitForm = styled.form`
  display: flex;
`;
export const PlaylistNameInput = styled.input`
  flex-grow: 1;
`;

export const PlaylistCreateButton = styled.button`
  width: 7rem;
  bottom: 0;
`;
