
const express =require("express")
const app = express();
const port = 3000;

app.get('/' , (req , res)=>{
    res.send(index.html);
});

app.listen(port , ()=>{
    console.log(`server running on port ${port}`);
})
