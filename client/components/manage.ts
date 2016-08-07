import {Component} from "@angular/core";
import {FORM_PROVIDERS, FORM_DIRECTIVES, FormBuilder, ControlGroup} from "@angular/common";

import {StocksService} from "../services/stocks";

@Component({
  selector: "manage",
  viewProviders: [FORM_PROVIDERS, StocksService],
  directives: [FORM_DIRECTIVES],
  template: `
  <div class="demo-grid-1 mdl-grid">
    <div class="mdl-cell mdl-cell--4-col"></div>
    <div class="mdl-cell mdl-cell--4-col">
      <form [ngFormModel]="stockForm" style="margin-bottom: 5px;" (submit)="add()">
        <input ngControl="stock" class="mdl-textfield__input" type="text" placeholder="Add Stock" />
      </form>
      <table class="mdl-data-table mdl-data-table--selectable mdl-shadow--2dp" style="width: 100%;">
        <tbody>
          <tr *ngFor="let symbol of symbols">
            <td class="mdl-data-table__cell--non-numeric">{{symbol}}</td>
            <td style="padding-top: 6px;">
              <button class="mdl-button" (click)="remove(symbol)">Remove</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="mdl-cell mdl-cell--4-col"></div>
  </div>
`
})
export class Manage {
  symbols: Array<string>;
  service: StocksService;
  stockForm: ControlGroup;

  constructor(service: StocksService, builder: FormBuilder) {
    this.service = service;
    this.symbols = service.get();

    this.stockForm = builder.group({
      stock: [""]
    });
  }

  add() {
    this.symbols.push(this.stockForm.value.stock.toUpperCase());
  }

  remove(symbol) {
    this.symbols = this.service.remove(symbol);
  }
}