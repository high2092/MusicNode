import styled from '@emotion/styled';

const SEARCH_MUSIC_INFO_MODAL_BORDER_RADIUS = '5px';

export const SearchMusicInfoModal = styled.div`
  position: absolute;
  top: 21.5rem;
  left: 49.7%;

  width: 13rem;
  height: 8rem;

  padding: 0.2rem;

  background-color: white;
  border-radius: ${SEARCH_MUSIC_INFO_MODAL_BORDER_RADIUS};
  border: 1px solid black;
`;

export const SearchMusicInfoModalThumbnail = styled.img`
  width: 13rem;
  height: 8rem;

  border-radius: ${SEARCH_MUSIC_INFO_MODAL_BORDER_RADIUS};
`;
