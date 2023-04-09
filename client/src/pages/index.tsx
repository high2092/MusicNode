import { useEffect, useRef, useState } from 'react';
import { axiosHttpGet, httpPost } from '../utils/common';
import { FieldValues, useForm } from 'react-hook-form';
import { NodeList } from '../components/NodeList';
import { MusicManager } from '../components/MusicManager';
import { Position } from '../domain/Position';
import { MusicNode } from '../domain/MusicNode';
import { convertMusicNodeToReactFlowObject } from '../utils/ReactFlow';
import { useEdgesState, useNodesState } from 'reactflow';
import { useRecoilState } from 'recoil';
import { currentMusicNodeInfoAtom, isPlayingAtom, isVisiblePlaylistModalAtom, musicMapAtom, musicNodeMapAtom } from '../store';
import { ReactFlowNode } from '../domain/ReactFlowNode';
import { YouTubePlayer } from 'react-youtube';
import type { GetServerSidePropsContext } from 'next';
import type { AxiosResponse } from 'axios';
import { PlaylistModal } from '../components/PlaylistModal';
import { MusicInfo } from '../domain/MusicInfo';
import { PlaylistSubmitForm } from '../components/PlaylistSubmitForm';

interface NodePageProps {
  initialMusicList: IMusic[];
  initialMusicNodeList: IMusicNode[];
}

const Home = ({ initialMusicList, initialMusicNodeList }: NodePageProps) => {
  const [musicMap, setMusicMap] = useRecoilState(musicMapAtom);
  const [musicNodeMap, setMusicNodeMap] = useRecoilState(musicNodeMapAtom);
  const [isVisiblePlaylistModal, setIsVisiblePlaylistModal] = useRecoilState(isVisiblePlaylistModalAtom);

  const initialMusicMap = new Map(initialMusicList.map((music) => [music.id, music]));
  const initialMusicNodeMap = new Map(initialMusicNodeList.map((node) => [node.id, node]));

  const musicNameRef = useRef<HTMLInputElement>();

  const { nodes: initialNodes, edges: initialEdges } = convertMusicNodeToReactFlowObject(initialMusicNodeMap);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  let youtubePlayerRef = useRef<YouTubePlayer>();

  useEffect(() => {
    setMusicMap(initialMusicMap);
    setMusicNodeMap(initialMusicNodeMap);
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

  const { register, handleSubmit, setValue } = useForm();

  const handleMusicClick = (id: number) => () => {
    setValue('musicId', id);
    musicNameRef.current.value = musicMap.get(id).name;
    console.log(id);
  };

  const handleCreateMusicNode = async (formData: FieldValues) => {
    const { musicId, color } = formData;

    const response = await httpPost('node', { musicId, color });

    if (response.ok) {
      const { id } = await response.json();

      const music = musicMap.get(musicId);
      setMusicNodeMap(musicNodeMap.set(id, new MusicNode({ id, musicId: music.id, musicName: music.name, videoId: music.videoId })));
      setNodes((nodes) => nodes.concat(new ReactFlowNode({ id, musicName: music.name, videoId: music.videoId })));
    }
  };

  return (
    <div>
      <div>
        <div>노드 목록</div>
        <NodeList nodes={nodes} setNodes={setNodes} onNodesChange={onNodesChange} edges={edges} setEdges={setEdges} onEdgesChange={onEdgesChange} />
        <form onSubmit={handleSubmit(handleCreateMusicNode)}>
          <label>MUSIC NAME</label>
          <input ref={musicNameRef} disabled />
          <button>노드 생성하기</button>
        </form>
      </div>
      <hr />
      <div>
        <MusicManager handleMusicClick={handleMusicClick} youtubePlayerRef={youtubePlayerRef} />
      </div>
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
