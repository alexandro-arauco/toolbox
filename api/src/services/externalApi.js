const axios = require('axios')

const BASE_URL = 'https://echo-serv.tbxnet.com/v1/secret'
const AUTH_HEADER = { Authorization: 'Bearer aSuperSecretKey' }

async function getFileList () {
  const response = await axios.get(`${BASE_URL}/files`, { headers: AUTH_HEADER })
  return response.data.files
}

async function getFileContent (filename) {
  try {
    const response = await axios.get(`${BASE_URL}/file/${filename}`, { headers: AUTH_HEADER })
    return response.data
  } catch {
    return null
  }
}

module.exports = { getFileList, getFileContent }
