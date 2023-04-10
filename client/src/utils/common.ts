import { FieldValues } from 'react-hook-form';
import { ALGORITHM, API_HOST, IV, SECRET_KEY } from '../constants';
import axios from 'axios';
import { MusicInfo } from '../domain/MusicInfo';
import crypto from 'crypto';
import { ReactFlowInstance } from 'reactflow';
import zlib from 'zlib';

export const axiosHttpGet = async (path: string, cookie: string) => {
  const response = await axios.get(`${API_HOST}/${path}`, {
    headers: {
      Cookie: cookie || '',
    },
  });

  return response;
};

export const httpGet = async (path: string) => {
  const response = await fetch(`${API_HOST}/${path}`, {
    method: 'GET',
    credentials: 'include',
  });
  return response;
};

export const httpPost = async (path: string, payload?: FieldValues) => {
  const response = await fetch(`${API_HOST}/${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload ?? {}),
  });

  return response;
};

export const httpPatch = async (path: string, payload?: FieldValues) => {
  const response = await fetch(`${API_HOST}/${path}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload ?? {}),
  });

  return response;
};

export const httpDelete = async (path: string) => {
  const response = await fetch(`${API_HOST}/${path}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  return response;
};

export const shortenMusicName = (name: string) => {
  const LIMIT_LEN = 33;

  if (name.length <= LIMIT_LEN) return name;
  else return `${name.substring(0, 30)}...`;
};

export const validateVideoId = async (videoId) => {
  const response = await fetch(`http://img.youtube.com/vi/${videoId}/mqdefault.jpg`, {
    method: 'GET',
  });

  if (!response.ok) {
    alert('유효하지 않은 비디오 ID입니다.');
    return;
  }

  return response.ok;
};

export const createPlaylistByHead: (head: number, musicNodeMap: Map<number, IMusicNode>) => IPlaylist = (head, musicNodeMap) => {
  let curr = head;

  const contents = new Map<number, MusicInfo>();

  while (curr) {
    const node = musicNodeMap.get(curr);

    contents.set(curr, new MusicInfo(node.musicName, node.videoId));

    if (contents.get(node.next)) {
      contents.get(node.next).cycle = 'head';
      contents.get(curr).cycle = 'tail';
      break;
    }

    curr = node.next;
  }

  return { contents };
};

const encodeV1 = (plain: string) => {
  // 테스트용
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(SECRET_KEY, 'hex'), Buffer.from(IV, 'hex'));
  return cipher.update(plain, 'utf8', 'hex') + cipher.final('hex');
};

export const convertPlaylistToCode = (playlist: IPlaylist) => {
  const contents = JSON.stringify(Object.fromEntries(playlist.contents));
  return encodeV2(contents);
};

const encodeV2 = (plain: string) => {
  const compressedBytes = zlib.deflateSync(plain);
  return encodeURIComponent(Buffer.from(compressedBytes).toString('base64'));
};

const decodeV2 = (encoded: string) => {
  const compressedBuffer = Buffer.from(decodeURIComponent(encoded), 'base64');
  const decompressedBuffer = zlib.inflateSync(compressedBuffer);
  return decompressedBuffer.toString('utf-8');
};
