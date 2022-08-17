import api, { setAuthorization } from '$lib/util/api'
import { goto } from "$app/navigation"
import { session } from "$app/stores"
import { browser } from '$app/env'
import Guest from './guest/Guest'
import loading from '../../store/loading'
import Cart from '$lib/util/Cart'
import Member from './Member'

const SIGNIN_URL = '/auth/signin'
const VALIDATE_URL = '/auth/validate'

// stores a JWT in a cookie
export function storeAccessToken(accessToken: string): void {
  if (browser) {
    document.cookie = `accessToken=${accessToken}; path=/; SameSite=None; max-age=604800; Secure`
    console.log(`Access token stored: ${document.cookie}`)
    return
  }
  console.error('Access token should be stored in the browser.')
}

// contains methods for authenticating a user
class Auth {
  // checks if user credentials are correct then returns user data and stores access token
  async signin(email: string, password: string, openId: Record<string, string> | null = null) {
    return new Promise((resolve, reject) => {
      api.post(SIGNIN_URL, {
        email: email,
        password: password,
        openId: openId
      }).then(response => {
        // check if response has access token and user data
        if (!(response.data?.user && response.data?.accessToken)) {
          throw new Error('Invalid response. No user / access token found')
        }

        const payload = response.data

        storeAccessToken(payload.accessToken)

        // store payload data from signin
        session.update(session => {
          session.user = payload.user;
          session.accessToken = payload.accessToken;

          // update signed in member cart with guest cart items
          payload.cart.forEach((item: CartItem) => {
            // add to quantity if item exists in cart
            const existingItem = Cart.search(session.cart, item.product.id)
            if (existingItem) {
              const i = session.cart.indexOf(existingItem)
              session.cart[i].quantity += item.quantity
              return
            }

            // else add the new item to cart
            session.cart.push(item)
          })

          // replace cart in database with new cart state
          Member.replaceCart(session.cart, payload.accessToken)
          Guest.clearCart()

          if (payload.user.address) {
            session.delivery = {
              address: payload.user.address,
              city: payload.user.city,
              postcode: payload.user.postcode,
              state: payload.user.state
            }
          }

          return session
        })

        console.log(`POST > auth/signin success: '${payload.user.email}' logged in`)
        resolve(payload)
      }).catch(error => {
        console.error('POST > auth/signin', error)
        reject('Invalid email / password')
      })
    })
  }

  // check if user access token is valid then returns user data
  async validate(accessToken: string) {
    return new Promise((resolve, reject) => {
      api.get(VALIDATE_URL, setAuthorization(accessToken)).then(res => {
        const payload = res.data
        console.log(`GET > auth/validate success: '${payload.user.email}' valid JWT`)
        resolve(payload)
      }).catch(error => {
        console.error('GET > auth/validate', error)
        reject(error)
      })
    })
  }

  // signs a user out and redirects to home page
  async signout() {
    // display loading spinner
    loading.update(() => true)

    // delete access token cookie by setting the earliest expiry date
    document.cookie = `accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`

    // check if guest user has cart data
    return new Promise((resolve, reject) => {
      Guest.loadCart().then(cart => {
        goto('/')

        // remove all registered member session data
        session.update((session) => {
          session = { cart }

          return session
        })
        loading.update(() => false)
        resolve(cart)
      }).catch(error => {
        console.error('retrieving Guest\'s cart from local storage', error)
        loading.update(() => false)
        reject(error)
      })
    })
  }
}

export default new Auth()
