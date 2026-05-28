import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Container } from 'react-bootstrap'
import AppNavbar from './components/AppNavbar'
import FileAutocomplete from './components/FileAutocomplete'
import FileListTable from './components/FileListTable'
import FileTable from './components/FileTable'
import { loadFileList, loadFiles } from './store/filesSlice'
import 'bootstrap/dist/css/bootstrap.min.css'

function App () {
  const dispatch = useDispatch()
  const { availableFiles, cachedFileName } = useSelector((state) => state.files)
  const [selectedFile, setSelectedFile] = useState(null)

  useEffect(() => {
    dispatch(loadFileList())
  }, [dispatch])

  function handleSelect (file) {
    setSelectedFile(file)
    if (file && file !== cachedFileName) {
      dispatch(loadFiles(file))
    }
  }

  return (
    <>
      <AppNavbar />
      <Container className='mt-4'>
        <FileAutocomplete
          files={availableFiles}
          value={selectedFile}
          onSelect={handleSelect}
        />
        {selectedFile ? <FileTable /> : <FileListTable onSelect={handleSelect} />}
      </Container>
    </>
  )
}

export default App
