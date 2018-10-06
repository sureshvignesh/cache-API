const express = require('express')
const {getCacheByKey, updateCacheById, createCache, setCache } = require('../../../db/mongo')
const router = express.Router()

/* GET users listing. */
router.get('/', (req, res) => {
  res.send('You landed on /api/cache/')
})

/* GET one user. */
router.get('/:key', async (req, res) => {
  let result = await (getCacheByKey(req.params.key))
  if (!result) {
    console.log('cache miss!')
    await createCache(req.params.key, String(Math.random()))
    result = await (getCacheByKey(req.params.key))
  }
  res.send(result)
})

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

module.exports = router
