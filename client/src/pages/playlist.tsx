import { AxiosResponse } from 'axios';
import { GetServerSidePropsContext } from 'next';
import { axiosHttpGet } from '../utils/common';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { isVisiblePlaylistModalAtom, playlistMapAtom } from '../store';
import { PlaylistComponent } from '../components/Playlist';
import { PlaylistModal } from '../components/PlaylistModal';
import { MusicInfo } from '../domain/MusicInfo';
import { Playlist } from '../domain/Playlist';
import { PlaylistShareButton } from '../components/PlaylistShareButton';

interface PlaylistPageProps {
  initialPlaylists: {
    id: number;
    contents: string;
    name: string;
  }[];
}

const PlaylistPage = ({ initialPlaylists }: PlaylistPageProps) => {
  const [playlistMap, setPlaylistMap] = useRecoilState(playlistMapAtom);
  const [isVisiblePlaylistModal, setIsVisiblePlaylistModal] = useRecoilState(isVisiblePlaylistModalAtom);
  const initialPlaylistMap = new Map<number, IPlaylist>(initialPlaylists.map((playlist) => [playlist.id, new Playlist(playlist)]));

  useEffect(() => {
    // setIsVisiblePlaylistModal(false);
    setPlaylistMap(initialPlaylistMap);
  }, []);

  useEffect(() => {
    const handleDocumentClick = () => {
      setIsVisiblePlaylistModal(false);
    };

    document.addEventListener('click', handleDocumentClick);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  const handleShareButtonClick = () => {};

  return (
    <div>
      <div>
        {Array.from(playlistMap.values()).map(({ id, name }) => (
          <PlaylistComponent key={`playlist-page-playlist-${id}`} id={id} name={name} />
        ))}
      </div>
      {isVisiblePlaylistModal && <PlaylistModal BottomElement={<PlaylistShareButton />} />}
    </div>
  );
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  let response: AxiosResponse;

  const { req } = context;

  let initialPlaylists = [];

  try {
    response = await axiosHttpGet('playlist', req.headers.cookie);
    initialPlaylists = response.data;
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
