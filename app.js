var express = require("express");
var exphbs = require("express-handlebars");
var port = process.env.PORT || 3000;

var app = express();

const mercadopago = require("mercadopago");
mercadopago.configure({
  access_token: "APP_USR-8709825494258279-092911-227a84b3ec8d8b30fff364888abeb67a-1160706432",
  integrator_id: "dev_24c65fb163bf11ea96500242ac130004",
});

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

app.use(express.static("assets"));

app.use("/assets", express.static(__dirname + "/assets"));

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/detail", function (req, res) {

  let preference = {
    items: [
      {
        id: "1234",
        title: req.query.title,
        description: req.query.title,
        picture_url: req.query.img,
        quantity: 1,
        unit_price: Number(req.query.price),
      },
    ],
    payer: {
      name: "Lalo",
      surname: "Landa",
      email: "test_user_36961754@testuser.com",
      phone: {
        area_code: "11",
        number: 22223333,
      },
      identification: {},
      address: {
        street_name: "Falsa",
        street_number: 123,
        zip_code: "1638",
      },
    },
    payment_methods: {
      excluded_payment_methods: [
        {
          id: "visa",
        },
      ],
      installments: 6,
    },
    back_urls: {
      success: req.get("host") + "/success",
      failure: req.get("host") + "/failure",
      pending: req.get("host") + "/pending",
    },
    auto_return: "approved",
    notification_url: "https://envynpazrbxy.x.pipedream.net",
    external_reference: "juanccassano@gmail.com",
  };

  mercadopago.preferences
    .create(preference)
    .then(function (response) {
      req.query.checkoutId = response.body.id;
      req.query.init_point = response.body.init_point;
      res.render("detail", req.query);
    })
    .catch(function (error) {
      console.log(error);
    });
});

app.get("/failure", function (req, res) {
  res.render("failure", req.query);
});

app.get("/success", function (req, res) {
  res.render("success", req.query);
});

app.get("/pending", function (req, res) {
  res.render("pending", req.query);
});

app.listen(port);
