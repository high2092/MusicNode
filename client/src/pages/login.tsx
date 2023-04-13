/** @jsxImportSource @emotion/react */
import { FieldValues, useForm } from 'react-hook-form';
import { httpPost } from '../utils/common';
import { useRouter } from 'next/router';
import * as S from '../styles/login';
import { API_HOST } from '../constants';
import { css } from '@emotion/react';

const LoginPage = () => {
  const router = useRouter();
  const { register, handleSubmit } = useForm();

  const handleLogin = async (formData: FieldValues) => {
    const response = await httpPost('auth/login', formData);

    if (response.ok) router.push('/');
  };

  return (
    <S.LoginPage>
      <S.LogoText>Music Node</S.LogoText>
      <S.LoginForm onSubmit={handleSubmit(handleLogin)}>
        <div css={css({ display: 'flex', flexDirection: 'column' })}>
          <S.LoginFormBased onSubmit={handleSubmit(handleLogin)}>
            <S.LoginFormInputSection>
              <input {...register('uid')} placeholder="ID" />
              <input type="password" {...register('password')} placeholder="PW" />
            </S.LoginFormInputSection>
            <button type="submit">로그인</button>
          </S.LoginFormBased>
          <S.SignUpAnchor href="/signup">회원가입</S.SignUpAnchor>
        </div>
        <a href={`${API_HOST}/auth/login/kakao`}>
          <S.KakaoLoginButtonImage src="image/kakao_login_large.png" />
        </a>
      </S.LoginForm>
    </S.LoginPage>
  );
};

export default LoginPage;
