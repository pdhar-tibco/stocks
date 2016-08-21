import {Component} from "@angular/core";

import {Summary} from "./summary";
import {StocksService, StockInterface} from "../services/stocks";

@Component({
  selector: "dashboard",
  providers: [StocksService],
  directives: [Summary],
  template: `
    <div class="mdl-grid">
      <div class="mdl-cell mdl-cell--12-col" *ngIf="!stocks" style="text-align: center;">
        Loading
      </div>
      <div class="mdl-cell mdl-cell--3-col" *ngFor="let stock of stocks">
        <summary [stock]="stock"></summary>
      </div>
    </div>
  `
})
export class Dashboard {
  stocks: Array<StockInterface>;
  symbols: Array<string>;

  constructor(service: StocksService) {
    this.symbols = service.get();

    service.load(this.symbols)
    .subscribe(stocks => this.stocks = stocks.json());
  }
}