import express from 'express';
import axios from 'axios';

const app=express();
app.use(express.json());

const BASE_URL="https://t4e-demotestserver.onrender.com/api";
let movies=[];

async function GetToken() {
    const response = await axios.post(`${BASE_URL}/public/token`,

        {
            studentId : "E0223028",
            set : "setA"
        }
    );

    const token=response.data.token;
    const dataUrl=response.data.dataUrl;

    const dataResponse = await axios.get(`${BASE_URL}${dataUrl}`,
        {
            headers : {
                Authorization : `Bearer ${token}`
            }
        }
    )

    movies= dataResponse.data.data.movies;

}

app.get('/',(req,res)=>{
    res.send("Server is working");
});

//1.static endpoint
app.get('/movies',(req,res)=>{
    res.json({
        Total_length : movies.length,
        Movies : movies
    });
});

//3.Filter by query parameter(?)
app.get('/movies/search',(req,res)=>{
    const genre= req.query.genre;
    const result = movies.filter(m =>m.genre.includes(genre));
    res.json(result);
});

//4.Total count
app.get('/movies/count',(req,res)=>{
    res.json({Movies_Count : movies.length});
});

//5.Genre list (all unique)
app.get('/movies/genres',(req,res)=>{
    const genres=[...new Set(movies.flatMap(m=>m.genre))];
    res.json(genres);
});

//6.Belongs to multiple genre
app.get('/movies/multi-genre',(req,res)=>{
    const result=movies.filter(m=>m.genre.length > 1);
    res.json(result);
});

//7.Count for each genre
app.get('/movies/genre/counts',(req,res)=>{
    const counts={};
    movies.forEach(movie=>{
        movie.genre.forEach(g=>{
            counts[g] = (counts[g] || 0) +1;
        });
    });
    res.json(counts);
});

//8. First movie for each genre
app.get('/movies/genre/first',(req,res)=>{
    const result={};
    movies.forEach(movie=>{
        movie.genre.forEach(g=>{
            if (!result[g]){
                result[g]=movie.name;
            }
        });
    });

    res.json(result);
});

//9. Most frequent genre
app.get('/movies/genre/popular',(req,res)=>{
    const counts={};
    movies.forEach(movie=>{
        movie.genre.forEach(g=>{
            counts[g]=(counts[g] || 0) +1;
        });
    });
    let maxcount=0;
    let maxgenre=null;
    for (const g in counts){
        if (counts[g]>maxcount) {
            maxcount=counts[g];
            maxgenre=g;
        }
    }
    res.json({
        Popular_genre : maxgenre,
        its_count : maxcount
    });
});

//10. Movies by genre count (Dynamic + filtering)
app.get('/movies/genre/:genre/count',(req,res)=>{
    const genreparams=req.params.genre.toLowerCase();
    const count = movies.filter(m=>m.genre.some(g=> g.toLowerCase()==genreparams)).length;
    if (count==0){
        return res.json({ message: "No movies found for this genre" });
    }
    res.json({
        genre: genreparams,
        count
    });
});

//2.Dynamic endpoint
app.get('/movies/:id',(req,res)=>{
    const movie = movies.find(m=>m.id==req.params.id);
    if (!movie) {
    return res.status(404).json({ message: "Movie not found" });
  }
    res.json(movie);
});

const PORT = process.env.PORT || 5000;

async function start(){
    await GetToken();
    app.listen(PORT,()=>{
        console.log("Server is running");
    });
}

start();