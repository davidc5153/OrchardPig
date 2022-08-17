import cookie from 'cookie'
import type { Handle, GetSession } from '@sveltejs/kit'
import Auth from '$lib/controllers/Auth'

export const handle: Handle = async ({ event, resolve }) => {
	const cookies = cookie.parse(event.request.headers.get('cookie') || '')

	// check if user has JWT cookie stored
	if (!cookies.accessToken) {
		return await resolve(event)
	}

	// validates user access token if any and stores user data
	event.locals.payload = cookies.accessToken ? await Auth.validate(cookies.accessToken) : null
	// save JWT to be used in user requests
	if (event.locals.payload) {
		event.locals.payload.accessToken = cookies.accessToken
	}

	// request.locals must be set before resolving request
	const response = await resolve(event)

	if (!event.locals.payload) {
		// delete jwt cookie if /auth/validate failed
		response.headers.set(
			'set-cookie',
			cookie.serialize('jwt', '', {
				path: '/',
				// earliest date causes cookie to be deleted (expires instantly)
				expires: new Date('Thu, 01 Jan 1970 00:00:00 UTC')
			}))
	}

	return response
}

interface MemberSessionData {
	user: User,
	cart: CartItem[],
	accessToken: string,
	delivery?: {
		address: string,
		city: string,
		state: string,
		postcode: string
	}
}

export const getSession: GetSession = async function getSession(event) {
	const payload = event?.locals?.payload
	// load member data if the prior access token validation succeeds
	if (payload) {
		const sessionData: MemberSessionData = {
			user: payload.user,
			cart: payload.cart,
			accessToken: payload.accessToken,
		}

		if (payload.user.address) {
			sessionData.delivery = {
				address: payload.user.address,
				city: payload.user.city,
				state: payload.user.state,
				postcode: payload.user.postcode
			}
		}
		return sessionData
	}

	return { cart: [] }
}
