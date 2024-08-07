import {callApi} from '@zayne-labs/callapi'

export const callMainApi = callApi.create({
    timeout: 30000,
    // auth:{
    //   token: localStorage.getItem("token")
    // },
   
    // baseURL:"https://exchange-tan.vercel.app/api/v1",
    baseURL:"http://localhost:8000/api/v1",
    headers : {
      "authorization" : `Token ${localStorage.getItem("token")}`
      
    }
    
  
  })