import { combineReducers } from 'redux';
import authReducer from './slices/authSlice'
import postsReducer from './slices/postSlice'
import userProfileReducer from './slices/userProfileSlice'
import commentsReducer from './slices/commentsSlice'

 const rootReducer=combineReducers({
    auth: authReducer,
    posts: postsReducer,
    userProfile: userProfileReducer,
    comments: commentsReducer
})

 export default rootReducer;