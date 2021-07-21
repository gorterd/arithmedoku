export let dbAdd
export let dbGet

const DB_FALLBACK_MS = 1000

if (Worker && indexedDB) {
  const storageWorker = new Worker('./dist/worker.js')
  const callbackRegistry = {}

  const dbLoaded = new Promise((resolve, reject) => {
    const failure = () => {
      storageWorker.onmessage = null
      setupLocalStorageDb()
      console.log('indexedDb failed to load, falling back to local storage')
      reject()
    }

    const timeoutId = window.setTimeout(failure, DB_FALLBACK_MS)

    storageWorker.onmessage = msg => {
      const { requestId, ...otherData } = msg.data
      const fulfilledCb = callbackRegistry[requestId]

      if (fulfilledCb) {
        fulfilledCb(otherData)
        delete callbackRegistry[requestId]
      } else if (msg.data.type === 'META') {
        if (msg.data.status === 'dbLoaded') {
          window.clearTimeout(timeoutId)
          resolve()
        } else if (msg.data.status === 'dbFailure') {
          window.clearTimeout(timeoutId)
          failure()
        }

        console.log(msg.data.status)
      } else {
        console.log('Failed to find matching request for: ', msg)
      }
    }
  })

  dbAdd = (key, value, timeout = 1000) => {
    return send({
      type: 'ADD',
      key,
      value
    }, timeout).then(
      () => true,
      () => false
    )
  }

  dbGet = (key, timeout = 2000) => {
    return send({
      type: 'GET',
      key,
    }, timeout).then(
      ({ result }) => result,
      (error) => console.log(error)
    )
  }

  async function send(message, timeout) {
    await dbLoaded

    const requestId = Math.random()
    storageWorker.postMessage({
      ...message,
      requestId,
    })

    return new Promise((resolve, reject) => {
      if (timeout !== undefined) {
        const timeoutId = window.setTimeout(() => {
          reject('Request timed out')
        }, timeout)

        addCbToRegistry(requestId, resolve, reject, () => {
          window.clearTimeout(timeoutId)
        })
      } else {
        addCbToRegistry(requestId, resolve, reject)
      }
    })
  }

  function addCbToRegistry(
    requestId,
    resolve,
    reject,
    onFulfilled = () => { }
  ) {
    callbackRegistry[requestId] = (data) => {
      onFulfilled()
      return data.status === 'error'
        ? reject(data)
        : resolve(data)
    }
  }

} else {
  setupLocalStorageDb()
}

function setupLocalStorageDb() {
  dbAdd = async (key, value) => {
    window.localStorage.setItem(key, JSON.stringify(value))
  }

  dbGet = async key => {
    const item = window.localStorage.getItem(key)
    return JSON.parse(item)
  }
}

window.dbAdd = dbAdd
window.dbGet = dbGet