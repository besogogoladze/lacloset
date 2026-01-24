import api from "./api";

export const updateItemById = async ({ id, payload }) => {
  const { data } = await api.put(`/item/updateItem/${id}`, payload);
  return data.item;
};
