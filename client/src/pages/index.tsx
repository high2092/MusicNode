import { useEffect, useRef, useState } from 'react';
import { axiosHttpGet, httpGet, httpPost } from '../utils/common';
import { FieldValues, useForm } from 'react-hook-form';
import { NodeManager } from '../components/NodeManager';
import { MusicManager } from '../components/MusicManager';
import { Position } from '../domain/Position';
import { MusicNode } from '../domain/MusicNode';
import { convertMusicNodeToReactFlowObject } from '../utils/ReactFlow';
import { useEdgesState, useNodesState } from 'reactflow';
import { useRecoilState, useRecoilValue } from 'recoil';
import { currentMusicNodeInfoAtom, isPlayingAtom, isVisiblePlaylistModalAtom, musicMapAtom, musicNodeMapAtom, reactFlowInstanceAtom } from '../store';
import { ReactFlowNode } from '../domain/ReactFlowNode';
import { YouTubePlayer } from 'react-youtube';
import type { GetServerSidePropsContext } from 'next';
import type { AxiosResponse } from 'axios';
import { PlaylistModal } from '../components/PlaylistModal';
import { MusicInfo } from '../domain/MusicInfo';
import { PlaylistSubmitForm } from '../components/PlaylistSubmitForm';
import * as S from '../styles/index';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface NodePageProps {
  initialMusicList: IMusic[];
  initialMusicNodeList: IMusicNode[];
}

const Home = ({ initialMusicList, initialMusicNodeList }: NodePageProps) => {
  const [musicMap, setMusicMap] = useRecoilState(musicMapAtom);
  const [musicNodeMap, setMusicNodeMap] = useRecoilState(musicNodeMapAtom);
  const [isVisiblePlaylistModal, setIsVisiblePlaylistModal] = useRecoilState(isVisiblePlaylistModalAtom);
  const reactFlowInstance = useRecoilValue(reactFlowInstanceAtom);

  const initialMusicMap = new Map(initialMusicList.map((music) => [music.id, music]));
  const initialMusicNodeMap = new Map(initialMusicNodeList.map((node) => [node.id, node]));

  const musicNameRef = useRef<HTMLInputElement>();

  const { nodes: initialNodes, edges: initialEdges } = convertMusicNodeToReactFlowObject(initialMusicNodeMap);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [showMiniMap, setShowMiniMap] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>();

  const router = useRouter();

  useEffect(() => {
    (async function foo() {
      const response = await httpGet('auth/login-info');
      if (!response.ok) router.replace('/login');
      else setIsLoggedIn(true);
    })();
  }, []);

  useEffect(() => {
    setMusicMap(initialMusicMap);
    setMusicNodeMap(initialMusicNodeMap);
  }, []);

  useEffect(() => {
    setIsVisiblePlaylistModal(false);
    const handleDocumentClick = () => {
      setIsVisiblePlaylistModal(false);
    };

    document.addEventListener('click', handleDocumentClick);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  const { register, handleSubmit, setValue } = useForm();

  const handleCreateMusicNode = async (formData: FieldValues) => {
    const { musicId, color } = formData;

    const response = await httpPost('node', { musicId, color });

    const MARGIN_TOP_MAX = 280;
    const MARGIN_LEFT_MAX = 1200;

    const position = reactFlowInstance.project({ x: MARGIN_LEFT_MAX * Math.random(), y: MARGIN_TOP_MAX * Math.random() });

    if (response.ok) {
      const { id } = await response.json();

      const music = musicMap.get(musicId);
      setMusicNodeMap(
        musicNodeMap.set(
          id,
          new MusicNode({
            id,
            musicId: music.id,
            musicName: music.name,
            videoId: music.videoId,
            position,
          })
        )
      );
      setNodes((nodes) =>
        nodes.concat(
          new ReactFlowNode({
            id,
            musicName: music.name,
            videoId: music.videoId,
            position,
          })
        )
      );
    }
  };

  const handleLogoutButtonClick = async () => {
    // 로그아웃
    const response = await httpPost('auth/logout');
    if (response.ok) router.replace('/login');
  };

  if (!isLoggedIn) return <></>;

  return (
    <div>
      <S.TopBarRight>
        <Link href={'/playlist'} style={{ textDecoration: 'none' }}>
          <S.PlaylistAnchor>플레이리스트로</S.PlaylistAnchor>
        </Link>
        <S.LogoutButton onClick={handleLogoutButtonClick}>로그아웃</S.LogoutButton>
      </S.TopBarRight>
      <div>노드 목록</div>
      <NodeManager nodes={nodes} setNodes={setNodes} onNodesChange={onNodesChange} edges={edges} setEdges={setEdges} onEdgesChange={onEdgesChange} showMiniMap={showMiniMap} />
      <S.ReactFlowOption>
        <form onSubmit={handleSubmit(handleCreateMusicNode)}>
          <label>MUSIC NAME</label>
          <input ref={musicNameRef} disabled />
          <button>노드 생성하기</button>
        </form>
        <button onClick={() => setShowMiniMap(!showMiniMap)}>{`미니맵 ${showMiniMap ? '끄기' : '켜기'}`}</button>
      </S.ReactFlowOption>
      <hr />
      <MusicManager />
      {isVisiblePlaylistModal && <PlaylistModal BottomElement={<PlaylistSubmitForm />} />}
    </div>
  );
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  let response: AxiosResponse;

  const { req } = context;

  let initialMusicList: IMusic[] = [];
  let initialMusicNodeList: IMusicNode[] = [];

  try {
    response = await axiosHttpGet('music', req.headers.cookie);
    initialMusicList = response.data.data;

    response = await axiosHttpGet('node', req.headers.cookie);
    initialMusicNodeList = response.data.data;
  } catch (e) {
    console.log(e);
  }

  return {
    props: {
      initialMusicList,
      initialMusicNodeList,
    },
  };
};

export default Home;
