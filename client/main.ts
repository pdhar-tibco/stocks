/// <reference path="../typings/globals/es6-shim/index.d.ts" />
import {bootstrap} from '@angular/platform-browser-dynamic';
import {HTTP_PROVIDERS} from '@angular/http';

import {App} from './components/app';

bootstrap(App, [HTTP_PROVIDERS]);