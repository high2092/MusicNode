import styled from '@emotion/styled';

export const SignUpPage = styled.div`
  width: 100vw;
  height: 97vh;

  display: flex;
  justify-content: center;
  align-items: center;
`;

export const SignUpFormContainer = styled.div`
  margin-top: -10%;

  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const SignUpForm = styled.form`
  position: relative;

  width: max-content;

  padding: 3rem 4rem 4rem 2rem;

  border-radius: 20px;
  box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.2);

  display: flex;
`;

export const SignUpFormInputLabelSection = styled.div`
  width: 12rem;
  height: fit-content;
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-gap: 0.2rem 0;

  padding: 0 1rem;
`;

export const SignUpButton = styled.button`
  position: absolute;
  bottom: 1rem;
  right: 1rem;
`;
