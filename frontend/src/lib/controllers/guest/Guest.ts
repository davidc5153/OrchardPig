import api, { ORDER_URL, PRODUCT_URL } from '$lib/util/api'
import LocalData from '$lib/util/LocalData'
import Cart from '$lib/util/Cart'
import LocalCart from './LocalCart'
import { session } from '$app/stores'

const LOCAL_ADDRESS_KEY = 'shippingAddress'
const LOCAL_USER_KEY = 'user'

// allows a guest user to save their data to local storage
class Guest {
  // loads the product data and quantities for the product ids in storage
  async loadCart() {
    const cartData = await LocalCart.get()

    // check if cart data exists
    if (cartData.length < 1) {
      return cartData
    }

    // get product ids of cart items
    const productIDs = cartData.map((item) => {
      return item.id
    })

    // get product data for each product id
    return new Promise((resolve, reject) => {
      api.get(PRODUCT_URL, {
        params: {
          products: `[${productIDs}]`
        }
      }).then(res => {
        const cart: CartItem[] = []

        // need to check if data returned is an array or not because
        // response does not return an array if result is only for 1 product
        if (res?.data?.products) {
          res.data.products.forEach((product: Product, i: number) => {
            // only add product results whose id was saved in local storage
            if (productIDs.indexOf(product.id) > -1) {
              cart.push({ product: product, quantity: cartData[i].quantity })
            }
          })
        } else {
          // add only one product to the cart
          cart.push({ product: res.data, quantity: cartData[0].quantity })
        }

        resolve(cart)
      }).catch(error => {
        console.error(`GET > /product?products=[${productIDs}]`, error)
        reject(error)
      })
    })
  }

  // update a cart item's quantity or add it to the cart
  async updateCart(cart: CartItem[], product: Product, quantity: number) {
    // find selected cart item
    const existingItem = Cart.search(cart, product.id)

    // add to cart if it's not already in it
    if (!existingItem) {
      return new Promise((resolve, reject) => {
        LocalCart.add(product.id, quantity).then(() => {
          // update cart stored in session
          cart.push({ product: product, quantity: quantity })
          // trigger cart reactivity
          session.update((session) => {
            session.cart = cart
            return session
          })

          resolve(cart)
        }).catch(error => {
          console.error('adding cart item to local storage', error)
          reject(error)
        })
      })
    }

    // update item quantity in memory
    const i = cart.indexOf(existingItem)
    cart[i].quantity += quantity

    if (cart[i].quantity < 1) {
      // remove item from cart
      const deletedItem = cart.splice(i, 1)[0];
      console.log(`Removed product ${deletedItem.product.id} from cart`);
    }

    // keep cart items product id and quantity only
    const cartData = cart.map((item) => {
      return { id: item.product.id, quantity: item.quantity }
    })

    // save changes
    return new Promise((resolve, reject) => {
      LocalCart.set(cartData).then(() => {
        // trigger cart reactivity
        session.update((session) => {
          session.cart = cart
          return session
        })
        resolve(cart)
      }).catch(error => {
        console.error('updating cart item in local storage', error)
        reject(error)
      })
    })
  }

  // removes all Guest cart items
  async clearCart() {
    const cart: [] = []
    return new Promise((resolve, reject) => {
      LocalCart.set(cart).then(() => {
        // trigger cart reactivity
        session.update((session) => {
          session.cart = cart
          return session
        })
        resolve(cart)
      }).catch(error => {
        console.error('clearing cart in local storage', error)
        reject(error)
      })
    })
  }

  // retrieves a guest user's address from local storage
  async getAddress() {
    return new Promise((resolve, reject) => {
      LocalData.get(LOCAL_ADDRESS_KEY).then(deliveryAddress => {
        if (!deliveryAddress) {
          console.log('no Guest address data in local storage')
          resolve(deliveryAddress)
          return
        }

        // store address in session memory
        session.update((session) => {
          session.delivery = deliveryAddress
          return session
        })
        resolve(deliveryAddress)
      }).catch(error => {
        console.error('retrieving address from local storage', error)
        reject(error)
      })
    })
  }

  // updates a guest user's address
  async setAddress(address: string, city: string, state: string, postcode: string) {
    const shippingAddress = {
      address: address,
      city: city,
      state: state,
      postcode: postcode
    }

    return new Promise((resolve, reject) => {
      LocalData.set(LOCAL_ADDRESS_KEY, shippingAddress).then(updatedAddress => {
        session.update((session) => {
          session.delivery = updatedAddress
          return session
        })
        resolve(updatedAddress)
      }).catch(error => {
        console.error('saving address to local storage', error)
        reject(error)
      })
    })
  }

  // retrieves user details from local storage
  async getUser() {
    return new Promise((resolve, reject) => {
      LocalData.get(LOCAL_USER_KEY).then(userDetails => {
        if (!userDetails) {
          console.log('no Guest user data in local storage')
          resolve(userDetails)
          return
        }

        session.update((session) => {
          session.user = userDetails
          return session
        })
        resolve(userDetails)
      }).catch(error => {
        console.error('retrieving guest details', error)
        reject(error)
      })
    })
  }

  async setUser(firstName: string, lastName: string, dob: string, phone: string, email: string) {
    const user = {
      firstName: firstName,
      lastName: lastName,
      dob: dob,
      phone: phone,
      email: email
    };

    return new Promise((resolve, reject) => {
      LocalData.set(LOCAL_USER_KEY, user).then(userDetails => {
        session.update((session) => {
          session.user = userDetails
          return session
        })
        resolve(userDetails)
      }).catch(error => {
        console.error('saving guest details', error)
        reject(error)
      })
    })
  }

  async checkout(firstName: string, lastName: string, dob: string,
    phone: string, email: string, address: string, city: string,
    state: string, postcode: string, cart: CartItem[]) {
    // endpoint expects cart data as array of arrays (not array of CartItem objects)
    const cartData = cart.map(item => {
      return [item.product.id, item.quantity]
    })

    const body = {
      user: {
        firstName: firstName,
        lastName: lastName,
        dob: dob,
        phone: phone,
        email: email,
        address: address,
        city: city,
        state: state,
        postcode: postcode
      },
      cart: cartData
    }

    return new Promise((resolve, reject) => {
      api.post(ORDER_URL, body).then(res => {
        console.dir(res)
        // reset cart
        this.clearCart()
        resolve(res)
      }).catch(error => {
        console.error(`POST > order ${error}`)
        reject(error)
      })
    })
  }
}

export default new Guest()
