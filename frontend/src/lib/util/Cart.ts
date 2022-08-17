class Cart {
  // finds an item in the cart matching the product id
  search(cart: CartItem[], productId: number): CartItem | null {
    // check if there are items in the cart
    if (!cart || cart.length < 1) {
      return null
    }

    return cart.find(item => item.product.id === productId) ?? null
  }

  // calculates the subtotal for an array of cart items
  calculateSubtotal(cart: CartItem[]): number {
    const initialValue = 0;
    let subTotal = 0;

    subTotal = cart.reduce((previousValue: number, currentItem: CartItem) => {
      return previousValue + currentItem.product.price * currentItem.quantity;
    }, initialValue);

    return subTotal
  }

  // calculates the total weight of an array of cart tiems
  calculateTotalWeight(cart: CartItem[]): number {
    const initialValue = 0;
    let totalWeight = 0;

    totalWeight = cart.reduce((previousValue: number, currentItem: CartItem) => {
      return previousValue + currentItem.product.weight * currentItem.quantity;
    }, initialValue);

    return totalWeight
  }

  /**
   * Calculates shipping costs based on total order weight and price.
   *
   * @param {number} totalWeight - The total weight of all the products in the order in grams.
   * @param {number} subtotal - The total price of the order.
   *
   * @returns {number} The estimated shipping costs
   */
  calculateShipping(cart: CartItem[]): number {

    const subtotal = this.calculateSubtotal(cart)
    const totalWeight = this.calculateTotalWeight(cart)

    const SHIPPING_FREE_THRESHOLD = 70; // Free shipping if order is over this amount
    const SHIPPING_BASE_CHARGE = 9; // Base shipping charge
    const SHIPPING_EXCESS_PER_KG = 1; // Extra shipping for every 1kg of weight
    // Alternative: retrieve shipping constants from a database.

    if (subtotal >= SHIPPING_FREE_THRESHOLD) {
      return 0;
    }
    return SHIPPING_BASE_CHARGE + (SHIPPING_EXCESS_PER_KG * totalWeight) / 1000;
  }

  calculateShippingTax(shippingCost: number): number {
    const SHIPPING_TAX_PERCENTAGE = 0.1; // Tax on shipping.
    return shippingCost * SHIPPING_TAX_PERCENTAGE
  }
}

export default new Cart()
