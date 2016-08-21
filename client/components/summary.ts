import {Component, Input} from "@angular/core";

import {StockInterface} from "../services/stocks";

@Component({
  selector: "summary",
  // inputs: ["stock"],
  template: `
<div class="mdl-card stock-card mdl-shadow--2dp" [ngClass]="{increase: isPositive(), decrease: isNegative()}" style="width: 100%;">
  <span *ngIf="stock">
    <div class="mdl-card__title">
      <h4 style="color: #fff; margin: 0">
        {{stock.symbol.toUpperCase()}}<br />
        {{stock.lastTradePriceOnly | currency:'USD':true:'.2'}}<br />
        {{stock.change | currency:'USD':true:'.2'}} ({{stock.changeInPercent | percent}})
      </h4>
    </div>
  </span>
</div>
`
})
export class Summary {

  @Input() stock: StockInterface;

  isNegative() {
    if (!this.stock || this.stock.change >= 0) {
      return false;
    }

    return true;
  }

  isPositive() {
    if (!this.stock || this.stock.change <= 0) {
      return false;
    }

    return true;
  }
}