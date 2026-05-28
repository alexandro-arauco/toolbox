import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import '@testing-library/jest-dom'
import FileContentTable from '../src/components/FileContentTable'
import filesReducer from '../src/store/filesSlice'

function renderWithStore (preloadedState) {
  const store = configureStore({
    reducer: { files: filesReducer },
    preloadedState
  })
  return render(
    <Provider store={store}>
      <FileContentTable />
    </Provider>
  )
}

const base = { fileContent: [], availableFiles: [], cachedFileName: null, loading: false, listLoading: false, error: null, listError: null }

describe('FileContentTable', () => {
  it('renders table with valid data', () => {
    const fileContent = [{
      file: 'file1.csv',
      lines: [
        { text: 'RgTya', number: 64075909, hex: '70ad29aacf0b690b0467fe2b2767f765' },
        { text: 'AtjW', number: 6, hex: 'd33a8ca5d36d3106219f66f939774cf5' }
      ]
    }]
    renderWithStore({ files: { ...base, fileContent } })
    expect(screen.getAllByRole('row')).toHaveLength(3)
    expect(screen.getByText('RgTya')).toBeInTheDocument()
  })

  it('shows spinner when loading', () => {
    renderWithStore({ files: { ...base, loading: true } })
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('shows HTTP error alert', () => {
    renderWithStore({ files: { ...base, error: 'Network error' } })
    expect(screen.getByText(/Network error/)).toBeInTheDocument()
  })

  it('shows error message from API when file could not be downloaded', () => {
    const fileContent = [{ file: 'fail.csv', lines: [], error: 'Could not download this file from the source.' }]
    renderWithStore({ files: { ...base, fileContent } })
    expect(screen.getByText('Unable to load file')).toBeInTheDocument()
    expect(screen.getByText(/Could not download/)).toBeInTheDocument()
  })

  it('shows error message from API when file is empty', () => {
    const fileContent = [{ file: 'empty.csv', lines: [], error: 'The file is empty — no rows were found.' }]
    renderWithStore({ files: { ...base, fileContent } })
    expect(screen.getByText(/The file is empty/)).toBeInTheDocument()
  })

  it('shows error message from API when all rows are malformed', () => {
    const fileContent = [{ file: 'bad.csv', lines: [], error: 'All 3 rows in this file are malformed. Each row must have exactly 4 comma-separated fields: file, text, number, hex.' }]
    renderWithStore({ files: { ...base, fileContent } })
    expect(screen.getByText(/malformed/)).toBeInTheDocument()
  })

  it('shows warning banner and data when some rows are skipped', () => {
    const fileContent = [{
      file: 'partial.csv',
      lines: [{ text: 'ok', number: 1, hex: 'abc' }],
      warning: '2 of 3 rows were skipped due to malformed data.'
    }]
    renderWithStore({ files: { ...base, fileContent } })
    expect(screen.getByText(/2 of 3 rows were skipped/)).toBeInTheDocument()
    expect(screen.getByText('ok')).toBeInTheDocument()
  })
})
