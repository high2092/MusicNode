import * as S from './styles/SearchMusicInfoModal';

export const SearchMusicInfoModal = ({ thumbnail }) => {
  return (
    <S.SearchMusicInfoModal>
      <S.SearchMusicInfoModalThumbnail src={`data:image/jpeg;base64,${thumbnail}`} />
    </S.SearchMusicInfoModal>
  );
};
