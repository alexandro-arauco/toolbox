import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Form } from 'react-bootstrap'
import { loadFileList, loadFiles } from '../store/filesSlice'

function FileFilter () {
  const dispatch = useDispatch()
  const availableFiles = useSelector((state) => state.files.availableFiles)

  useEffect(() => {
    dispatch(loadFileList())
  }, [dispatch])

  function handleChange (e) {
    const value = e.target.value
    dispatch(loadFiles(value || undefined))
  }

  return (
    <Form.Select onChange={handleChange} className='mb-3' style={{ maxWidth: 300 }}>
      <option value=''>All files</option>
      {availableFiles.map((file) => (
        <option key={file} value={file}>{file}</option>
      ))}
    </Form.Select>
  )
}

export default FileFilter
