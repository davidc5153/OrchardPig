import api, { setAuthorization } from '$lib/util/api'
import { session } from '$app/stores';
import { storeAccessToken } from './Auth';

const URL = '/user'

class AccountSystem {
  async updateMember(user: User, firstName: string, lastName: string, dob: string, phone: string, email: string, accessToken: string) {
    const newUser: User = { firstName, lastName, dob, phone, email };

    // only send modified fields
    let modifiedFields = {}
    Object.keys(newUser).forEach((key) => {
      if (user[key] !== newUser[key]) {
        modifiedFields[key] = newUser[key]
        console.log(`Changing ${key} from ${user[key]} to ${newUser[key]}`)
      }
    })

    return new Promise((resolve, reject) => {
      // PUT > user endpoint expects an object with 'user' key
      api.put(URL, { user: modifiedFields }, setAuthorization(accessToken))
        .then(response => {
          const result = response.data

          session.update((session) => {
            session.user = newUser;
            return session
          })

          console.log(`PUT > /user success: ${result}`)
          resolve(result)
        }).catch(error => {
          console.error(`PUT > /user ${error}`)
          reject(error.response.data?.message)
        })
    })
  }

  async addMember(firstName: string, lastName: string, dob: string, phone: string, email: string, password: string) {
    const user = {
      firstName,
      lastName,
      dob,
      phone,
      email,
      password
    };

    return new Promise((resolve, reject) => {
      api.post(URL, { user: user }).then(response => {
        const result = response.data

        storeAccessToken(result.accessToken)

        // store payload data from signin
        session.update((session) => {
          session.user = user;
          session.accessToken = result.accessToken;
          session.cart = [];

          return session
        })

        console.log(`POST > /user success: ${result}`)
        resolve(result)
      }).catch(error => {
        console.error(`POST > /user ${error}`)
        console.dir(error)
        reject(error.response.data?.message)
      })
    })
  }
}

export default new AccountSystem()
