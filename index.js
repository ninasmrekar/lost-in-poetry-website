import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.listen(3000, () => {
    console.log("Server running on port 3000.");
});

var titles = [];
var poem = [];

app.get("/", (req, res) => {
    res.render("index.ejs", {data: titles});
});

app.post("/get-poet", async (req, res) => {
    try{        
        titles = [];
        if(req.body.search === "author"){
            var response = await axios.get(`https://poetrydb.org/author/${req.body.keyword}/author,title`);  
            titles = response.data;
        } else if(req.body.search === "title"){
            var response = await axios.get(`https://poetrydb.org/title/${req.body.keyword}`); 
            titles = response.data; 
        }
        res.redirect("/");
    }    
    catch(error){
        res.render("index.ejs");
    }
});

app.get("/poem/:id", async (req, res) => {
    try{        
        var id = req.params.id;
        var poem = await axios.get(`https://poetrydb.org/title/${titles[id].title}`);  
        res.render("poem.ejs", {poem: poem.data[0]});
    }    
    catch(error){
        res.render("index.ejs");
    }
});

app.get("/random", async (req, res) => {
    try{        
        poem = await axios.get(`https://poetrydb.org/random`);  
        res.render("random.ejs", {poem: poem.data[0]});
    }    
    catch(error){
        res.render("random.ejs");
    }
});