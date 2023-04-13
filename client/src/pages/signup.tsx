import { FieldValues, useForm } from 'react-hook-form';
import * as S from '../styles/signup';
import { httpPost } from '../utils/common';
import { useRouter } from 'next/router';
import { Logo } from '../components/Logo';

const SignUpPage = () => {
  const { register, handleSubmit } = useForm();
  const router = useRouter();

  const handleSignUp = async (formData: FieldValues) => {
    const { uid, name, password } = formData;

    // TODO: 클라이언트 측 유효성 검증
    const response = await httpPost('auth/register', { uid, name, password });

    if (response.ok) router.push('/login');
    else console.error(response.status);
  };

  return (
    <S.SignUpPage>
      <S.SignUpFormContainer>
        <Logo />
        <S.SignUpForm onSubmit={handleSubmit(handleSignUp)}>
          <S.SignUpFormInputLabelSection>
            <label>닉네임</label>
            <input {...register('name')} />

            <label>ID</label>
            <input {...register('uid')} />

            <label>PW</label>
            <input type="password" {...register('password')} />

            <label>PW 확인</label>
            <input type="password" {...register('confirmPassword')} />
          </S.SignUpFormInputLabelSection>
          <S.SignUpButton>회원가입</S.SignUpButton>
        </S.SignUpForm>
      </S.SignUpFormContainer>
    </S.SignUpPage>
  );
};

export default SignUpPage;
