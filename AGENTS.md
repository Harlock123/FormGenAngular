# AGENTS.md

Notes for anyone, human or AI agent, changing this code. `README.md` covers publishing to npm and using the library
in an existing app; this file covers how the code is laid out and what to watch when changing it.

## What this is

An Angular library, published to npm as `@harlock123/formgen-lib`, that builds data-driven forms in the browser
from a list of element definitions (rows, field types, labels, validation, scores and show/hide interactions). It
is an Angular CLI 11 workspace with one library project, `formgen-lib`, and no demo application.

## Commands

```bash
npm install
npx ng build                                      # ng-packagr build into dist/formgen-lib
npx ng test                                       # Karma + Jasmine (needs Chrome)
npx ng lint                                       # TSLint
```

- `package.json` pins Angular ~11.0.9 and TypeScript ~4.0, but `@angular-devkit/build-angular` is ^14.0.3.
  Expect to line these up before a clean install builds.
- The only tests are the CLI's generated specs for the placeholder component and service; `formgen.ts` has none.

## Layout

- `angular.json`: the workspace; `formgen-lib` is the only (and default) project.
- `projects/formgen-lib/src/public-api.ts`: what the package exports.
- `projects/formgen-lib/src/lib/formgen.ts`: nearly all of the code.
  - `FormGenBS` (injectable, `providedIn: 'root'`) builds the form into the DOM and runs it.
    - Defining: `HydrateForm`, `SetFormDefinition*`, `GetFormDefinition*`, `GetWholeForm`/`SetWholeForm`.
    - Data: `SetFormData`, `GetFormDataAsString`, `SetFormScore`/`GetFormScore`.
    - Checking: `IsFormValid`, `ClearFormValidityVisuals`.
    - Behaviour: `DoFormGenInteraction`, `SetReadWrite`, the green-bar row shading.
  - `UIElement`, `UIInteraction`, `UIValue` and `FormGenDefCon` are the definition and data classes.
- `projects/formgen-lib/src/lib/formgen-lib.{component,service,module}.ts`: CLI scaffolding.
  `FormgenLibModule` is what apps import; the component and service are placeholders.
- `projects/formgen-lib/package.json`: the published name, version and peer dependencies.

## Rules that keep it working

- **The definition format is shared with existing apps.** Forms are stored and passed around as `UIElement`
  arrays (or their JSON). Add new `UIElement` fields as optional constructor arguments with defaults, as the
  existing ones (`elAutoSize`, `elCustomClass`, `elRecords`, `elValueEcho`) are, so old definitions still load.
- **`FormGenBS.theUIElements` is static.** It is shared by every instance on the page.
- **Rows are renumbered.** `HydrateForm` sorts by `elFormRow` and renumbers rows to be consecutive.
- **Hidden text fields.** A text element that starts invisible does not count toward `IsFormValid`, even if
  required (see README).
- It works on the browser DOM directly, so it runs only in a browser, not under server-side rendering.

## Making a change

- There are no real tests: check changes in an app that uses the library.
- To release, bump `version` in `projects/formgen-lib/package.json`, run `ng build`, and publish from
  `dist/formgen-lib` as the README describes.
- Record behaviour changes that users of the library need to know about in `README.md`.

There is no CI workflow.
