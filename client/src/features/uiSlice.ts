import { createSlice } from '@reduxjs/toolkit';
import { Position } from '../domain/Position';
import { ReactFlowInstance } from 'reactflow';

interface uiState {
  selectedPlaylistId: number;
  isVisiblePlaylistDropdown: boolean;
  latestClickPosition: Position;
  reactFlowInstance: ReactFlowInstance;
}

const initialState = {};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {},
});

export const {} = uiSlice.actions;
export default uiSlice.reducer;
