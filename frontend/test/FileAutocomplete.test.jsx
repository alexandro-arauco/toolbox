import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import FileAutocomplete from '../src/components/FileAutocomplete'

const FILES = ['file1.csv', 'file2.csv', 'test3.csv']

function setup (onSelect = jest.fn()) {
  render(<FileAutocomplete files={FILES} onSelect={onSelect} />)
  return { input: screen.getByPlaceholderText('Search file...'), onSelect }
}

describe('FileAutocomplete', () => {
  it('shows all suggestions when focused with empty input', () => {
    const { input } = setup()
    fireEvent.focus(input)
    expect(screen.getByText('file1.csv')).toBeInTheDocument()
    expect(screen.getByText('file2.csv')).toBeInTheDocument()
    expect(screen.getByText('test3.csv')).toBeInTheDocument()
  })

  it('filters suggestions as the user types', () => {
    const { input } = setup()
    fireEvent.change(input, { target: { value: 'file' } })
    expect(screen.getByText('file1.csv')).toBeInTheDocument()
    expect(screen.getByText('file2.csv')).toBeInTheDocument()
    expect(screen.queryByText('test3.csv')).not.toBeInTheDocument()
  })

  it('shows "No matches" when nothing matches the query', () => {
    const { input } = setup()
    fireEvent.change(input, { target: { value: 'xyz' } })
    expect(screen.getByText('No matches')).toBeInTheDocument()
  })

  it('calls onSelect with the file when a suggestion is clicked', () => {
    const { input, onSelect } = setup()
    fireEvent.change(input, { target: { value: 'file' } })
    fireEvent.click(screen.getByText('file1.csv'))
    expect(onSelect).toHaveBeenCalledWith('file1.csv')
  })

  it('calls onSelect(null) and clears input when clear button is pressed', () => {
    const { input, onSelect } = setup()
    fireEvent.change(input, { target: { value: 'file1.csv' } })
    fireEvent.click(screen.getByLabelText('Clear search'))
    expect(input).toHaveValue('')
    expect(onSelect).toHaveBeenCalledWith(null)
  })
})
