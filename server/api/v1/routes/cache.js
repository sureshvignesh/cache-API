const express = require('express')
const {getCacheByKey, updateCacheById, createCache, setCache, listCache, deleteCache } = require('../../../db/mongo')
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

router.patch('/:id', async (req, res) => {
  const result = await updateCacheById(req.params.id, req.body.value)
  res.send(result)
})


router.post('/:id', async (req, res) => {
  const result = await createCache(req.params.id, req.body.value)
  res.send(result)
})


router.get('/key', (req, res) => {
  res.send(getCacheById(res.params.id))
})

/* DELETE all cache. */
router.delete('/', async (req, res) => {
  await deleteCache()
  result = await (deleteCache())
  res.send(result)
})

module.exports = router
