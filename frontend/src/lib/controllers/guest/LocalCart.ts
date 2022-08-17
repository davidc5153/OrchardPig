// stores the product id and quantity of a cart item
import LocalData from '$lib/util/LocalData'

interface CartItemData {
  id: number,
  quantity: number
}

const LOCAL_CART_KEY = 'shoppingCart'

class LocalCart {
  // check if locally stored cart data is valid
  async validateData(cartData: unknown) {
    if (!cartData) {
      return []
    }

    if (!(cartData instanceof Array)) {
      localStorage.removeItem(LOCAL_CART_KEY)
      throw new Error('Local storage cart data is corrupted.')
    }

    if (cartData.length > 1) {
      // check if cart item data is valid
      cartData.map(item => {
        if (item instanceof Object &&
          'id' in item && 'quantity' in item &&
          item.id && item.quantity) {
          return item
        }

        console.error('Invalid cart item data removed')
      })
    }

    return cartData
  }

  // gets the cart string stored in local storage and parses it
  async get() {
    const data = LocalData.get(LOCAL_CART_KEY)
    return this.validateData(await data)
  }

  // concatenates the cart item data into a string and saves it locally
  async set(cartData: CartItemData[]) {
    const validatedData: CartItemData[] = await this.validateData(cartData)

    // check if there are any cart items to add
    if (validatedData) {
      return LocalData.set(LOCAL_CART_KEY, validatedData)
    }

    // remove key if array is empty
    localStorage.removeItem(LOCAL_CART_KEY)
    return null
  }

  // add an item to the user's cart
  async add(productId: number, quantity: number) {
    let cartData: CartItemData[] = await this.get()

    if (!cartData) {
      cartData = []
    }

    cartData.push({ id: productId, quantity: quantity })

    this.set(cartData)
  }
}

export default new LocalCart()