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
  secret: process.env.SESSION_SECRET || "bunny",
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
  if (req.session['userid']){
    let userURL = {};
    for(var shortURL in urlDatabase) {
      if (req.session['userid'] === urlDatabase[shortURL].userid) {
        userURL[shortURL] = urlDatabase[shortURL];
      }
    };
    let templateVars = { urls: userURL, userDB: userDB, "req": req, userid: req.session.userid};

    res.render("urls_index", templateVars);

  } else {
    res.status(401).send('Not logged in! <a href="/login">Login</a>');
  }
});

app.get("/urls/new", (req, res) => {    //NEW
  if (req.session['userid']) {
    let templateVars = { urls: urlDatabase, userDB: userDB, "req": req, userid: req.session.userid};
    res.render("urls_new", templateVars);
  } else {
    res.status(401).send('Not logged in! <a href="/login">Login</a>');
  }
});

app.get("/urls/:id", (req, res) => {    //SHOW  //ID
  let templateVars = { shortURL: req.params.id, userDB: userDB,longURL: urlDatabase[req.params.id].url, userid:req.session['userid'] };
  if (req.session['userid']) {
    res.render("urls_show", templateVars);
  } else {
    res.redirect("/login");
  }
});
                                      //LOGIN
app.post('/login', (req, res) => { // Check to see if there is a user with the body email
  //const user = userDB[userid][req.body.email]; // Check to see if that user has the body password
  let flag = false;
  for (username in userDB){
    if (userDB[username]['email'] === req.body.email){
      flag = true;
      break;
    }
  }
  if (flag){
    let password = userDB[username]['password'];
    let hashed_password = bcrypt.hashSync(password, 10);
    if (bcrypt.compareSync(password, hashed_password)){ // If so, login, set email cookie, and redirect//userDB[uservar].password
      req.session.userid = userDB[username].id

      res.redirect('/urls');
    } else {
      res.status(401).render('401');
    }
  } else {
      res.status(401).render('401');
  }

});

app.get("/login", (req, res) => {
  if (req.session['userid']) {
    res.redirect("/");
  } else {
    res.render("login");
  }
});

app.get("/logout", (req, res) => {
  res.redirect("/urls");
});

app.get("/register", (req, res) => {
  if (req.session['userid']) {
    res.redirect("/");
  }
  else {
    res.render("register");
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.post("/urls", (req, res) => {
  if (req.session['userid']) {
   let longURL = req.body.longURL;
   let shortURL = generateRandomString();
   urlDatabase[shortURL] = {
     url: longURL,
     userid: req.session['userid']
   }; //makes object to put into DB
   res.redirect('/urls/' );         // Respond with 'Ok' (we will replace this)
  }
   else {
    res.status(401).send('Not logged in! <a href="/login">Login</a>');
   }
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
  if (req.session['userid']){
    urlDatabase[req.params.id].url = req.body.longURL;
    res.redirect('/urls');
  }else{
    res.redirect("/login");
  }
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
  delete req.session.userid
  res.redirect('/');
});
//----------------------------------------- REGISTER
app.post("/register", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  let flag;
  let hashed_password = bcrypt.hashSync(password, 10);
  let id = generateRandomString();
  if (password.length <= 0 && email.length <= 0){
      res.status(400).send('enter valid email/password');
  } else {
    for(user in userDB) {
      if (email === userDB[user]['email']){
        res.status(400).send('email in use');
        flag = true;
      }
      flag = false;
    }
    if(!flag)
      userDB[id] = {
      id: generateRandomString(),
      email: req.body.email,
      password: hashed_password
    }
    req.session['userid'];
    res.redirect('/');

  }
});



