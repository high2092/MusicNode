import { NextApiRequest, NextApiResponse } from 'next';

const searchYouTubeVideo = async (req: NextApiRequest, res: NextApiResponse) => {
  const API_KEY = process.env.API_KEY;
  const musicName = req.query.musicName as string;
  const response = await fetch(`https://www.googleapis.com/youtube/v3/search?q=${encodeURIComponent(musicName)}&type=video&part=snippet&key=${API_KEY}`, {
    method: 'GET',
  });

  res.status(response.status);
  if (response.ok) res.json(await response.json());

  return res.end();
};

export default searchYouTubeVideo;
