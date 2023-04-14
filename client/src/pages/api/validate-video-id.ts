import { NextApiRequest, NextApiResponse } from 'next';

const validateVideoId = async (req: NextApiRequest, res: NextApiResponse) => {
  const { videoId } = req.query;
  const response = await fetch(`https://img.youtube.com/vi/${videoId}/0.jpg`, {
    method: 'GET',
  });

  const imageBuffer = await response.arrayBuffer();

  return res.json({
    isValid: response.ok,
    thumbnail: Buffer.from(imageBuffer).toString('base64'),
  });
};

export default validateVideoId;
