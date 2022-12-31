require('dotenv/config');
const bodyParser = require("body-parser");
const { render } = require("ejs");
const express = require("express");
const app = express();
const mongoose = require("mongoose")
const _ = require('lodash')


//MgvAuaeZmUbqqOBY

mongoose.set("strictQuery", false);

let statusAdd = "false";

app.set("view engine", "ejs"); //para o EJS Funcionar
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://" + process.env.USER_NAME + ":" + process.env.PASSWORD + "@cluster0.wcibe94.mongodb.net/todolistDB", { useNewUrlParser: true})

const itemSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            require: [true, "Please complete the item"]
        }
    }
)

const Item = mongoose.model("Item", itemSchema)

const listSchema = new mongoose.Schema(
    {
        name:String,
        items: [itemSchema]
    }
)

const List = mongoose.model("List", listSchema)

const item1 = new Item({
    name: "Exemplo Item"
})

const defultItems = [item1]


app.get("/", function(req, res){
    Item.find(function(err, rItens){
        if(err){
            console.log(err);
        }else{
           res.render("list", {listTitle: "Today", itens: rItens, status: statusAdd});
           statusAdd = "false";
        }
    })
})

app.post("/", function(req, res){

    const item = req.body.newItem
    const nameList = req.body.list

    if(item === '' || item === null){
        //workList.push(item)
        if(nameList === "Today"){
            statusAdd = "true";
            res.redirect("/")
        }else{
            statusAdd = "true";
            res.redirect("/" + nameList)
        }   
    }else{
        //listItem.push(item);
        const newItem = new Item({
            name: item
        })
        
        if(nameList === "Today"){
            newItem.save();
            res.redirect("/")
        }else{
            List.findOne({name: nameList}, function(err, results){
                results.items.push(newItem);
                results.save();
                res.redirect("/" + nameList);
            })
        }
        statusAdd = "false";
    }
   
});

app.get('/:customListName', function(req, res) {
    const customListName = _.capitalize(req.params.customListName);

    if(customListName === "Favicon.ico"){

    }else{
         List.findOne({name: customListName}, function(err, results){

            if(!err){
                if(!results){
                    //creat new list
                    const list = new List({
                        name: customListName,
                        items: defultItems
                    })
                    list.save();
                    console.log("Não Existe a lista");
                    res.redirect("/" + customListName)
                }else{
                    console.log("A lista existe");
                    res.render("list", {listTitle: customListName, itens: results.items, status: statusAdd});
                    statusAdd = "false";
                }
            }
            //console.log(results.items);
        })
    }   
});

app.get("/about", function(req, res){
    res.render("about");
})

app.post("/remove", function(req, res){
    const idRemove = req.body.remove;
    const titleName = req.body.titleName;

    if(titleName === "Today"){
        Item.deleteOne({_id: idRemove}, function(err){
            if(err){
                console.log(err);
            }else{
            console.log("Sucesse delete Item");
            }
        });    
        res.redirect("/")
    }else{
        List.findOneAndUpdate({name: titleName}, {$pull: {items:{_id: idRemove}}}, function(err){
            if(!err){
                res.redirect("/" + titleName)
            }
        })

    }
  
})

app.listen(3000, function(){
    console.log("app ruming PORT 3000");
});
