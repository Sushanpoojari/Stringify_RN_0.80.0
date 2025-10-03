import { post } from "../../utils/API/api"

export const voteAPI = {
    updateVote: async (params) => {
        try {
            const response = post("/api/votes/updateVote", params)
            return response

        } catch (error) {
            console.log("Failed To Update the Vote::", error)
            throw error.message || error
        }
    },
        
}