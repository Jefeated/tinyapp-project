var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080; // default port 8080

app.set("view engine", "ejs");

const bodyParser = require("body-parser");   
app.use(bodyParser.urlencoded({extended: true})); 

var cookieParser = require('cookie-parser');
app.use(cookieParser());

var urlDatabase = {                           //DB
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const userDB = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}

app.get("/", (req, res) => {    //ROOT  
  res.redirect("/urls");
});

app.get("/urls", (req, res) => {    //INDEX
  let templateVars = { urls: urlDatabase, userDB: req.cookies['userid']};
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {    //NEW
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {    //SHOW  //ID
  let templateVars = { shortURL: req.params.id, userDB: req.cookies['userid'] };
  res.render("urls_show",templateVars);
});

app.post('/login', (req, res) => { // Check to see if there is a user with the body email
  const user = userDB[req.body.email]; // Check to see if that user has the body password
  if(user && user.password === req.body.password){ // If so, login, set email cookie, and redirect
    res.cookie ('userid', id);
    res.redirect('/');
  } else {
    res.status(403).render('403');
  }
});

app.get("/login", (req, res) => {   
  res.render("login");
});

app.get("/logout", (req, res) => {    
  res.redirect("/urls");
});

app.get("/register", (req, res) => {    //REGISTER
  res.render("register");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.post("/urls", (req, res) => {
  console.log(req.body); // debug statement to see POST parameters
  let longURL = req.body.longURL;   
  let shortURL = generateRandomString();  
  urlDatabase[shortURL] = longURL; //makes object to put into DB
  res.send("Ok");         // Respond with 'Ok' (we will replace this)
});

function generateRandomString() {
var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 6; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

app.get("/u/:shortURL", (req, res) => {   //REDIRECT
let longURL = urlDatabase[shortURL];    
res.redirect(longURL);
});

app.post('/urls/:id/delete', (req, res) =>{   //DELETE
  delete urlDatabase[req.params.id];    //goes into DB and grabs shortURL
  res.redirect('/urls');
});

app.post('/urls/:id/update', (req, res) => {       //UPDATE
  urlDatabase[req.params.id] = req.body.longURL;
  res.redirect('/urls');
});
//------------------------------------------COOKIES/LOGIN

app.post('/login', (req, res) => {
  if (email !== userDB[email]){
    res.status(403).render('403');
  }
  else if (password !== userDB[password]){
    res.status(403).render('403');
  }
  else {
  res.cookie (userDB[req.cookies]['userid']);
  res.redirect('/');
  };
});

app.post('/logout', (req, res) => {
  res.clearCookie(userDB['id']); 
  res.redirect('/');
});
//----------------------------------------- REGISTER
app.post("/register", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;   
  let id = generateRandomString();  
  if (password.length < 0 && email.length < 0){
    res.status(400).render('400');
  }
  else if (email === userDB[email]){
    res.status(400).render('400');
    } else {
    userDB[id] = {
    id: generateRandomString(), 
    email: req.body.email, 
    password: req.body.password
  };
  res.cookie ('userid', id);
}
res.redirect('/');
});