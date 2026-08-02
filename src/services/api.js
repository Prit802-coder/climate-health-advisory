import axios from "axios";


const API = axios.create({
    baseURL:"http://localhost:5000/api"
});


export const getHealthIndex = async(city)=>{

    const response = await API.get(
        `/health-index?city=${city}`
    );

    return response.data;

};