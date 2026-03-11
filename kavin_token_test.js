import express from 'express';
import axios from 'axios';

const app=express();
const PORT=5050;
app.use(express.json());
let movies=[];
async function loadMovies(){
    try{
        const tokenResponse=await axios.post(
            "https://t4e-demotestserver.onrender.com/api/public/token",
            {
                studentId:"E0223032",
                set:"setA" 
            }
        );
        const token=tokenResponse.data.token;
        const baseurl="https://t4e-demotestserver.onrender.com/api";
        const dataurl=baseurl+tokenResponse.data.dataUrl;
        console.log("token:",token);
        console.log("dataurl:",dataurl);
        const dataResponse=await axios.get(dataurl, {
            headers:{
                Authorization: `Bearer ${token}`                
            }
        }); 
        console.log("Movies loaded:",dataResponse.data);
        movies=dataResponse.data.data.movies;
        console.log("Movies length:",movies.length);
        console.log("Movies:",movies);
    }
    catch(error){
        if (error.response){
            console.log("API error:",error.response.data);
        }
        else{
            console.log(error.message);
        }
    }
}
loadMovies();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});