import { session } from "$app/stores"
import api, { ORDER_URL, BOOKING_URL, setAuthorization } from "$lib/util/api"
import Cart from '$lib/util/Cart'
import confirmedBooking from "../../store/confirmedBooking"

const CART_URL = '/user/cart'
const ADDRESS_URL = '/user/address'

// allows a logged in user to save their data to the database
class Member {
  // add a product to the cart
  async updateCart(cart: CartItem[], product: Product, quantity: number, accessToken: string) {
    // check if product is already in cart
    const existingItem = Cart.search(cart, product.id)

    // add to cart if it's not already in it
    if (!existingItem) {
      // add the new cart item to the database
      return new Promise((resolve, reject) => {
        api.post(CART_URL, { id: product.id, quantity: quantity }, setAuthorization(accessToken))
          .then(res => {
            const result = res.data
            console.log(`POST > user/cart success: ${result.quantity}x added`)

            // add the cart item to memory
            cart.push({ product: product, quantity: quantity })

            // trigger cart reactivity
            session.update((session) => {
              session.cart = cart
              return session
            })

            resolve(cart)
          }).catch(error => {
            console.error('POST > user/cart', error)
            reject(error)
          })
      })
    }

    // update cart item quantity in database
    return new Promise((resolve, reject) => {
      api.patch(CART_URL, { id: product.id, quantity: existingItem.quantity + quantity }, setAuthorization(accessToken))
        .then(res => {
          const result = res.data
          const i = cart.indexOf(existingItem)

          // backend returns empty Object if item is deleted instead of a message
          if (Object.keys(result).length === 0) {
            // delete item from memory
            const deletedItem = cart.splice(i, 1)[0];
            console.log(`PATCH > user/cart success: ${deletedItem.product.name} removed from cart`);
            resolve(cart)
          } else {
            // update item quantity in memory
            cart[i].quantity = result.quantity
          }

          // trigger cart reactivity
          session.update((session) => {
            session.cart = cart
            return session
          })

          console.log(`PATCH > user/cart success: ${product.name} qty changed to ${result.quantity}`)
          resolve(cart)
        }).catch(error => {
          console.error('PATCH > user/cart', error)
          reject(error)
        })
    })
  }

  async replaceCart(cart: CartItem[], accessToken: string) {
    // PUT > user/cart rqeuires an array of arrays: [id, quantity]
    const cartData = cart.map(item => {
      return [item.product.id, item.quantity]
    })

    return new Promise((resolve, reject) => {
      api.put(CART_URL, { cart: cartData }, setAuthorization(accessToken))
        .then(res => {
          const newCart = res.data.cart

          // trigger cart reactivity
          session.update((session) => {
            session.cart = newCart
            return session
          })

          console.log(`PUT > user/cart success`)
          resolve(cart)
        }).catch(error => {
          console.error('PUT > user/cart', error)
          reject(error)
        })
    })
  }

  // gets a user's address from the database
  async getAddress(accessToken: string) {
    return new Promise((resolve, reject) => {
      api.get(ADDRESS_URL, setAuthorization(accessToken)).then(res => {
        const delivery = res.data
        session.update((session) => {
          session.delivery = delivery
          return session
        })

        console.log(`GET > user/address success: ${delivery.address}`)
        resolve(delivery)
      }).catch(error => {
        console.error('GET > user/address', error)
        reject(error)
      })
    })
  }

  // sets a user's address in the database
  async setAddress(address: string, city: string, state: string, postcode: string, accessToken: string) {
    const delivery = { address: address, city: city, state: state, postcode: postcode }
    return new Promise((resolve, reject) => {
      api.put(ADDRESS_URL, delivery, setAuthorization(accessToken))
        .then(res => {
          const updatedAddress = res.data

          // add to address to session memory
          session.update((session) => {
            session.delivery = updatedAddress
            return session
          })

          console.log(`PUT > user/address success: ${updatedAddress.address},
          ${updatedAddress.city}, ${updatedAddress.state} ${updatedAddress.postcode}`)

          resolve(updatedAddress)
        }).catch(error => {
          console.error('PUT > user/address', error)
          reject(error.response.data?.message)
        })
    })
  }

  // creates an order record in the database
  async checkout(accessToken: string) {
    return new Promise((resolve, reject) => {
      api.post(ORDER_URL, {}, setAuthorization(accessToken)).then(res => {
        console.dir(res)
        // reset cart
        session.update((session) => {
          session.cart = []
          return session
        })
        resolve(res)
      }).catch(error => {
        console.error('POST > order', error)
        reject(error)
      })
    })
  }

  // creates a booking record in the database
  async book(guests: number, date: Date, timeSlot: string, notes: string | undefined, accessToken: string) {
    return new Promise((resolve, reject) => {
      api.post(BOOKING_URL, {
        guests,
        date,
        timeslot: timeSlot,
        notes
      }, setAuthorization(accessToken)).then(res => {
        const bookingDetails = res.data[0]

        confirmedBooking.set(bookingDetails)

        // reset booking session details
        session.update((session) => {
          delete session.booking
          return session
        })

        resolve(bookingDetails)
      }).catch(error => {
        console.error('POST > booking', error)
        reject(error)
      })
    })
  }

  // deletes a user's booking from the database
  async deleteBooking(id: number, accessToken: string) {
    return new Promise((resolve, reject) => {
      // configure req header and body
      let config = setAuthorization(accessToken)
      const body = { data: { id } }
      config = { ...config, ...body }

      api.delete(BOOKING_URL, config).then(res => {
        const result = res.data.bookings

        console.log(`DELETE > /restaurant/book success, booking #${id}`)
        resolve(result)
      }).catch(error => {
        console.error('DELETE > /restaurant/book', error)
        reject(error)
      })
    })
  }
}



export default new Member()
