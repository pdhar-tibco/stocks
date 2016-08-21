import { NgModule }                          from "@angular/core";
import { BrowserModule }                     from "@angular/platform-browser";
import { HttpModule }                        from "@angular/http";
import { FormsModule }                       from "@angular/forms";
import { appRouting }                        from "./app.routing";
import {StocksService}                       from "../services/stocks";
import {Manage}                             from "./manage";

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
  ],
  bootstrap: [App]
})
export class AppModule { }
