//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");
const app = express();


const homeStartingContent = "Selamat Datang di Marsiajar.id, temukan pengalaman belajar yang menyenangkan. Disini kamu dapat menemukan materi pelajaran yang up to date, jadi tunggu apalagi? MARI BELAJAR.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));

mongoose.connect(process.env.MONGO_URL,{
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true
});

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

const posts = [];


app.get("/", function(req, res){

  Post.find({}, function(err, docs){
    if(!err){
      res.render("home", {
        startingContent: homeStartingContent,
        posts: docs
      });
    }else{
      console.log("Something wrong.");
    }
  });


});

app.get("/about", function(req, res){
  res.render("about", {
    aboutContent: aboutContent
  });
});

app.get("/contact", function(req, res){
  res.render("contact", {
    contactContent: contactContent
  });
});

app.get("/post/:customContentId", function(req, res){
  const requestPostId = req.params.customContentId;

  Post.findOne({_id: requestPostId}, function(err, docs){
    if(!err){
      res.render("post", {
        title: docs.title,
        content: docs.content
      });
    }else{
      console.log("Something wrong when finding content.");
    }
  });
});


app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
    const post = new Post({
      title: req.body.postTitle,
      content: req.body.postBody
    });

    post.save(function(err){
      if(!err){
        res.redirect("/");
      }else{
        console.log("Something wrong when create a post.");
      }
    });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function(){
  console.log("Server is running in port 3000");
});
