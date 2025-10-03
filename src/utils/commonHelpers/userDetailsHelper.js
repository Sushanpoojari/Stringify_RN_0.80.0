import { useSelector } from "react-redux"

 const getUser=  ()=>{
const user= useSelector(state=> state.auth.user)
return user
}

 const getUserId=  ()=>{
const user= useSelector(state=> state.auth.user)
return user.user_id
}

export default getUser;
export { getUserId };