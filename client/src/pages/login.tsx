import { FieldValues, useForm } from 'react-hook-form';
import { httpPost } from '../utils/common';
import { useRouter } from 'next/router';

const LoginPage = () => {
  const router = useRouter();
  const { register, handleSubmit } = useForm();

  const handleLogin = async (formData: FieldValues) => {
    const response = await httpPost('auth/login', formData);

    console.log(response);

    if (response.ok) {
      const { id } = await response.json();
      alert(`your id = ${id}`);
      router.push('/');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(handleLogin)}>
        <input {...register('uid')} placeholder="ID" />
        <input type="password" {...register('password')} placeholder="PW" />
        <button>로그인</button>
      </form>
    </div>
  );
};

export default LoginPage;
