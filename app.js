const bodyParser = require("body-parser");
const { render } = require("ejs");
const express = require("express");
const app = express();
const date = require(__dirname+"/date.js")
const day = date.getDate();

app.set("view engine", "ejs"); //para o EJS Funcionar

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const listItem = [];
const workList = [];

app.get("/", function(req, res){
    
    res.render("list", {listTitle: "List", dateAtual: day, itens: listItem});
})

app.post("/", function(req, res){

    const item = req.body.newItem

    if(req.body.list === "Work"){
        workList.push(item)
        res.redirect("/work")
    }else{
        listItem.push(item);
        console.log(listItem);
        res.redirect("/")
        console.log(req.body.list);
    }
    console.log(req.body.remove)
   
});

app.get("/work", function(req, res){
    res.render("list", {listTitle: "Work", dateAtual: day, itens: workList});
});

app.get("/about", function(req, res){
    res.render("about");
})

app.post("/remove", function(req, res){
    listRemove = JSON.parse(req.body.remove);
    let itemRemove = parseInt(listRemove.number);

    if(listRemove.title === "Work"){     
        workList.splice(itemRemove, 1);
        res.redirect("/work")
    }else{
        listItem.splice(itemRemove, 1);
        res.redirect("/")
    }
    console.log(itemRemove);
})

app.listen(3000, function(){
    console.log("app ruming PORT 3000");
});
