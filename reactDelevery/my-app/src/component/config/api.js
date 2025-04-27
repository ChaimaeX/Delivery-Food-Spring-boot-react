import axios from "axios";


export const API_URL='http://localhost:8080';
// https://demo-food-latest.onrender.com

export const api=axios.create({
    baseURL:API_URL,
    headers:{
        "Content-Type":"application/json",

    }
})