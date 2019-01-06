// export default () => {
//     var letterArr = ('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890').split('')
//     // ['a', 'F', 'S', 'H', 'n', 'K', 'i', 'P', 'U', 'T', 'Y', 'q', 'X', 'V', 'L', 'R', 'O', 'Z', 'b', 'z', 'C']
//     var licence = ''
//     for (var i = 0; i < 64; i++) {
//       licence = licence + letterArr[Math.floor(Math.random() * (60 - 1 + 1) + 1)]
//     }
//     return licence
//   }

const request = require('request');

class myNucleus {
  constructor(method, url, json = {}) {
    this.token = "84bb1a3bec70e4bf9b7c"
    this.options = {
      method,
      url,
      json
    }
    this.options.json.token = this.token
  }
  query(email, policy) {
    if (email && policy) {
      this.options.json.userEmail = email //?
      this.options.json.policy = policy //?

    }
    return new Promise((resolve, reject) => {
      request(this.options, function (error, response, body) {
        if (error) reject(error)
        console.log(body)
        resolve(body) //?
      })
    })
  }
}

//   let myNucleus;options = "84bb1a3bec70e4bf9b7c"

let getLicence = new myNucleus("GET",
  `https://nucleus.sh/app/5c2fd2e8ffc1fb00ce9582e2/licenses`, {}) //?

let getPolicy = new myNucleus("GET",
  `https://nucleus.sh/app/5c2fd2e8ffc1fb00ce9582e2/policies`, {}) //?


let createLicence = new myNucleus("POST",
  `https://nucleus.sh/app/5c2fd2e8ffc1fb00ce9582e2/licenses/`, {}) //?

export {
  getLicence,
  getPolicy,
  createLicence
}