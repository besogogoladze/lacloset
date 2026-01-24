import api from "./api";

export const updateItemStatus = (id, status) => {
  return api.patch(`/item/updateItem/${id}/status`, { status });
};
