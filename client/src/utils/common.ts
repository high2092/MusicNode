import { FieldValues } from 'react-hook-form';
import { API_HOST } from '../constants';
import axios from 'axios';
import { MusicInfo } from '../domain/MusicInfo';
import crypto from 'crypto';
import { ReactFlowInstance } from 'reactflow';
import zlib from 'zlib';
import { Playlist } from '../domain/Playlist';

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

export const validateVideoId = async (videoId: string) => {
  const response = await fetch(`/api/validate-video-id?videoId=${videoId}`, {
    method: 'GET',
  });

  return response.ok;
};

export const createPlaylistByHead: (head: number, musicNodeMap: Map<number, IMusicNode>) => Playlist = (head, musicNodeMap) => {
  let curr = head;

  let count = 0;
  const visited = {};
  const contents = [];

  while (curr) {
    const node = musicNodeMap.get(curr);

    contents.push(new MusicInfo(node.musicName, node.videoId));
    visited[curr] = count;

    if (visited[node.next] !== undefined) {
      contents[visited[node.next]].cycle = 'head';
      contents[count].cycle = 'tail';
      break;
    }

    curr = node.next;
    count++;
  }

  return { contents };
};

export const encodeV2 = (plain: string) => {
  const compressedBytes = zlib.deflateSync(plain);
  return 'v2' + encodeURIComponent(Buffer.from(compressedBytes).toString('base64'));
};

const decodeV2 = (encoded: string) => {
  const compressedBuffer = Buffer.from(decodeURIComponent(encoded), 'base64');
  const decompressedBuffer = zlib.inflateSync(compressedBuffer);
  return decompressedBuffer.toString('utf-8');
};

export const copyToClipboard = (text: string) => {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
};
