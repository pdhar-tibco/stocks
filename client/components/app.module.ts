import { NgModule }                          from "@angular/core";
import { BrowserModule }                     from "@angular/platform-browser";
import { HttpModule }                        from "@angular/http";
import { FormsModule }                       from "@angular/forms";
import { appRouting }                        from "./app.routing";
import {StocksService}                       from "../services/stocks";
import {Manage}                              from "./manage";
import { Summary }                           from "./summary";
import { Dashboard }                         from "./dashboard";

import { StockApp }                               from "./app";



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
    StockApp,
    Manage,
    Dashboard,
    Summary
  ],
  exports: [
    StockApp,
    Manage,
    Dashboard,
    Summary
  ],
  bootstrap: [StockApp]
})
export class StocksModule {
  constructor() {
    console.log("[stocks.app.module]");
  }
}
