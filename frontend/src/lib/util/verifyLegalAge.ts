// returns the number of years since a date
function calculateYears(date: Date): number {
  // calculate the time since the given date in milliseconds
  const timeSinceDate = Date.now() - date.getTime()

  // get the year of 1970 + given time
  const yearsSince1970 = new Date(timeSinceDate).getUTCFullYear()
  const earliestYear = 1970

  // calculate the difference in years
  const years = yearsSince1970 - earliestYear

  return years
}

// checks if the given birthdate is 18 or older
function verifyLegalAge(birthdate: Date): boolean {
  return calculateYears(birthdate) >= 18
}

export default verifyLegalAge
