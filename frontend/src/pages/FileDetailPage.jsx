import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import { loadFiles } from '../store/filesSlice'
import FileTable from '../components/FileTable'

function FileDetailPage () {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { fileName } = useParams()

  useEffect(() => {
    dispatch(loadFiles(decodeURIComponent(fileName)))
  }, [dispatch, fileName])

  return (
    <>
      <Button variant='secondary' className='mb-3' onClick={() => navigate('/')}>
        ← Back
      </Button>
      <h5 className='mb-3'>{decodeURIComponent(fileName)}</h5>
      <FileTable />
    </>
  )
}

export default FileDetailPage
