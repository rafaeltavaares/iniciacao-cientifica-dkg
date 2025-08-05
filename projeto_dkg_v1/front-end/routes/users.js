const express = require('express')
const route = express.Router();

route.get("/", (req,res)=>{
    res.send("Users side")    
})

route.get("/new",(req,res)=>{
    res.send("new users")

})

route
    .route("/:id")
    .get((req,res)=>{
        console.log(req.user)
        res.send(`get user with id ${req.params.id}`)
    })
    .put((req,res)=>{  
        res.send(`update user with id ${req.params.id}`)
    })
    .delete((req,res)=>{  
        res.send(`delete user with id ${req.params.id}`)
    })  


route.post("/", (req,res)=>{
    res.send("criar usuario")
})
const users = [{name:"rafael"},{name:"stn"}]
route.param("id", (req,res,next,id) =>{
    req.user = users[id];
    next()
})




module.exports = route;