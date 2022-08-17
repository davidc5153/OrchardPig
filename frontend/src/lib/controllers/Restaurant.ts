import api from "$lib/util/api"

export const AVAILABILITY_URL = '/restaurant/availability'

// returns a Date object offset by +8 hours
export const UTCtoPerth = (date: Date): Date => {
  const newDate = new Date(date)
  newDate.setTime(newDate.getTime() + (480 * 60 * 1000));
  return newDate
}

class Restaurant {
  // check available timeslots for booking
  async checkAvailability(numGuests: number, date: Date) {
    // prevent changing value of referenced date.
    const selectedDate = UTCtoPerth(date)

    return new Promise((resolve, reject) => {
      api.get(AVAILABILITY_URL, {
        params: {
          guests: numGuests,
          date: selectedDate.toJSON()
        }
      }).then(res => {
        const availableSlots = res.data[selectedDate.toJSON()]
        resolve(availableSlots)
      }).catch(error => {
        console.dir(error)
        reject(error)
      })
    })
  }
}

export default new Restaurant()
