import { createSlice } from '@reduxjs/toolkit';
import { Music } from '../domain/Music';
import { MusicNode } from '../domain/MusicNode';
import { Playlist } from '../domain/Playlist';

interface mapState {
  musicMap: Map<number, Music>;
  musicNodeMap: Map<number, MusicNode>;
  playlistMap: Map<number, Playlist>;
}

const initialState = {};

const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {},
});

export const {} = mapSlice.actions;
export default mapSlice.reducer;
