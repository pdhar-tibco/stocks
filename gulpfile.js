"use strict";

var changed = require("gulp-changed");
var childProcess = require("child_process");
var del = require("del");
var gulp = require("gulp");
var runSequence = require("run-sequence");
var sourcemaps = require("gulp-sourcemaps");
var concat = require("gulp-concat");
var ts = require("gulp-typescript");
var minimist = require("minimist");
var install = require("gulp-install");
var tslint = require("gulp-tslint");

var packageJson = require("./package.json");

var spawn = childProcess.spawn;
var server;

var PATHS = {
    libs: [
        "node_modules/@angular/common/bundles/**",
        "node_modules/@angular/compiler/bundles/**",
        "node_modules/@angular/forms/bundles/**",
        "node_modules/@angular/router/bundles/**",
        "node_modules/@angular/core/bundles/**",
        "node_modules/@angular/platform-browser/bundles/**",
        "node_modules/@angular/platform-browser-dynamic/bundles/**",
        "node_modules/@angular/http/bundles/**",
        "node_modules/systemjs/dist/**",
        "node_modules/core-js/client/**",
        "node_modules/zone.js/dist/**",
        "node_modules/reflect-metadata/**",
        "node_modules/es6-shim/**",
        "node_modules/angular2-in-memory-web-api/**",
        "node_modules/rxjs/**"
    ],
    client: {
        ts: ["client/**/*.ts"],
        html: "client/**/*.html",
        css: "client/**/*.css",
        img: "client/**/*.{svg,jpg,png,ico}",
        config: "client/**/systemjs.config.js"

    },
    server: {
        ts: ["server/**/*.ts"],
        js: ["server/**/*.js"]
    },
    dist: "dist",
    distClient: "dist/client",
    distServer: "dist/server",
    distLib: "dist/lib",
    tslint: "tslint.json",
    port: 8080
};

var tsProject = ts.createProject("tsconfig.json");
var tsServerProject = ts.createProject("server/tsconfig.json");

gulp.task("build", function(callback) {
    runSequence(
        "build-clean", ["tslint","build-libs", "build-ts-client", "build-html", "build-css", "build-img", "build-ts-server","build-config"], callback);
});

gulp.task("build-clean", function(callback) {
    return del([PATHS.dist], callback)
});

gulp.task("tslint-client", function(callback) {
    return gulp.src(PATHS.client.ts)
        .pipe(tslint({
            formatter: "verbose",
            configuration: PATHS.tslint
        }))
        .pipe(tslint.report());
});

gulp.task("tslint-server", function(callback) {
    return gulp.src(PATHS.server.ts)
        .pipe(tslint({
            formatter: "verbose",
            configuration: PATHS.tslint
        }))
        .pipe(tslint.report());
});


gulp.task("build-ts-client", function(callback) {
    return gulp.src(PATHS.client.ts)
        .pipe(changed(PATHS.distClient, { extension: ".js" }))
        .pipe(sourcemaps.init())
        .pipe(ts(tsProject))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest(PATHS.distClient));
});

gulp.task("tslint", ["tslint-client", "tslint-server"]);

gulp.task("build-config", function(callback) {
    return gulp.src(PATHS.client.config)
        .pipe(changed(PATHS.distClient, { extension: ".js" }))
        .pipe(gulp.dest(PATHS.distClient));
});

gulp.task("build-ts-server", function(callback) {
    return gulp.src(PATHS.server.ts)
        .pipe(changed(PATHS.distServer, { extension: ".js" }))
        .pipe(sourcemaps.init())
        .pipe(ts(tsServerProject))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest(PATHS.distServer));
});



gulp.task("build-html", function() {
    return gulp
        .src(PATHS.client.html)
        .pipe(changed(PATHS.distClient))
        .pipe(gulp.dest(PATHS.distClient));
});

gulp.task("build-css", function() {
    return gulp
        .src(PATHS.client.css)
        .pipe(changed(PATHS.distClient + "/css", {
            extension: ".css"
        }))
        .pipe(sourcemaps.init())
        .pipe(concat("app.css"))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest(PATHS.distClient + "/css"));
});

gulp.task("build-img", function() {
    return gulp
        .src(PATHS.client.img)
        .pipe(changed(PATHS.distClient))
        .pipe(gulp.dest(PATHS.distClient));
});

gulp.task("build-libs", function() {
    return gulp
        .src(PATHS.libs, { base: "node_modules/" })
        .pipe(changed(PATHS.distLib))
        .pipe(gulp.dest(PATHS.distLib));
})

gulp.task("npm-install", function(callback) {
    gulp.src("./package.json")
        .pipe(gulp.dest("./"))
        .pipe(install())
});



gulp.task("server.restart", function(callback) {
    var started = false;
    if (server) {
        server.kill();
    }
    var args = minimist(process.argv.slice(2), { default: { port: "8080" } });
    server = spawn("node", [packageJson.main, "--port", args.port]);
    server.stdout.on("data", function(data) {
        console.log(data.toString());
        if (started === false) {
            started = true;
            callback();
        }
    });
    server.stderr.on("data", function(data) {
        console.error(data.toString());
    });
});

gulp.task("go", ["build", "server.restart"], function() {
    gulp.watch(PATHS.client.ts, ["build-ts"]);
    gulp.watch(PATHS.client.html, ["build-html"]);
    gulp.watch(PATHS.client.css, ["build-css"]);
    gulp.watch(PATHS.client.img, ["build-img"]);
    gulp.watch(PATHS.client.config, ["build-img"]);
    gulp.watch(packageJson.main, ["server:restart"]);
});

gulp.task("express", ["build", "server.restart"], function() {
    gulp.watch(PATHS.client.ts, ["build-ts"]);
    gulp.watch(PATHS.client.html, ["build-html"]);
    gulp.watch(PATHS.client.css, ["build-css"]);
    gulp.watch(PATHS.client.img, ["build-img"]);
    gulp.watch(PATHS.client.config, ["build-img"]);
    gulp.watch(packageJson.express, ["server:restart"]);
});

// clean up if an error goes unhandled.
process.on("exit", function() {
    if (server) {
        server.kill();
    }
});


gulp.task("default", ["build"]);