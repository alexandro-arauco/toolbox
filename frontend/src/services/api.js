const BASE = '/files'

export async function fetchFilesData (fileName) {
  const url = fileName ? `${BASE}/data?fileName=${encodeURIComponent(fileName)}` : `${BASE}/data`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function fetchFileList () {
  const res = await fetch(`${BASE}/list`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json()
  return data.files
}
