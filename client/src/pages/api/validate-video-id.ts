import { NextApiRequest, NextApiResponse } from 'next';

const validateVideoId = async (req: NextApiRequest, res: NextApiResponse) => {
  const { videoId } = req.query;
  const response = await fetch(`https://img.youtube.com/vi/${videoId}/0.jpg`, {
    method: 'GET',
  });

  return res.status(response.status).end();
};

export default validateVideoId;
