function checkLogin(req,res,next){
 if (userDB[urlvar]['email'] === (req.body.email)){
      uservar = urlvar;
      let password = userDB[urlvar]['password'];
      let hashed_password = bcrypt.hashSync(password, 10);
      if(bcrypt.compareSync(req.body.password, hashed_password)){
        res.status(401).render('401');
        return;
      }
   //  text added through peek
 }
 next();
 };

// functions

// Gets

// Puts

// deletes



app.post('/login', checkLogin, (req, res) => { // Check to see if there is a user with the body email
  //const user = userDB[userid][req.body.email]; // Check to see if that user has the body password
  let uservar;
  for (urlvar in userDB){
    console.log('1');
  }
    if (userDB[urlvar]['email'] === (req.body.email)){
      uservar = urlvar;
      let password = userDB[urlvar]['password'];
      let hashed_password = bcrypt.hashSync(password, 10);
      if(bcrypt.compareSync(req.body.password, hashed_password)){ // If so, login, set email cookie, and redirect//userDB[uservar].password
        req.session.userid = userDB[uservar].id
        console.log('true');
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