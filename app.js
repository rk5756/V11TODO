//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
 const _ = require("lodash");


const app = express();  

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb+srv://rv:sinha5756@cluster0.23w1oye.mongodb.net/todo1', { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('Connected to MongoDB'))
.catch(error => console.error('Error connecting to MongoDB:', error));

const itemSchema={
  name : String
}; 

const Item=mongoose.model("Item",itemSchema);

const item1=new Item({
 name : "welcome t0 your todolist"
});

const item2=new Item({
  name : "Hit the + button to aff a new item"
 });
 const item3=new Item({
  name : "<-- Hit this to delete an item"
 });

 
 const defaultitems=[item1,item2,item3];

  const listSchema={

    name:String,
    items:[itemSchema]
    
  };
    const List =mongoose.model("list",listSchema);

 
 app.get("/", function(req, res) {
   
   Item.find({})
   .then((item)=>{
     if(item.length===0){
       
       Item.insertMany(defaultitems)
      
      res.redirect("/");

    }else{
  res.render("list",{listTitle:"Today",newListItems:item})
     
   }
 })
 .catch((err)=>{
   console.error(err);
 });


});




 app.get("/:customListName",function(req,res){
  const customListName= _.capitalize(req.params.customListName);
  

  List.findOne({name: customListName})
  .then(foundlist => {
    if (!foundlist) {
      const list=new List({
        name:customListName,
        items: defaultitems
       });
       list.save();
       res.render("/" + customListName);
    } else {
      res.render("list",{listTitle:foundlist.name,newListItems:foundlist.items})
    }
  })
  .catch(err => {
    console.error(err);
  });


  
   
 });









app.post("/", function(req, res){

  const itemName = req.body.newItem;
   const listName = req.body.list;
   const item =new Item ({
     name :itemName
   });
    if(listName==="Today"){
      item.save();
      res.redirect("/")  ;
 
    }
     else{

      List.findOne({name:listName})
      .then(foundlist => {
      
        foundlist.items.push(item);
        foundlist.save();
         res.redirect("/"+listName);
      })
      .catch(err => {
        console.error(err);
      });
  
     }


});
//  console.log("seccuesss fully delteted");
  //      res.redirect("/");




 app.post("/delete",function(req,res){
  const checkeditemid=req.body.checkbox;
   const listName=req.body.listName;
    if(listName==="Today"){
      Item.findByIdAndRemove(checkeditemid)
      .then((deletedUser) => {
        console.log("seccuesss fully delteted");
             res.redirect("/");
      })
      .catch((error) => {
        console.log(error);
      });
    }
     else{
List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkeditemid}}})
.then(updatedUser => {
res.redirect("/" + listName);
  
})
.catch(err => {
  console.error(err);
});
     }
    });
 





app.get("/about", function(req, res){
  res.render("about");
});



let port = process.env.PORT;
if(port == null|| port==""){
  port=3000;
}

app.listen(port, function() {
  console.log("Server has started seccesfully");
});
