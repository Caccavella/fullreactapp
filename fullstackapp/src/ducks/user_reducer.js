import axios from 'axios';

//Set the initial state:
const initialState = {
    user: {}
}

//Action Types:
const GET_USER_INFO = "GET_USER_INFO";





//Action Creators

export function getUserInfo() {

    const userInfo = axios.get('/auth/me').then( res => {
        return res.data
    })

    return {
        type: GET_USER_INFO,
        payload: userInfo
    }
}




//Reducer Function
export default function reducer(state = initialState, action) {
    switch(action.type) {
        case GET_USER_INFO + '_FULFILLED':
            return Object.assign([], state, {user: action.payload})
        default:
            return state;
    }
}