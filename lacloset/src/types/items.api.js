import api from "./api";

export const getItems = async () => {
  const { data } = await api.get("/item/itemsList");
  return data.items;
};
