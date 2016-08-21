import {Routes, RouterModule} from "@angular/router";
import {Dashboard} from "./dashboard";
import {Manage} from "./manage";



export const appRoutes: Routes = [
    {
        path: "",
        redirectTo: "Dashboard",
        pathMatch: "full"
    },
    {
        path: "Dashboard",
        component: Dashboard
    },
    {
        path: "Manage",
        component: Manage
    }
];

export const appRouting = RouterModule.forRoot(appRoutes, { enableTracing: true, useHash: true });
