const passport = require("passport");
const express = require("express");
const flash = require("connect-flash");
const session = require("express-session");
const router = express.Router();
var db = require("../models");
const bcrypt = require("bcrypt");

// Flash
router.use(
  session({
    cookie: { maxAge: 60000 },
    secret: "wootwoot"
  })
);
router.use(flash());

// Passport
require("../config/passport")(passport);
router.use(passport.initialize());
router.use(passport.session());

router.get("/", (req, res) => {
  if (req.user) {
    res.render("index", {
      user: req.user
    });
  } else {
    res.redirect("/login");
  }
});

router.get("/login", (req, res) => {
  res.render("login", { message: req.flash("error") });
});

///////////////////////////////////////////////////////////////////////

router.get("/guncontrol", (req, res) => {
  if (req.user) {
    res.render("guncontrol", {
      user: req.user
    });
  } else {
    res.redirect("/login");
  }
});

router.get("/vaccines", (req, res) => {
  if (req.user) {
    res.render("vaccines", {
      user: req.user
    });
  } else {
    res.redirect("/login");
  }
});

router.get("/flatearth", (req, res) => {
  if (req.user) {
    res.render("flatearth", {
      user: req.user
    });
  } else {
    res.redirect("/login");
  }
});

router.get("/account", (req, res) => {
  if (req.user) {
    res.render("account", {
      user: req.user
    });
  } else {
    res.redirect("/login");
  }
});

router.get("/userprefs", (req, res) => {
  if (req.user) {
    res.render("userprefs", {
      user: req.user
    });
  } else {
    res.redirect("/login");
  }
});

router.post("/api/posts", (req, res) => {
  console.log("sending post to db");
  db.Posts.create({
    ChatRoom: req.body.ChatRoom,
    Author: req.user.email,
    Message: req.body.Message,
    Username: req.body.Username
  }).then(dbPost => {
    res.json(dbPost);
  });
});

router.put("/api/updateusernames", (req, res) => {
  db.user
    .update(
      {
        username: req.body.username
      },
      {
        where: {
          id: req.user.dataValues.id
        }
      }
    )
    .then(dbUpdate => {
      res.json(dbUpdate);
    });
});

router.put("/api/updateemails", (req, res) => {
  db.user
    .update(
      {
        email: req.body.email
      },
      {
        where: {
          id: req.user.dataValues.id
        }
      }
    )
    .then(dbUpdate => {
      res.json(dbUpdate);
    });
});

router.put("/api/updatepasswords", (req, res) => {
  let saltedPass = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8));
  db.user
    .update(
      {
        password: saltedPass
      },
      {
        where: {
          id: req.user.dataValues.id
        }
      }
    )
    .then(dbUpdate => {
      res.json(dbUpdate);
    });
});

///////////////////////////////////////////////////////////////////////

router.post(
  "/login",
  passport.authenticate("local-login", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
  })
);

router.get("/signup", (req, res) => {
  res.render("signup", { message: req.flash("error") });
});

router.post(
  "/signup",
  passport.authenticate("local-signup", {
    successRedirect: "/",
    failureRedirect: "/signup",
    failureFlash: true
  })
);

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get("*", (req, res) => {
  res.render("404");
});

module.exports = router;
