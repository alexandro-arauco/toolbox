import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { MemoryRouter } from 'react-router-dom'
import '@testing-library/jest-dom'
import FileListPage from '../src/pages/FileListPage'
import filesReducer from '../src/store/filesSlice'

const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}))

const mockFetchFileList = jest.fn()
jest.mock('../src/services/api', () => ({
  fetchFileList: (...args) => mockFetchFileList(...args),
  fetchFilesData: jest.fn().mockResolvedValue([])
}))

function renderWithStore (files = []) {
  mockFetchFileList.mockResolvedValue(files)
  const store = configureStore({ reducer: { files: filesReducer } })
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <FileListPage />
      </MemoryRouter>
    </Provider>
  )
}

describe('FileListPage', () => {
  beforeEach(() => mockNavigate.mockClear())

  it('renders File Name and Action headers', async () => {
    renderWithStore()
    expect(await screen.findByText('File Name')).toBeInTheDocument()
    expect(screen.getByText('Action')).toBeInTheDocument()
  })

  it('renders a See File button for each file', async () => {
    renderWithStore(['file1.csv', 'file2.csv'])
    const buttons = await screen.findAllByRole('button', { name: 'See File' })
    expect(buttons).toHaveLength(2)
  })

  it('navigates to the file detail page when See File is clicked', async () => {
    renderWithStore(['file1.csv'])
    fireEvent.click(await screen.findByRole('button', { name: 'See File' }))
    expect(mockNavigate).toHaveBeenCalledWith('/file/file1.csv')
  })
})
