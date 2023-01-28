//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var lodash = require('lodash');

var admin = require("firebase-admin");

var passwords = require("./cert.json");

admin.initializeApp({
  credential: admin.credential.cert(passwords)
});

const db = admin.firestore();

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const contentArray = [homeStartingContent, aboutContent, contactContent];
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let newPostArray = [];

let postsInDbRef = db.collection('posts');
  let postsInDb = postsInDbRef.get().then((documents) => {

    documents.forEach(doc => {
      let newPost = doc.data();
      newPostArray.push(newPost);
    });
  });


app.get("/", (req, res) => {
  const postsInDbRef = db.collection('posts');
  const postsInDb = postsInDbRef.get().then((documents) => {
    newPostArray = [];
    documents.forEach(doc => {
      const newPost = doc.data();
      newPostArray.push(newPost);
    });
  });
  res.render('home', { contentList: contentArray, newPosts: newPostArray });
});

app.get("/posts/:parameters", (req, res) => {

  var queryTitle = req.params.parameters;

  newPostArray.forEach(post => {

    var postTitle = post.title;

    //formatting the text
    queryTitle = lodash.lowerCase(queryTitle);
    postTitle = lodash.lowerCase(postTitle);

    if (postTitle === queryTitle) {

      res.render('post', { post: post });
    }
    else {
      res.write("<h1>Not found</h1>");
      res.write("<a href='/' >Go Back</a> ");
      res.send();
    }
  });
});

app.get("/contact", (req, res) => {
  res.render('contact', { contentList: contentArray });
});

app.get("/about", (req, res) => {
  res.render('about', { contentList: contentArray });
});

app.get("/compose", (req, res) => {
  res.render('compose');
});

app.post("/compose", (req, res) => {
  const composeTitle = req.body.composeTitle;
  const composeText = req.body.composeText;
  const formattedTitle = lodash.lowerCase(composeTitle);

  const newPostRef = db.collection("posts").doc();
  const newPost = {
    id: newPostRef.id,
    title: composeTitle,
    text: composeText,
    formattedTitle: formattedTitle
  };
  newPostRef.set(newPost);

  // Create a reference to the cities collection
  const postsRef = db.collection('posts');

  // Create a query against the collection
  const queryRef = postsRef.where('id', '==', newPostRef.id).get().then((documents)=>{
    documents.forEach(doc => {
      newDocument = doc.data();
      newPostArray.push(newDocument);
      res.redirect("/");
    });
  });

  

  
});


app.listen(3000, function () {
  console.log("Server started on port 3000");
});
