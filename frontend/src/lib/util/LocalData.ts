import { browser } from '$app/env'

export function checkRunningInBrowser(): void {
  if (!browser) {
    throw new Error('client-side code must be run in browser only')
  }
}

// helper functions for manipulating the browser's local storage
class LocalData {
  // save a value to local storage
  async set(key: string, data: unknown) {
    try {
      checkRunningInBrowser()

      const jsonString = JSON.stringify(data)

      localStorage.setItem(key, jsonString)
      return data
    } catch (error) {
      console.error(error)
      return null
    }
  }

  // load a value from local storage
  async get(key: string) {
    let jsonString
    let data = null

    try {
      checkRunningInBrowser()

      jsonString = localStorage.getItem(key)
      if (!jsonString || jsonString.length < 1) {
        return null
      }

      data = JSON.parse(jsonString)
      if (!data) {
        throw new Error('Local storage data is corrupted')
      }
    } catch (error) {
      localStorage.removeItem(key)
      console.error(error)
    }

    return data
  }
}

export default new LocalData()