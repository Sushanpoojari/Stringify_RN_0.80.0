import { post } from "../../utils/API/api"

export const postAPI = {
  createPost: async (params) => {
    try {
      const response = await post("/api/questions/postQuestion", params);
      return response;  
    } catch (error) {
      console.log("Create Post Error:: ", error.message || error)
      throw error.message || error
    }
  },

}