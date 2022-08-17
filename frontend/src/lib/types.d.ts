/**
 * Can be made globally available by placing this
 * inside `global.d.ts` and removing `export` keyword
 */
// stores information about a product
interface Product {
	id: number
	type: string
	name: string
	price: number
	description: string
	image: string
	alt: string
	weight: number
}

// stores the personal information of a customer
interface User {
	firstName: string
	lastName: string
	phone: string
	email:string
	dob: string
	accessToken?: string
}

// stores credit card information
interface PaymentMethod {
	type: string
	cardNumber: string
	expiryDate: string
	cardholderName: string
	cvv: string
}

// stores the quantity of products added to a cart
interface CartItem {
	product: Product
	quantity: number
}

interface DeliveryAddress {
	address: string
	city: string
	state: string
	postcode: string
}

// details while a user is making a booking
interface BookingProcess {
	guests: number
	date: Date
	timeSlot: string
	notes?: string
}

// details of a confirmed user booking
interface Booking {
	id: number
	guests: number
	date: string
	timeslot: string
	notes?: string
}

interface Order {
	orderId: number
	date: string
	status: string
	shipping: string
	price: string
	tax: string
	cart: [{
		product: Product
		quantity: number
	}]
}