import api from "./api";

export const createOrGetConversation = async (receiverId: string) => {
  const response = await api.post("/conversations", {
    receiverId,
  });

  return response.data;
};