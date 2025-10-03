import { post } from "../../utils/API/api"

export const authAPI = {
  login: async ( params) => {
    try {
      const reponse = await post("/api/user/signin", params);
      return reponse
    } catch (error) {
      console.log("Login Error:: ", error.message || error)
      throw error.message || error
    }
  },
  signup: async (params) => {
    try {
      const reponse = await post("/api/user/signup", params);
      return reponse;
    } catch (error) {
      console.log("Sign Up Error:: ", error)
      throw error;
    }
  }
}