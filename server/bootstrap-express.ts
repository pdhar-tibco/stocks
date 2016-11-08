/// <reference path="../node_modules/@types/express/index.d.ts" />
/// <reference path="../node_modules/@types/core-js/index.d.ts" />
/// <reference path="../node_modules/@types/express-serve-static-core/index.d.ts" />
/// <reference path="../node_modules/@types/minimist/index.d.ts" />
/// <reference path="../node_modules/@types/node/index.d.ts" />

import * as express from "express";
import * as minimist from "minimist";
import * as path from "path";

let cors = require( "express-cors");

let yahooFinance = require("yahoo-finance");

const app = express();
let args = minimist(process.argv.slice(2), { default: { port: "8080" } });
let PORT = args["port"];
let DIST_DIR = path.join(__dirname, "..", "");
console.log("DIST_DIR:" + DIST_DIR);

app.use(cors({
    allowedOrigins: [
        "localhost:8000"
    ],
    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "PATCH",
      "OPTIONS"
    ],
    headers: [
      "Content-Type",
      "Authorization",
      "Content-Length",
      "X-Requested-With"
    ]
}));

// let allowCrossDomain = function(req, res, next) {
//     if ("OPTIONS" === req.method) {
//       res.header("Access-Control-Allow-Origin", "*");
//       res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");
//       res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Content-Length, X-Requested-With");
//       res.status(200).send("");
//     }
//     else {
//       next();
//     }
// };

// app.use(allowCrossDomain);
app.use("/", express.static(DIST_DIR + "/client"));
app.use("/lib", express.static(DIST_DIR + "/lib"));
app.use("/client", express.static(DIST_DIR + "/client"));

let router: express.IRouter<any> = express.Router();

// Endpoint to load snapshot data from yahoo finance
let snapShotHandler: express.RequestHandler
  = function (req: express.Request,
    res: express.Response,
    next: express.NextFunction): any {
    if (req.query.symbols) {
      let symbols = req.query.symbols.split(",");
      symbols.map(function (symbol) {
        return symbol.toUpperCase();
      });

      yahooFinance.snapshot({
        symbols: symbols
      }, function (err, snapshot) {
        if (err) {
          res.status(401).send(err);
        }

        res.status(200).send(snapshot);
      });
    } else {
      res.status(400).send({ message: "The request requires at least one symbol. Try adding \" ? symbols = appl\" to the request."});
    }
  };

router.get("/stocks/snapshot", snapShotHandler);

// Endpoint to load historical data from yahoo finance.
let historicalDataHandler: express.RequestHandler
  = function (req: express.Request,
    res: express.Response,
    next: express.NextFunction): any {
    let today = new Date();
    let yearAgo = new Date(today.getTime() - 1000 * 60 * 60 * 24 * 365);
    yahooFinance.historical({
      symbol: req.params.symbol,
      from: yearAgo.toString(),
      to: today.toString()
    }, function (err, quotes) {
      if (err) {
        res.status(500).send(err);
      }

      res.status(200).send(quotes);
    });
  };

let defaultHandler: express.RequestHandler =
  function (req: express.Request,
    res: express.Response,
    next: express.NextFunction): any {
    console.log("%s - %s %s", new Date().toISOString(), req.method, req.url);
    res.sendFile(DIST_DIR + "/client/index.html");
  };



router.get("*", defaultHandler);
// let optionsHandler: express.RequestHandler =
//   function (req: express.Request,
//     res: express.Response,
//     next: express.NextFunction): any {
//     console.log("%s - %s %s", new Date().toISOString(), req.method, req.url);
//   };
// router.options("*", optionsHandler);


app.use("/", router);



app.listen(PORT, function (): any {
  console.log("Server started at http://localhost:" + PORT);
});


