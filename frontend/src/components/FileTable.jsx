import { useSelector } from 'react-redux'
import { Table, Spinner, Alert } from 'react-bootstrap'

function FileTable () {
  const { fileContent, loading, error } = useSelector((state) => state.files)

  if (loading) {
    return <Spinner animation='border' role='status' />
  }

  if (error) {
    return <Alert variant='danger'>Error loading data: {error}</Alert>
  }

  if (!loading && fileContent.length === 0) {
    return (
      <Alert variant='warning'>
        <Alert.Heading>No valid data found</Alert.Heading>
        <p className='mb-0'>The file could not be displayed.</p>
      </Alert>
    )
  }

  const fileResult = fileContent[0]

  if (fileResult && fileResult.error) {
    return (
      <Alert variant='danger'>
        <Alert.Heading>Unable to load file</Alert.Heading>
        <p className='mb-0'>{fileResult.error}</p>
      </Alert>
    )
  }

  const rows = fileContent.flatMap((fileObj) =>
    fileObj.lines.map((line, i) => ({
      key: `${fileObj.file}-${i}`,
      file: fileObj.file,
      ...line
    }))
  )

  return (
    <>
      {fileResult && fileResult.warning && (
        <Alert variant='warning' className='mb-3'>{fileResult.warning}</Alert>
      )}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>File Name</th>
            <th>Text</th>
            <th>Number</th>
            <th>Hex</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key}>
              <td>{row.file}</td>
              <td>{row.text}</td>
              <td>{row.number}</td>
              <td>{row.hex}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  )
}

export default FileTable
