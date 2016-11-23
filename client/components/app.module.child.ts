import { NgModule }                          from "@angular/core";
// import { BrowserModule }                     from "@angular/platform-browser";
import { CommonModule }                      from "@angular/common";
import { HttpModule }                        from "@angular/http";
import { FormsModule }                       from "@angular/forms";
import { appChildRouting }                   from "./app.routing.child";
import { StocksService }                     from "../services/stocks";
import { Manage }                            from "./manage";
import { Summary }                           from "./summary";
import { Dashboard }                         from "./dashboard";

import { StockApp }                          from "./app";



@NgModule({
  imports: [
    // BrowserModule,
    CommonModule,
    HttpModule,
    FormsModule,
    appChildRouting,
  ],
  providers: [
  ],
  declarations: [
    StockApp,
    Manage,
    Dashboard,
    Summary,
  ],
  exports: [
    StockApp,
    Manage,
    Dashboard,
    Summary,
  ],
  bootstrap: [StockApp]
})
export default class StocksChildAppModule {
  constructor() {
    console.log("[stocks.child.app.module]");
  }
}
