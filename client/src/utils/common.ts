import { FieldValues } from 'react-hook-form';
import { API_HOST } from '../constants';

export const httpGet = async (path: string) => {
  const response = await fetch(`${API_HOST}/${path}`, {
    method: 'GET',
  });
  return response;
};

export const httpPost = async (path: string, payload?: FieldValues) => {
  const response = await fetch(`${API_HOST}/${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
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
    body: JSON.stringify(payload ?? {}),
  });

  return response;
};

export const httpDelete = async (path: string) => {
  const response = await fetch(`${API_HOST}/${path}`, {
    method: 'DELETE',
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
