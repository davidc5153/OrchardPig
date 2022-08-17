import axios from "axios"

// URL to AWS endpoints
export const BASE_URL = 'https://pfeaxlb9el.execute-api.ap-southeast-2.amazonaws.com/Prod'
axios.defaults.baseURL = BASE_URL

export const PRODUCT_URL = '/product'
export const ORDER_URL = '/order'
export const BOOKING_URL ='/restaurant/book'

// sets the JWT in the request header
export function setAuthorization(accessToken: string): { headers: { Authorization: string } } {
  return {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  }
}

// url for Google API
const GOOGLE_API_KEY = "***REMOVED***"

import { Loader } from "@googlemaps/js-api-loader";
export const googleMapsApi = new Loader({
  apiKey: GOOGLE_API_KEY,
  version: "weekly",
  libraries: ["places"],
})

// use this axios instance with baseURL already set to call api
export default axios
