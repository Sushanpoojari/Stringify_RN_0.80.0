import { get, post, postFormData } from "../../utils/API/api"

export const CommentsAPI = {
    fetchCommentsForAPost: async (questionID) => {
        try {
            const response = get(`/api/comments/fetchComments/${questionID}`)
            return response
        } catch (error) {
            console.log("Failed To fetch the Comments Data ::", error)
            throw error.message || error
        }
    },
    postAComment: async (params) => {
        try {
            const response = post("/api/comments/postComment", params)
            return response 
        } catch (error) {   
            console.log("Failed To post a Comment ::", error)
            throw error.message || error
        }   
    }
}