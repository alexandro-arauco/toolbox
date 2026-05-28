import { configureStore } from '@reduxjs/toolkit'
import filesReducer from './filesSlice'

export default configureStore({
  reducer: { files: filesReducer }
})
