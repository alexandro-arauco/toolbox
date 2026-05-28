import { useSelector } from 'react-redux'
import { Table, Spinner, Alert, Button } from 'react-bootstrap'

function FileListTable ({ onSelect }) {
  const { availableFiles, listLoading, listError } = useSelector((state) => state.files)

  if (listLoading) {
    return <Spinner animation='border' role='status' className='d-block mx-auto mt-5' />
  }

  if (listError) {
    return <Alert variant='danger'>Error loading file list: {listError}</Alert>
  }

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>File Name</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {availableFiles.map((file) => (
          <tr key={file}>
            <td>{file}</td>
            <td>
              <Button size='sm' variant='primary' onClick={() => onSelect(file)}>
                See File
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

export default FileListTable
