import { NextApiRequest, NextApiResponse } from 'next';

const searchYouTubeVideo = async (req: NextApiRequest, res: NextApiResponse) => {
  const API_KEY = process.env.API_KEY;
  const musicName = req.query.musicName as string;
  const response = await fetch(`https://www.googleapis.com/youtube/v3/search?q=${encodeURIComponent(musicName)}&type=video&part=snippet&key=${API_KEY}`, {
    method: 'GET',
  });

  const imageBuffer = await response.arrayBuffer();

  return res.json({
    isValid: response.ok,
    thumbnail: Buffer.from(imageBuffer).toString('base64'),
  });
};

export default searchYouTubeVideo;
