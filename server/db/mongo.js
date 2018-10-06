/* eslint-disable no-console */
const { MongoClient, ObjectId } = require('mongodb')
const { mongodb: mongoSecrets } = require('./secrets.json')
const {TTL, maxCount} = require('../config')
let count

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
    getCount().then(c => {
      count = c
    })
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
  Function to get cache by its key
*/
async function getCacheByKey(key) {
  removeExpired()
  const db = await dbPromise.catch(dbFailureFn)
  return db.collection('cache').findOne({
    key: key
  })
}


async function getCount() {
  removeExpired()
  const db = await dbPromise.catch(dbFailureFn)
  return db.collection('cache').countDocuments()
}

/*
  Function to get create or update by its keys
*/
async function createCache(key, value) {
  await removeExpired()
  const db = await dbPromise.catch(dbFailureFn)
  if (count >= maxCount) {
    const all = await db.collection('cache').find({}).toArray()

    let minDate = Infinity
    let oldDoc
    for (let doc of all) {
      if (minDate > +doc.lastUpdated) {
        minDate = +doc.lastUpdated
        oldDoc = doc
      }
    }
    count--
    if (oldDoc) await db.collection('cache').deleteOne({_id: oldDoc._id})
  }
  count++
  return db.collection('cache').replaceOne(
    { "key" : key },
    { "key": key, "value": value, "lastUpdated": Date.now()},
    { upsert: true })

}

/*
  Function to list cache keys
*/
async function listCache() {
  removeExpired()
  const db = await dbPromise.catch(dbFailureFn)
  return db.collection('cache').find().toArray()
}

async function deleteCacheByKey(key) {
  removeExpired()
  const db = await dbPromise.catch(dbFailureFn)
  count--
  return db.collection('cache').deleteOne({
    key: key
  })
}

/*
  Function to delete cache by key
*/
async function deleteCache() {
  removeExpired()
  const db = await dbPromise.catch(dbFailureFn)
  count = 0
  return db.collection('cache').deleteMany()
}

/*
  Function to remove TTL expired caches
*/
async function removeExpired() {
  const db = await dbPromise.catch(dbFailureFn)
  const results = (await db.collection('cache').find().toArray()) || []
  for (let doc of results) {
    if (+new Date() - +doc.lastUpdated > TTL) {
      count--
      db.collection('cache').deleteOne({_id: doc._id})
    }
  }
}



module.exports = {
  getCacheByKey,
  createCache,
  getCacheByKey,
  listCache,
  deleteCacheByKey,
  deleteCache
}
