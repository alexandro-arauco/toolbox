import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import '@testing-library/jest-dom'
import FileFilter from '../src/components/FileFilter'
import filesReducer from '../src/store/filesSlice'

jest.mock('../src/services/api', () => ({
  fetchFileList: jest.fn().mockResolvedValue(['file1.csv', 'file2.csv']),
  fetchFilesData: jest.fn().mockResolvedValue([])
}))

function renderWithStore (preloadedState) {
  const store = configureStore({
    reducer: { files: filesReducer },
    preloadedState
  })
  return render(
    <Provider store={store}>
      <FileFilter />
    </Provider>
  )
}

describe('FileFilter', () => {
  it('renders a select element with default option', () => {
    renderWithStore({ files: { fileContent: [], availableFiles: [], loading: false, error: null } })
    expect(screen.getByRole('combobox')).toBeInTheDocument()
    expect(screen.getByText('All files')).toBeInTheDocument()
  })

  it('renders file options from store', () => {
    renderWithStore({
      files: { fileContent: [], availableFiles: ['file1.csv', 'file2.csv'], loading: false, error: null }
    })
    expect(screen.getByText('file1.csv')).toBeInTheDocument()
    expect(screen.getByText('file2.csv')).toBeInTheDocument()
  })

  it('triggers change handler when a file is selected', () => {
    renderWithStore({
      files: { fileContent: [], availableFiles: ['file1.csv'], loading: false, error: null }
    })
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'file1.csv' } })
    expect(screen.getByRole('combobox')).toHaveValue('file1.csv')
  })
})
