//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var lodash = require('lodash');
const mongoose = require('mongoose');


const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const contentArray = [homeStartingContent, aboutContent, contactContent];
var newPostArray = [];

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// use when db is on a cluster
/*mongoose.connect('mongodb+srv://admin:admin@devcluster.wj4qjt3.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})*/

mongoose.connect('mongodb://127.0.0.1:27017/blogApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

  const postSchema = new mongoose.Schema({
    title:{
      type: String,
      required:true
    },
    description: {
      type: String,
      required:true
    }
  });

  const Post = mongoose.model("Post", postSchema);

  function capitalizeFirstLetter(string) {
    const firstChar = string.charAt(0);
    const resto = string.slice(1);
    return firstChar.toUpperCase() + resto.toLowerCase();
}

app.get("/", (req, res) => {
  res.render('start');
});

app.get("/home", async (req, res) => {
  newPostArray = await Post.find();
  res.render('home', { contentList: contentArray, newPosts: newPostArray });
});

app.get("/posts/:title", async (req, res) => {

  const queryTitle = capitalizeFirstLetter(req.params.title);

  

  const foundedPost = await Post.findOne({title: queryTitle});


  if(foundedPost){
    res.render('post', {post:foundedPost});
  }

  else{
    res.write("<h1>Not found</h1>");
    res.write("<a href='/' >Go Back</a> ");
    res.send();
  }
  
  
    
      

  
});

app.get("/contact", (req, res) => {
  res.render('contact', { contentList: contentArray });
});

app.get("/about", (req, res) => {
  res.render('about', { contentList: contentArray });
});

app.get("/new", (req, res) => {
  res.render('compose');
});

app.post("/new", async (req, res) => {
  
  const newDescription = req.body.newDescription;
  const formattedTitle = capitalizeFirstLetter(req.body.newTitle);

  const newPost = new Post({title: formattedTitle, description: newDescription});
  await newPost.save();

  const redirectTo = "/posts/" + formattedTitle;
  res.redirect(redirectTo);
});



app.listen(3000, function () {
  console.log("Server started on port 3000");
});
