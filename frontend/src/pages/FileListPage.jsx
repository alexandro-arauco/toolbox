import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Table, Spinner, Alert, Button } from 'react-bootstrap'
import { loadFileList } from '../store/filesSlice'
import FileAutocomplete from '../components/FileAutocomplete'

function FileListPage () {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { availableFiles, listLoading, listError } = useSelector((state) => state.files)
  const [selectedFile, setSelectedFile] = useState(null)

  useEffect(() => {
    dispatch(loadFileList())
  }, [dispatch])

  if (listLoading) {
    return <Spinner animation='border' role='status' className='d-block mx-auto mt-5' />
  }

  if (listError) {
    return <Alert variant='danger' className='mt-4'>Error loading files: {listError}</Alert>
  }

  const visibleFiles = selectedFile
    ? availableFiles.filter((f) => f === selectedFile)
    : availableFiles

  return (
    <>
      <FileAutocomplete files={availableFiles} onSelect={setSelectedFile} />
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>File Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {visibleFiles.map((file) => (
            <tr key={file}>
              <td>{file}</td>
              <td>
                <Button
                  size='sm'
                  variant='primary'
                  onClick={() => navigate(`/file/${encodeURIComponent(file)}`)}
                >
                  See File
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  )
}

export default FileListPage
