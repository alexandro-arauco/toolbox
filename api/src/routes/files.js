const express = require('express')
const { getFileList, getFileContent } = require('../services/externalApi')
const { parseCSV } = require('../utils/csvParser')

const router = express.Router()

function buildFileResult (file, content) {
  if (content === null) {
    return { file, lines: [], error: 'Could not download this file from the source.' }
  }

  const { lines, totalRows, malformedRows } = parseCSV(content)

  if (totalRows === 0) {
    return { file, lines: [], error: 'The file is empty — no rows were found.' }
  }

  if (lines.length === 0) {
    return {
      file,
      lines: [],
      error: `All ${totalRows} row${totalRows !== 1 ? 's' : ''} in this file are malformed. Each row must have exactly 4 comma-separated fields: file, text, number, hex.`
    }
  }

  if (malformedRows > 0) {
    return { file, lines, warning: `${malformedRows} of ${totalRows} rows were skipped due to malformed data.` }
  }

  return { file, lines }
}

router.get('/data', async (req, res) => {
  try {
    const { fileName } = req.query

    const fileNames = fileName ? [fileName] : await getFileList()

    const results = await Promise.allSettled(
      fileNames.map(async (file) => {
        const content = await getFileContent(file)
        return buildFileResult(file, content)
      })
    )

    const data = results
      .filter((r) => r.status === 'fulfilled')
      .map((r) => r.value)

    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/list', async (req, res) => {
  try {
    const files = await getFileList()
    res.json({ files })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
