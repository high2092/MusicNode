import styled from '@emotion/styled';

export const LoginPage = styled.div`
  width: 100%;
  height: 97vh;

  display: flex;
  flex-direction: column;

  /* justify-content: center; */
  align-items: center;
`;

export const LogoText = styled.div`
  font-size: 2rem;

  margin-top: 15%;
`;

export const LoginForm = styled.form`
  width: max-content;

  padding: 2rem;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  padding-bottom: 0.5rem;

  border-radius: 20px;
  box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.2);
`;

export const LoginFormBased = styled.div`
  display: flex;
`;

export const LoginFormInputSection = styled.div`
  display: flex;
  flex-direction: column;
`;

export const SignUpAnchor = styled.a`
  margin-left: auto;

  font-size: 0.5rem;
  text-decoration: none;

  color: black;

  :hover {
    color: #87cbb9;
  }
`;

export const KakaoLoginButtonImage = styled.img`
  width: 4rem;

  cursor: pointer;
`;
