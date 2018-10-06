const express = require('express')
const {getCacheByKey, updateCacheByKey, createCache, setCache, listCache, deleteCache, deleteCacheByKey } = require('../../../db/mongo')
const router = express.Router()

/* GET cache key listing. */
router.get('/', async (req, res) => {
  await listCache()
  result = await (listCache())
  result = result.map(el => el.key)
  res.send(result)
})

/* GET one cache. */
router.get('/:key', async (req, res) => {
  let result = await (getCacheByKey(req.params.key))
  if (result) {console.log('cache Hit!')}
  else{
    console.log('cache miss!')
    await createCache(req.params.key, String(Math.random()))
    result = await (getCacheByKey(req.params.key))
  }
  res.send(result)
})

/* UPDATE one cache. */

router.patch('/:key', async (req, res) => {
  const result = await updateCacheByKey(req.params.id, req.body.value)
  res.send(result)
})


router.post('/:id', async (req, res) => {
  const result = await createCache(req.params.id, req.body.value)
  res.send(result)
})

/* Delete one cache by Key. */
router.delete('/:key', async (req, res) => {
  let result = await (deleteCacheByKey(req.params.key))
  res.send(result)
})

/* DELETE all cache. */
router.delete('/', async (req, res) => {
  await deleteCache()
  result = await (deleteCache())
  res.send(result)
})

module.exports = router
