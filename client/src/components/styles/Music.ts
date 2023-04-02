import styled from '@emotion/styled';

const HIGHLIGHT_LEVEL_1_COLOR = '#fff9b0';
const HIGHLIGHT_LEVEL_2_COLOR = '#ffd384';

export const SelectableDiv = styled.div<{ count?: 0 | 1 | 2 }>`
  &:hover {
    background-color: ${(props) => (props.count === 1 ? `${HIGHLIGHT_LEVEL_2_COLOR}` : `${HIGHLIGHT_LEVEL_1_COLOR}`)};
  }
  ${(props) => (props.count === 2 ? `background-color: ${HIGHLIGHT_LEVEL_2_COLOR} !important;` : props.count === 1 ? `background-color: ${HIGHLIGHT_LEVEL_1_COLOR};` : '')}
  padding: 0.5rem 1rem;
`;
