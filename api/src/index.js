const express = require('express')
const cors = require('cors')
const filesRouter = require('./routes/files')

const app = express()
const PORT = process.env.PORT || 8000

app.use(cors())
app.use(express.json())
app.use('/files', filesRouter)

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`API running on port ${PORT}`)
  })
}

module.exports = app
