import { Injectable, Inject } from "@angular/core";
import { Http } from "@angular/http";
import {Location} from "@angular/common";

let stocks: Array<string> = ["AAPL", "GOOG", "FB", "AMZN", "TWTR"];

export interface StockInterface {
  symbol: string;
  lastTradePriceOnly: number;
  change: number;
  changeInPercent: number;
}
@Injectable()
export class StocksService {
  http: Http;
  location: Location;
  prefix: String = "";
  constructor( @Inject(Http) Http, @Inject(Location) location) {
    this.http = Http;
    this.location = location;
    console.log(location.path(true));
  }

  configure(prefix: String) {
    this.prefix = prefix || "";
  }

  get() {
    return stocks;
  }

  add(stock) {
    stocks.push(stock);
    return this.get();
  }

  remove(stock) {
    stocks.splice(stocks.indexOf(stock), 1);
    return this.get();
  }

  load(symbols) {
    if (symbols) {
      return this.http.get(this.prefix + "/stocks/snapshot?symbols=" + symbols.join());
    }
  }
}
