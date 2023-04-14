import styled from '@emotion/styled';

export const ReactFlowOption = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const TopBarRight = styled.div`
  position: absolute;
  top: 0;
  right: 0;

  display: flex;

  > * {
    margin-left: 0.3rem;
  }
`;

export const PlaylistAnchor = styled.a`
  font-size: 0.8rem;
  color: black;

  :hover {
    color: #87cbb9;
  }
`;

export const LogoutButton = styled.button``;
