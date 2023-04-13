import { NextApiRequest, NextApiResponse } from 'next';
import { httpGet } from '../../../utils/common';

const oauthLogin = async (req: NextApiRequest, res: NextApiResponse) => {
  const response = await httpGet('auth/login/kakao');

  return res.status(response.status).end();
};

export default oauthLogin;
