const bodyParser = require("body-parser");
const { render } = require("ejs");
const express = require("express");
const app = express();
const date = require(__dirname+"/date.js")
const mongoose = require("mongoose")

mongoose.set("strictQuery", false);

const day = date.getDate();
let list = []
let statusAdd = "false";

app.set("view engine", "ejs"); //para o EJS Funcionar

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://marcusvscosta:Le2fRkOPErFcchyP@cluster0.wcibe94.mongodb.net", { useNewUrlParser: true})
let listItem = []

const itemSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            require: [true, "Please complete the item"]
        }
    }
)

const Item = mongoose.model("Item", itemSchema)

function newItem(item){
    const newItem = new Item({
        name: item
    })

    newItem.save();
}


app.get("/", function(req, res){
    listItem = []
    Item.find(function(err, rItens){
        if(err){
            console.log(err);
        }else{
            rItens.forEach(function(rItem){
                listItem.push(rItem.name)
            })
            list = listItem;
            console.log(listItem);
            res.render("list", {listTitle: "List", dateAtual: day, itens: listItem, status: statusAdd});
            statusAdd = "false";
        }
    })
})

app.post("/", function(req, res){

    const item = req.body.newItem

    if(item === '' || item === null){
        //workList.push(item)
        statusAdd = "true";
        res.redirect("/")
    }else{
        //listItem.push(item);
        newItem(item);
        console.log(listItem);
        res.redirect("/")
        console.log(req.body.list);
        statusAdd = "false";

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
    const number = req.body.remove;

    Item.deleteOne({name: list[number]}, function(err){
        if(err){
            console.log(err);
        }else{
        console.log("Sucesse delete Item");
        }
    });

    console.log(list[number]);
  

     
    res.redirect("/")
})

app.listen(3000, function(){
    console.log("app ruming PORT 3000");
});
