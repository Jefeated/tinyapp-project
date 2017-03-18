var express = require("express");
var app = express();
var PORT = process.env.PORT || 3000;
const bcrypt = require('bcrypt');
const cookieSession = require('cookie-session');

app.set("view engine", "ejs");

const bodyParser = require("body-parser");   
app.use(bodyParser.urlencoded({extended: true})); 

app.use(cookieSession({
  name: 'session',
  secret: process.env.SESSION_SECRET || "fluffybunny",
  maxAge: 24 * 60 * 60 * 1000 
}));

var urlDatabase = {                           //DB
  "b2xVn2": {
    url: "http://www.lighthouselabs.ca",
    userid: "userRandomID"
  },
  "9sm5xK": {
    url: "http://www.google.com",
    userid: "user2RandomID"
  }
};

const userDB = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "a"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "b"
  }
}

app.get("/", (req, res) => {    //ROOT  
  if (req.session['userid']) {
  res.redirect("/urls");
  }else{
  res.redirect("/login");  
  } 
});

app.get("/urls", (req, res) => {    //INDEX
//   let userdata = {};
//   for (urlvar in urlDatabase){
//     if (urlDatabase[urlvar]['userid'] === req.session['userid']){
//       userdata[urlvar] = urlDatabase[urlvar];
//     }
//     else{
//     res.redirect("/login"); 
//     }
// }
//   let templateVars = { urls: userdata, userDB: req.session['userid']};
//   res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {    //NEW
  if (req.session['userid']) {
  res.render("urls_new");
}
  else {
  res.status(401).render('401');
}
});

app.get("/urls/:id", (req, res) => {    //SHOW  //ID
  let templateVars = { shortURL: req.params.id, userDB: req.session['userid'],longURL : urlDatabase[req.params.id].url};
    if (req.session['userid']) {
  res.render("urls_show",templateVars);
}
  else {
  res.redirect("/login");
  }
});
                                      //LOGIN
app.post('/login', (req, res) => { // Check to see if there is a user with the body email
  //const user = userDB[userid][req.body.email]; // Check to see if that user has the body password
  let uservar;
  for (urlvar in userDB){
    if (userDB[urlvar]['email'] === (req.body.email)){
      uservar = urlvar;
      let password = userDB[urlvar]['password'];
      let hashed_password = bcrypt.hashSync(password, 10);
      if(bcrypt.compareSync(req.body.password, hashed_password)){ // If so, login, set email cookie, and redirect//userDB[uservar].password
        req.session.userid = userDB[uservar].id
        res.redirect('/urls');
      }
      else {
        res.status(401).render('401');
      }
    } else {
      res.status(401).render('401');
    }
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
  // console.log(req.body); // debug statement to see POST parameters
  // let longURL = req.body.longURL;   
  // let shortURL = generateRandomString();  
  // urlDatabase[shortURL] = longURL; //makes object to put into DB
  // res.redirect('/');         // Respond with 'Ok' (we will replace this)
});

function generateRandomString() {
var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 6; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

app.get("/u/:shortURL", (req, res) => {   //REDIRECT
let longURL = urlDatabase[shortURL][url];    
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

// app.post('/login', (req, res) => {
//   if (email !== userDB['email']){
//     res.status(403).render('403');
//   }
//   else if (password !== userDB['password']){
//     res.status(403).render('403');
//   }
//   else {
//   res.cookie (userDB[req.cookies]['userid']);
//   res.redirect('/');
//   };
// });

app.post('/logout', (req, res) => {
  delete req.session.userDB['id']; 
  res.redirect('/');
});
//----------------------------------------- REGISTER
app.post("/register", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  let hashed_password = bcrypt.hashSync(password, 10);
  let id = generateRandomString();  
  if (password.length <= 0 && email.length <= 0){
    res.status(400).render('400');
  }
  else if (email === userDB[email]){
    res.status(400).render('400');
  } else {
    userDB[id] = {
    id: generateRandomString(), 
    email: req.body.email, 
    password: hashed_password
  };
  res.session ('userid', id);
}
res.redirect('/');
});