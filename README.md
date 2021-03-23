# FormGen

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.0.7.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Implemenmting this new Formgen in an existing ASCA Project

- `npm i @harlock123/formgen-lib`<p></p>
_will install the latest version of the library from NPM_

- make sure to have `import { FormGenBS } from '@harlock123/formgen-lib';`<p></p>
_with the other imports at the top. If there is already a reference to the old form-gen-lib from yore. Remove it._

- make sure to have `import { FormgenLibModule } from '@harlock123/formgen-lib;`<p></p>
_in the app.module.ts file. If there is one for the old form-gen-lib. remove it_

- Now in the screener component the process will depend on how much or how little of the old formgen library was used. 

- Formgen will now automatically colorize dropdown combo boxes when invalidated, There used to be excess code to do that outside in screeners.component.ts. 

- Formgen will now handle PLEASE SELECT in dropdown boxes as unset for validation rules

- Formgen has a new method to set the score for a form it takes the CONCEPT ID of the field to carry the score as a string and the score to set as a number. Callable using... `this.formGenBS.SetFormScore('581065',this.formGenBS.GetFormScore())`  *taken from Missouri as an example*

