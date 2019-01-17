
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
  query(email, policy, id) {
    console.log("ID: ", id)
    if (email && policy) {
      this.options.json.userEmail = email //?
      this.options.json.policy = policy //?

    } else if (id) {
      this.options.url = `${this.options.url}${id}`
      console.log(this.options.url)
    }
    return new Promise((resolve, reject) => {
      console.log(this.options)
      request(this.options, function (error, response, body) {
        if (error) reject(error)
        console.log("LICENCE CLASS: " , body)
        resolve(body) //?
      })
    })
  }
}

//   let myNucleus;options = "84bb1a3bec70e4bf9b7c"

let getLicence = new myNucleus("GET",
  `https://nucleus.sh/app/5c2fd2e8ffc1fb00ce9582e2/license/`, {}) //?

let getPolicy = new myNucleus("GET",
  `https://nucleus.sh/app/5c2fd2e8ffc1fb00ce9582e2/policies`, {}) //?


let createLicence = new myNucleus("POST",
  `https://nucleus.sh/app/5c2fd2e8ffc1fb00ce9582e2/licenses/`, {}) //?

// let updateLicence = new myNucleus("PUT",
//   `https://nucleus.sh/app/5c2fd2e8ffc1fb00ce9582e2/license/`, {}) //?

export {
  getLicence,
  getPolicy,
  createLicence,
  updateLicence
}