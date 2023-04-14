import { createSlice } from '@reduxjs/toolkit';
import { YouTubePlayer } from 'react-youtube';

interface playerState {
  youtubePlayer: YouTubePlayer;
  currentNodeId: number;
  isPlaying: boolean;
  prevNodeStack: IMusicNodeInfo[];
}

const initialState = {};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {},
});

export const {} = playerSlice.actions;
export default playerSlice.reducer;
