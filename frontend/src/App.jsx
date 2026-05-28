import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Container } from 'react-bootstrap'
import AppNavbar from './components/AppNavbar'
import FileAutocomplete from './components/FileAutocomplete'
import AvailableFilesTable from './components/AvailableFilesTable'
import FileContentTable from './components/FileContentTable'
import { loadAvailableFiles, loadFileContent } from './store/filesSlice'
import 'bootstrap/dist/css/bootstrap.min.css'

function App () {
  const dispatch = useDispatch()
  const { availableFiles, cachedFileName } = useSelector((state) => state.files)
  const [selectedFile, setSelectedFile] = useState(null)

  useEffect(() => {
    dispatch(loadAvailableFiles())
  }, [dispatch])

  function handleSelect (file) {
    setSelectedFile(file)
    if (file && file !== cachedFileName) {
      dispatch(loadFileContent(file))
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
        {selectedFile ? <FileContentTable /> : <AvailableFilesTable onSelect={handleSelect} />}
      </Container>
    </>
  )
}

export default App
