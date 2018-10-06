/* eslint-disable no-console */
const { MongoClient, ObjectId } = require('mongodb')
const { mongodb: mongoSecrets } = require('./secrets.json')

const dbFailureFn = (e) => {
  console.error(e)
  console.log()
  console.error(`Failure in connecting ${mongoSecrets.url} ${mongoSecrets.db}`)
  console.error('Shutting down application!')
  console.log()
  process.exit(1)
}

function getMongoDbConnection(dburl) {
  return new Promise((resolve, reject) => {
    MongoClient.connect(dburl, (e, conn) => {
      if (e) return reject(e)
      const query = { _doctype: 'environment-config' }
      conn.collection('system').findOne(query, (e, config) => {
        if (e) return reject(e)
        if (!config) return reject(e)
        return resolve({ url: dburl, conn, cfg: config })
      })
    })
  })
}

/* Use connect method to connect to the server */
const dbPromise = MongoClient.connect(mongoSecrets.url, { useNewUrlParser: true })
  .then((client) => {
    console.log('connected successfully to', mongoSecrets.url, mongoSecrets.db)
    const db = client.db(mongoSecrets.db)
    return db
  })
  .catch(dbFailureFn)

/*
  Function to get the desired collection from database
*/
async function getCollection(collection) {
  const db = await dbPromise.catch(dbFailureFn)
  return db.collection(collection)
}

/*
  Function to get case by its _id
*/
async function getCacheByKey(key) {
  const db = await dbPromise.catch(dbFailureFn)
  return db.collection('cache').findOne({
    key: key
  })
}

/*
  Function to update cache by its key
*/
async function updateCacheById(key, value) {
  const db = await dbPromise.catch(dbFailureFn)
  return db.collection('cache').replaceOne(
    { "key" : key },
    { "key": key, "value": value},
    { upsert: true })
}

/*
  Function to get case by its _id
*/
async function createCache(key, value) {
  const db = await dbPromise.catch(dbFailureFn)
  return db.collection('cache').insertOne( {
    key: key, value: value
  })
}

async function listCache() {
  const db = await dbPromise.catch(dbFailureFn)
  return db.collection('cache').find().toArray()
}

async function deleteCache() {
  const db = await dbPromise.catch(dbFailureFn)
  return db.collection('cache').remove()
}




module.exports = {
  getCacheByKey,
  updateCacheById,
  createCache,
  getCacheByKey,
  listCache,
  deleteCache
}
