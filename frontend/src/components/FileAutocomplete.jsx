import { useState, useRef, useEffect } from 'react'
import { Form, ListGroup } from 'react-bootstrap'

function FileAutocomplete ({ files, value, onSelect }) {
  const [query, setQuery] = useState(value || '')
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    setQuery(value || '')
  }, [value])

  useEffect(() => {
    function handleClickOutside (e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const suggestions = query.trim()
    ? files.filter((f) => f.toLowerCase().includes(query.toLowerCase()))
    : files

  function handleChange (e) {
    const val = e.target.value
    setQuery(val)
    setOpen(true)
    if (!val.trim()) onSelect(null)
  }

  function handleSelect (file) {
    setQuery(file)
    setOpen(false)
    onSelect(file)
  }

  function handleClear () {
    setQuery('')
    setOpen(false)
    onSelect(null)
  }

  return (
    <div ref={containerRef} style={{ position: 'relative', maxWidth: 360 }} className='mb-3'>
      <div className='d-flex gap-2'>
        <Form.Control
          type='text'
          placeholder='Search file...'
          value={query}
          onChange={handleChange}
          onFocus={() => setOpen(true)}
          autoComplete='off'
        />
        {query && (
          <button
            type='button'
            className='btn btn-outline-secondary btn-sm'
            onClick={handleClear}
            aria-label='Clear search'
          >
            ✕
          </button>
        )}
      </div>

      {open && suggestions.length > 0 && (
        <ListGroup
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 100,
            maxHeight: 220,
            overflowY: 'auto',
            boxShadow: '0 4px 12px rgba(0,0,0,.15)'
          }}
        >
          {suggestions.map((file) => (
            <ListGroup.Item
              key={file}
              action
              active={file === query}
              onClick={() => handleSelect(file)}
            >
              {file}
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}

      {open && query.trim() && suggestions.length === 0 && (
        <ListGroup
          style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100 }}
        >
          <ListGroup.Item disabled>No matches</ListGroup.Item>
        </ListGroup>
      )}
    </div>
  )
}

export default FileAutocomplete
