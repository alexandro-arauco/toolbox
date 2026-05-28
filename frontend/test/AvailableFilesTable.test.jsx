import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import '@testing-library/jest-dom'
import AvailableFilesTable from '../src/components/AvailableFilesTable'
import filesReducer from '../src/store/filesSlice'

const base = { fileContent: [], cachedFileName: null, availableFiles: [], loading: false, listLoading: false, error: null, listError: null }

function renderWithStore (availableFiles = [], onSelect = jest.fn()) {
  const store = configureStore({
    reducer: { files: filesReducer },
    preloadedState: { files: { ...base, availableFiles } }
  })
  return { onSelect, ...render(<Provider store={store}><AvailableFilesTable onSelect={onSelect} /></Provider>) }
}

describe('AvailableFilesTable', () => {
  it('renders File Name and Action columns', () => {
    renderWithStore(['file1.csv'])
    expect(screen.getByText('File Name')).toBeInTheDocument()
    expect(screen.getByText('Action')).toBeInTheDocument()
  })

  it('renders a row and See File button per file', () => {
    renderWithStore(['file1.csv', 'file2.csv'])
    expect(screen.getAllByRole('button', { name: 'See File' })).toHaveLength(2)
    expect(screen.getByText('file1.csv')).toBeInTheDocument()
  })

  it('calls onSelect with the filename when See File is clicked', () => {
    const { onSelect } = renderWithStore(['file1.csv'])
    fireEvent.click(screen.getByRole('button', { name: 'See File' }))
    expect(onSelect).toHaveBeenCalledWith('file1.csv')
  })

  it('shows spinner while loading', () => {
    const store = configureStore({
      reducer: { files: filesReducer },
      preloadedState: { files: { ...base, listLoading: true } }
    })
    render(<Provider store={store}><AvailableFilesTable onSelect={jest.fn()} /></Provider>)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })
})
