const DB_NAME = 'arithmedoku'
const STORE_NAME = 'savedData'

let db

const firstRequest = indexedDB.open(DB_NAME, 2)
attachRequestEventHandlers(firstRequest)

postMessage({
  type: 'META',
  status: 'dbLoading'
})

function attachMessageListener() {
  postMessage({
    type: 'META',
    status: 'dbLoaded'
  })

  onmessage = ({ data }) => {
    const { sendSuccess, sendError } = createSenders(data)
    const { key, value, type } = data

    switch (type) {
      case 'ADD':
        if (db && key && value) {
          const { trans, store } = getWriter()
          const putRequest = store.put(value, key)

          putRequest.onerror = () => sendError()
          trans.oncomplete = () => sendSuccess()
        } else {
          sendError()
        }
        break;
      case 'GET':
        if (db && key) {
          const { trans, store } = getReader()
          const getRequest = store.get(key)

          getRequest.onerror = () => sendError()
          trans.oncomplete = () => sendSuccess(getRequest.result)
        } else {
          sendError()
        }
        break;
      default:
        sendError(`no match for ${type}`)
    }
  }
}

function attachRequestEventHandlers(request) {
  request.onupgradeneeded = handleUpgrade
  request.onsuccess = handleSuccess
  request.onerror = handleFailure
}

function handleUpgrade(e) {
  try {
    e.target.result.createObjectStore(STORE_NAME)
  } catch (e) {
    console.log(e)
  }
}

function handleSuccess(e) {
  db = e.target.result
  if (!db.objectStoreNames.contains(STORE_NAME)) {
    db.close()
    const newRequest = indexedDB.open(DB_NAME, db.version + 1)
    attachRequestEventHandlers(newRequest)
  } else {
    attachMessageListener()
  }
}

function handleFailure(e) {
  postMessage({
    type: 'META',
    status: 'dbFailure',
    result: e
  })
}

function getReader(storeName = STORE_NAME) {
  const trans = db?.transaction(storeName)
  const store = trans?.objectStore(storeName)
  return { trans, store }
}

function getWriter(storeName = STORE_NAME) {
  const trans = db?.transaction(storeName, 'readwrite')
  const store = trans?.objectStore(storeName)
  return { trans, store }
}

function createSenders({ type, requestId }) {
  const responseDefaults = {
    type,
    requestId,
  }

  return {
    sendSuccess: msg => postMessage({
      ...responseDefaults,
      status: 'success',
      result: msg,
    }),
    sendError: msg => postMessage({
      ...responseDefaults,
      status: 'error',
      result: msg,
    }),
  }
}