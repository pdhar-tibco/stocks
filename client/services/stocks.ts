import { Injectable, Inject } from "@angular/core";
import { Http } from "@angular/http";

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
  prefix: String = "";
  constructor( @Inject(Http) Http) {
    this.http = Http;
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
