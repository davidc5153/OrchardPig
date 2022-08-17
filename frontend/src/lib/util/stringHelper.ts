// returns singular / plural noun based on the quantity of a thing.
export const quantify = (quantity: number, noun: string): string => {
  if (quantity === 1) {
    return `${quantity} ${noun}`;
  }

  if (quantity < 0) {
    quantity = 0;
  }

  return `${quantity} ${noun}s`;
};
