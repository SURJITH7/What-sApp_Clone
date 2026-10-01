import api from "./api";

export const getMessages = async (conversationId: string) => {
  const response = await api.get(`/messages/${conversationId}`);

  return response.data;
};