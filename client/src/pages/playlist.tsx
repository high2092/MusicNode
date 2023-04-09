import { AxiosResponse } from 'axios';
import { GetServerSidePropsContext } from 'next';
import { axiosHttpGet } from '../utils/common';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { playlistMapAtom } from '../store';
import { Playlist } from '../components/Playlist';

interface PlaylistPageProps {
  initialPlaylists: IPlaylist[];
}

const PlaylistPage = ({ initialPlaylists }: PlaylistPageProps) => {
  const [playlistMap, setPlaylistMap] = useRecoilState(playlistMapAtom);
  const initialPlaylistMap = new Map(initialPlaylists.map((playlist) => [playlist.id, playlist]));

  useEffect(() => {
    setPlaylistMap(initialPlaylistMap);
  }, []);

  return (
    <div>
      {Array.from(playlistMap.values()).map(({ id, name }) => (
        <Playlist key={`playlist-page-playlist-${id}`} id={id} name={name} />
      ))}
    </div>
  );
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  let response: AxiosResponse;

  const { req } = context;

  let initialPlaylists = [];

  try {
    response = await axiosHttpGet('playlist', req.headers.cookie);
    initialPlaylists = response.data.data;
  } catch (e) {
    console.log(e);
  }

  return {
    props: {
      initialPlaylists,
    },
  };
};

export default PlaylistPage;
