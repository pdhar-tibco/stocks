import { NgModule }                          from "@angular/core";
import { BrowserModule }                     from "@angular/platform-browser";
import { HttpModule }                        from "@angular/http";
import { FormsModule }                       from "@angular/forms";
import { appRouting }                        from "./app.routing";
import {StocksService}                       from "../services/stocks";
import {Manage}                              from "./manage";
import { Summary }                           from "./summary";
import { Dashboard }                         from "./dashboard";

import { App }                               from "./app";



@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    appRouting,
  ],
  providers: [
  ],
  declarations: [
    App,
    Manage,
    Dashboard,
    Summary
  ],
  exports: [
    App,
    Manage,
    Dashboard,
    Summary
  ],
  bootstrap: [App]
})
export class StocksModule {
  constructor() {
    console.log("[stocks.app.module]");
  }
}
