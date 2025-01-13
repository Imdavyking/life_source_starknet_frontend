const coingeckoApiKey = import.meta.env.VITE_COIN_GECKO_API_KEY;
export const fetchPrice = async (coingeckoId, defaultCurrency = "USD") => {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${coingeckoId}&vs_currencies=${defaultCurrency}&include_24hr_change=false`
  );
  const data = await response.json();
  return data[coingeckoId][defaultCurrency.toLowerCase()];
};
