export const roundPrice = (price:any) => {
  let priceRound:any = Number.parseFloat(price);

  const significantDecimals = 3;

  if(priceRound > 1) {
    priceRound = priceRound.toFixed(significantDecimals);
  } else {
    const decimals = (Math.floor(Math.log10(priceRound) + 1) * -1) + significantDecimals
    priceRound = priceRound.toFixed(decimals);
  }

  return priceRound;
}
