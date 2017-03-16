var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080; // default port 8080

app.set("view engine", "ejs");

const bodyParser = require("body-parser");    // 
app.use(bodyParser.urlencoded({extended: true})); 

var urlDatabase = {                           //DB
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/urls", (req, res) => {    //INDEX
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {    //NEW
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {    //SHOW  //ID
  let templateVars = { shortURL: req.params.id };
  res.render("urls_show", templateVars);
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
//------------------------------------------COOKIES
app.post('/login', (req, res) => {
  res.cookie('username', req.body.username);
  res.redirect('/urls');
});
