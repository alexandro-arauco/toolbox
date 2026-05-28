import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { fetchFileContent, fetchAvailableFiles } from '../services/api'

export const loadFileContent = createAsyncThunk('files/loadFileContent', async (fileName) => {
  return fetchFileContent(fileName)
})

export const loadAvailableFiles = createAsyncThunk('files/loadAvailableFiles', async () => {
  return fetchAvailableFiles()
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
      .addCase(loadFileContent.pending, (state) => {
        state.loading = true
        state.error = null
        state.fileContent = []
      })
      .addCase(loadFileContent.fulfilled, (state, action) => {
        state.loading = false
        state.fileContent = action.payload
        state.cachedFileName = action.meta.arg
      })
      .addCase(loadFileContent.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(loadAvailableFiles.pending, (state) => {
        state.listLoading = true
        state.listError = null
      })
      .addCase(loadAvailableFiles.fulfilled, (state, action) => {
        state.listLoading = false
        state.availableFiles = action.payload
      })
      .addCase(loadAvailableFiles.rejected, (state, action) => {
        state.listLoading = false
        state.listError = action.error.message
      })
  }
})

export default filesSlice.reducer
