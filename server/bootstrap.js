'use strict';

var koa = require("koa");
var router = require("koa-router")();
var serve = require("koa-static-server");
var send = require("koa-send");
var path = require("path");
var yahooFinance = require("yahoo-finance");
var minimist = require("minimist");
var cors = require("koa-cors");
var qs = require("qs");
var Q = require("q");


var app = koa();
var args = minimist(process.argv.slice(2), { default: { port: "8080" } });
var PORT = args.port;
var DIST_DIR = path.join(__dirname, "..", "dist");

// router.get("/", function*(next) {
//     this.status = 200;
//     this.body = "OK";
// });




// Endpoint to load snapshot data from yahoo finance
router.get("/stocks/snapshot", function*(next) {
    let query = qs.parse(this.request.querystring); // anything beyond ? not including ?
    console.log(JSON.stringify(query));
    if (query && query.symbols) {
        var symbols = this.query.symbols.split(",");
        symbols.map(function(symbol) {
            return symbol.toUpperCase();
        });
        let context = this;
        yield yahooFinance.snapshot({
            symbols: symbols
        }, function(err, snapshot) {
            // console.log("Error:" + JSON.stringify(err));
            // console.log("Snapshot:" + JSON.stringify(snapshot));
            if (err) {
                context.throw("Error Message", 401);
            }
            context.status = 200;
            context.body = snapshot;

        });

    } else {
        this.status = 400;
        this.body = { message: "The request requires at least one symbol. Try adding ' ? symbols = appl ' to the request." };

    }
    yield next;
});

// Endpoint to load historical data from yahoo finance.
router.get("/stocks/historical/:symbol", function*(next) {
    var today = new Date();
    var yearAgo = new Date(today.getTime() - 1000 * 60 * 60 * 24 * 365);
    yahooFinance.historical({
        symbol: this.params.symbol,
        from: yearAgo.toString(),
        to: today.toString()
    }, function(err, quotes) {
        if (err) {
            this.status = 500;
            this.body = err

        }
        this.status = 200;
        this.body = quotes;
    });
});

router.get("/", DIST_DIR + "/client/index.html", function* next() {
    console.log("Came here");
});

// Send any other urls to the client app to load.


function* handleDefault(next) {
    console.log("%s - %s %s", new Date().toISOString(), this.req.method, this.req.url);
    // yield send(this, DIST_DIR + "/client/index.html");
    yield next;
}
app.use(router.routes())
    .use(router.allowedMethods())
    .use(handleDefault)
    .use(serve({ rootDir: DIST_DIR + "/client" }))
    .use(serve({ rootDir: DIST_DIR + "/lib", rootPath: "/lib" }))
    .use(serve({ rootDir: DIST_DIR + "/client", rootPath: "/client" }));
//.use(cors);


var server = app.listen(PORT, function() {
    console.log("Server started at http://localhost:" + PORT);
});