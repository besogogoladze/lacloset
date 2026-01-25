import { getApiCurrency } from "../types/eurCurrency.api";

export const calculateProfitPercent = async (
  euroPrice,
  priceInLari,
  { shippingEuro = 7 } = {},
) => {
  const rate = await getApiCurrency();
  const baseEuro = euroPrice + shippingEuro;
  const baseLari = baseEuro * rate;
  const profitInLari = priceInLari - baseLari;
  return { profitInLari, rate };
};
