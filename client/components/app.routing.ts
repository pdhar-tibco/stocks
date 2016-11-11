import { ModuleWithProviders } from "@angular/core";
import {Routes, RouterModule} from "@angular/router";
import {Dashboard} from "./dashboard";
import {Manage} from "./manage";



export const appRoutes: Routes = [
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
];
console.log("[stocks.app.routing]");
export const appRouting: ModuleWithProviders = RouterModule.forRoot(appRoutes, { enableTracing: true, useHash: true });
