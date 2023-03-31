import { FieldValues } from 'react-hook-form';
import { API_HOST } from './constants';

export const httpGet = async (path: string) => {
  const response = await fetch(`${API_HOST}/${path}`, {
    method: 'GET',
  });
  return response;
};

export const httpPost = async (path: string, payload: FieldValues) => {
  const response = await fetch(`${API_HOST}/${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return response;
};
