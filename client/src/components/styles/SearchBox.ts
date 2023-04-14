import styled from '@emotion/styled';

export const SearchBox = styled.div`
  flex: 3;
  overflow-x: visible;
  overflow-y: hidden;
`;

export const SearchInputSection = styled.div`
  input {
    width: 5rem;
  }
`;

export const SearchInput = styled.input<{ isValid: boolean }>`
  ${(props) => !props.isValid && 'color: red;'}
`;

export const MusicNameInput = styled.input<{ byUser: boolean }>`
  ${(props) => (props.byUser ? '' : 'color: #888888')}
`;
