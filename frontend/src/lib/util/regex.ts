// HTML validation regex patterns

const NAME_REGEX = "^[\\w'\\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\\]]{1,}$"

const PHONE_REGEX = '^(\\+?\\(61\\)|\\(\\+?61\\)|\\+?61|\\(0[1-9]\\)|0[1-9])?( ?-?[0-9]){8,9}$'

const EMAIL_REGEX = "[^@ \\t\\r\\n]+@[^@ \\t\\r\\n]+\\.[^@ \\t\\r\\n]+"

const CC_REGEX = {
  number: '^[0-9]{12,}$',
  cvv: '^[0-9]{3,4}$'
}

export { NAME_REGEX, PHONE_REGEX, CC_REGEX, EMAIL_REGEX }
