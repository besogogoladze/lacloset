import axios from "axios";

export const getApiCurrency = async () => {
  const { data } = await axios.get(
    "https://nbg.gov.ge/gw/api/ct/monetarypolicy/currencies",
  );

  const euro = data[0].currencies.find((eur) => eur.code === "EUR");

  return euro?.rate ?? 3;
};
