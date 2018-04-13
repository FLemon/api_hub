'use strict'

module.exports = foo => new Promise((resolve, reject) => {
  foo((error, result) => {
    if (error) {
      console.log(`error: ${error}`)
      reject(error)
    } else {
      resolve(result)
    }
  })
})
