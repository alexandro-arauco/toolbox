import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { fetchFilesData, fetchFileList } from '../services/api'

export const loadFiles = createAsyncThunk('files/loadFiles', async (fileName) => {
  return fetchFilesData(fileName)
})

export const loadFileList = createAsyncThunk('files/loadFileList', async () => {
  return fetchFileList()
})

const filesSlice = createSlice({
  name: 'files',
  initialState: {
    fileContent: [],
    cachedFileName: null,
    availableFiles: [],
    loading: false,
    listLoading: false,
    error: null,
    listError: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadFiles.pending, (state) => {
        state.loading = true
        state.error = null
        state.fileContent = []
      })
      .addCase(loadFiles.fulfilled, (state, action) => {
        state.loading = false
        state.fileContent = action.payload
        state.cachedFileName = action.meta.arg
      })
      .addCase(loadFiles.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(loadFileList.pending, (state) => {
        state.listLoading = true
        state.listError = null
      })
      .addCase(loadFileList.fulfilled, (state, action) => {
        state.listLoading = false
        state.availableFiles = action.payload
      })
      .addCase(loadFileList.rejected, (state, action) => {
        state.listLoading = false
        state.listError = action.error.message
      })
  }
})

export default filesSlice.reducer
