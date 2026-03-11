import axios from 'axios';

const BASE_URL= "https://t4e-demotestserver.onrender.com/api";
let movies=[];

async function getToken() {
    try{
        // 1) PUBLIC: get token + dataUrl
        const response = await axios.post(`${BASE_URL}/public/token`,
            {
                studentId :"E0223028",
                set :"setA"
            }
        );
        console.log("Full response data:",response.data);
        const token= response.data.token;
        const dataUrl=response.data.dataUrl;

        console.log("Token: ",token);
        console.log("the private url: ",dataUrl);

        // 2) PRIVATE: get dataset using token + dataUrl
        const dataresponse = await axios.get(`${BASE_URL}${dataUrl}`,
            {
                headers:{
                    Authorization:`Bearer ${token}`
                }
            }
        );
        console.log("Private Data raw: ", dataresponse.data);
        movies=dataresponse.data.data.movies;
        console.log("Movies: ",movies);
    }
    catch(error){
        console.log(error.message);
    }
}

getToken();