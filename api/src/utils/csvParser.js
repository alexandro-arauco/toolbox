function parseCSV (content) {
  if (!content || typeof content !== 'string') {
    return { lines: [], totalRows: 0, malformedRows: 0 }
  }

  const rawLines = content.split('\n').slice(1).filter((l) => l.trim())
  const totalRows = rawLines.length
  let malformedRows = 0

  const lines = rawLines.reduce((acc, line) => {
    const parts = line.trim().split(',')
    if (parts.length !== 4) { malformedRows++; return acc }

    const [, text, number, hex] = parts
    if (!text || !number || !hex) { malformedRows++; return acc }

    const parsedNumber = parseInt(number, 10)
    if (isNaN(parsedNumber)) { malformedRows++; return acc }

    acc.push({ text, number: parsedNumber, hex })
    return acc
  }, [])

  return { lines, totalRows, malformedRows }
}

module.exports = { parseCSV }
