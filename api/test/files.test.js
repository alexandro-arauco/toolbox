const chai = require('chai')
const chaiHttp = require('chai-http')
const nock = require('nock')
const app = require('../src/index')

chai.use(chaiHttp)
const { expect } = chai

const EXTERNAL_BASE = 'https://echo-serv.tbxnet.com'

const VALID_CSV = `file,text,number,hex
file1.csv,RgTya,64075909,70ad29aacf0b690b0467fe2b2767f765
file1.csv,AtjW,6,d33a8ca5d36d3106219f66f939774cf5`

const CSV_WITH_ERRORS = `file,text,number,hex
file2.csv,ValidText,12345,abcdef1234567890abcdef1234567890
file2.csv,,
file2.csv,OnlyTwo,`

const ALL_MALFORMED_CSV = `file,text,number,hex
bad.csv,,
bad.csv,OnlyTwo,`

describe('GET /files/data', () => {
  afterEach(() => nock.cleanAll())

  it('returns 200 with array of file objects', async () => {
    nock(EXTERNAL_BASE)
      .get('/v1/secret/files')
      .reply(200, { files: ['file1.csv'] })

    nock(EXTERNAL_BASE)
      .get('/v1/secret/file/file1.csv')
      .reply(200, VALID_CSV)

    const res = await chai.request(app).get('/files/data')
    expect(res).to.have.status(200)
    expect(res.body).to.be.an('array')
    expect(res.body[0]).to.have.property('file', 'file1.csv')
    expect(res.body[0].lines).to.be.an('array').with.lengthOf(2)
    expect(res.body[0]).to.not.have.property('error')
  })

  it('skips malformed lines and includes a warning field', async () => {
    nock(EXTERNAL_BASE)
      .get('/v1/secret/files')
      .reply(200, { files: ['file2.csv'] })

    nock(EXTERNAL_BASE)
      .get('/v1/secret/file/file2.csv')
      .reply(200, CSV_WITH_ERRORS)

    const res = await chai.request(app).get('/files/data')
    expect(res).to.have.status(200)
    expect(res.body[0].lines).to.have.lengthOf(1)
    expect(res.body[0]).to.have.property('warning').that.includes('skipped')
  })

  it('returns error field when all rows are malformed', async () => {
    nock(EXTERNAL_BASE)
      .get('/v1/secret/files')
      .reply(200, { files: ['bad.csv'] })

    nock(EXTERNAL_BASE)
      .get('/v1/secret/file/bad.csv')
      .reply(200, ALL_MALFORMED_CSV)

    const res = await chai.request(app).get('/files/data')
    expect(res).to.have.status(200)
    expect(res.body[0].lines).to.have.lengthOf(0)
    expect(res.body[0]).to.have.property('error').that.includes('malformed')
  })

  it('returns error field when file download fails', async () => {
    nock(EXTERNAL_BASE)
      .get('/v1/secret/files')
      .reply(200, { files: ['fail.csv'] })

    nock(EXTERNAL_BASE)
      .get('/v1/secret/file/fail.csv')
      .reply(500)

    const res = await chai.request(app).get('/files/data')
    expect(res).to.have.status(200)
    expect(res.body[0]).to.have.property('error').that.includes('download')
  })

  it('returns error field when file is empty', async () => {
    nock(EXTERNAL_BASE)
      .get('/v1/secret/files')
      .reply(200, { files: ['empty.csv'] })

    nock(EXTERNAL_BASE)
      .get('/v1/secret/file/empty.csv')
      .reply(200, 'file,text,number,hex\n')

    const res = await chai.request(app).get('/files/data')
    expect(res).to.have.status(200)
    expect(res.body[0]).to.have.property('error').that.includes('empty')
  })

  it('filters by ?fileName= queryparam', async () => {
    nock(EXTERNAL_BASE)
      .get('/v1/secret/files')
      .reply(200, { files: ['file1.csv', 'file2.csv'] })

    nock(EXTERNAL_BASE)
      .get('/v1/secret/file/file1.csv')
      .reply(200, VALID_CSV)

    const res = await chai.request(app).get('/files/data?fileName=file1.csv')
    expect(res).to.have.status(200)
    expect(res.body).to.have.lengthOf(1)
    expect(res.body[0].file).to.equal('file1.csv')
  })
})

describe('GET /files/list', () => {
  afterEach(() => nock.cleanAll())

  it('returns the list of files from the external API', async () => {
    nock(EXTERNAL_BASE)
      .get('/v1/secret/files')
      .reply(200, { files: ['file1.csv', 'file2.csv'] })

    const res = await chai.request(app).get('/files/list')
    expect(res).to.have.status(200)
    expect(res.body).to.deep.equal({ files: ['file1.csv', 'file2.csv'] })
  })
})
