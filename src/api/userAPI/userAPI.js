import { post, postFormData } from "../../utils/API/api"

export const userAPI = {
    getDashboardData: async (params) => {
        try {
            const response = post("/api/user/fetchDashboard", params)
            return response
        } catch (error) {
            console.log("Failed To fetch the Dashboard Data ::", error)
            throw error.message || error
        }
    },
    getUserData: async (params) => {
        try {
            const response = post("/api/user/fetchProfile", params)
            return response

        } catch (error) {
            console.log("Failed To fetch the User Data ::", error)
            throw error.message || error
        }
    },
    updateProfile: async (params) => {
        try {
            const response = postFormData("/api/user/updateProfile", params)
            return response

        } catch (error) {
            console.log("Failed To update Profile ::", error)
            throw error.message || error
        }
    }
}