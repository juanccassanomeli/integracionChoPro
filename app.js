var express = require("express");
var exphbs = require("express-handlebars");
var port = process.env.PORT || 3000;

var app = express();

var mercadopago = require("mercadopago");
mercadopago.configurations.setAccessToken(
  "APP_USR-7198724548949524-111718-2b297f8c7eb619336bf887c5bb4b33e9-1021172797"
);

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

app.use(express.static("assets"));

app.use("/assets", express.static(__dirname + "/assets"));

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/detail", function (req, res) {
  res.render("detail", req.query);
});

app.get("/payform", function (req, res) {
  res.render("payform.handlebars", req.query);
});

app.get("/process_payment", function (req, res) {
  var payment_data = {
    transaction_amount: Number(req.body.transactionAmount),
    token: req.body.token,
    description: req.body.description,
    installments: Number(req.body.installments),
    payment_method_id: req.body.paymentMethodId,
    issuer_id: req.body.issuer,
    payer: {
      email: req.body.email,
      identification: {
        type: req.body.docType,
        number: req.body.docNumber,
      },
    },
    notification_url: "https://engipm4kflp8a.x.pipedream.net",
  };

  mercadopago.payment
    .save(payment_data)
    .then(function (response) {
      res.status(response.status).json({
        status: response.body.status,
        status_detail: response.body.status_detail,
        id: response.body.id,
      });
    })
    .catch(function (error) {
      res.status(response.status).send(error);
    });
});

app.listen(port);
