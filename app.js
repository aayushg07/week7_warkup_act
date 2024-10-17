//ITE5315--Professor: Shahdad
const express = require("express");
// const bodyParser = require('body-parser')
const { check, validationResult } = require("express-validator");

const app = express();
const port = process.env.PORT | 5001;

// Set Templating Enginge
const handlebars = require("express-handlebars");
app.engine(
  "hbs",
  handlebars.engine({
    extname: ".hbs",
    helpers: {
      calculation: function (num) {
        return num + 10;
      },
      strong: function (options) {
        return "<strong>" + options.fn(this) + "</strong>";
      },
    },
    partialsDir: __dirname + '/views/partials/' // Register the partials directory
  })
);
app.set("view engine", "hbs");
app.set('views',__dirname,'/views');
app.use(express.static(__dirname+"/public"));
app.set("view engine", "hbs");

const urlencodedParser = express.urlencoded({ extended: false });


//new route
app.get("/calc", (req, res) => {
  res.render("calculate", {
    layout: 'main', // do not use the default Layout (main.hbs)
  });
});

// Navigation
app.get("", (req, res) => {
  res.render("index", {
    layout: 'main', // do not use the default Layout (main.hbs)
  });
});

app.get("/register", (req, res) => {
  res.render("register", {
    layout: 'main', // do not use the default Layout (main.hbs) also using the main layout that includes the header {{>welcome}}
  });
});

app.post(
  "/register",
  urlencodedParser,
  [
    check("username", "This username must me 3+ characters long")
      .exists()
      .isLength({ min: 3 }),
    check("email", "Email is not valid").isEmail().normalizeEmail(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // return res.status(422).jsonp(errors.array())

      const alert = errors.array();
      res.render("register", {
        errs: alert,
        layout: false, // do not use the default Layout (main.hbs)
      });
    } 
    else res.send("Hello");
  }
);

app.listen(port, () => console.info(`App listening on port: ${port}`));
