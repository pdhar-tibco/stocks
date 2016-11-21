import { ModuleWithProviders } from "@angular/core";
import {Routes, RouterModule} from "@angular/router";
import {Dashboard} from "./dashboard";
import {Manage} from "./manage";
import {StockApp} from "./app";



export const appRoutes: Routes = [
    {
        path: "stocks",
        component: StockApp,
        children: [
            {
                path: "Dashboard",
                component: Dashboard
            },
            {
                path: "Manage",
                component: Manage
            },
            {
                path: "",
                redirectTo: "Dashboard",
                pathMatch: "full"
            },
        ]
    }

];
console.log("[stocks.app.routing]");
export const appChildRouting: ModuleWithProviders = RouterModule.forChild(appRoutes);
