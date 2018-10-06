const express = require('express')
const {getCacheByKey, createCache, setCache, listCache, deleteCache, deleteCacheByKey } = require('../../../db/mongo')
const router = express.Router()

/* GET cache key listing. */
router.get('/', async (req, res) => {
  await listCache()
  result = await (listCache())
  result = result.map(el => el.key)
  res.send(parseResult(result))
})


/* Handle errors and return result */
function parseResult(result){
  let finalResult = {}
  if (result) {
    finalResult.status = 200
    if (result.key) {
      finalResult.data = {
        key : result.key,
        value: result.value
      }
    } else if (result.length >= 0) {
      finalResult.data = result
    }
    finalResult.success= true
  }  else {
    finalResult.status = 501
    finnalResult.error = {
      message: result.message
    }
  }
  return finalResult
}

/* GET one cache. */
router.get('/:key', async (req, res) => {
  let result = await (getCacheByKey(req.params.key))
  if (result) {console.log('cache Hit')}
  else{
    console.log('cache miss')
    await createCache(req.params.key, String(Math.random()))
    result = await (getCacheByKey(req.params.key))
  }
  res.send(parseResult(result))
})

/* Create or Update cache by Key. */
router.post('/:id', async (req, res) => {
  const result = await createCache(req.params.id, req.body.value)
  res.send(parseResult(result))
})

/* Delete one cache by Key. */
router.delete('/:key', async (req, res) => {
  let result = await (deleteCacheByKey(req.params.key))
  res.send(parseResult(result))
})

/* DELETE all cache. */
router.delete('/', async (req, res) => {
  await deleteCache()
  result = await (deleteCache())
  res.send(parseResult(result))
})

module.exports = router
