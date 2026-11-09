# Smart Agenda

A lightweight browser-based agenda built with plain HTML5, CSS and JavaScript.
Users create personal events, drag them between "Today" and "Pending", see their
current location, view a canvas chart with the event counts, and keep their data
between sessions using localStorage. No server, no frameworks.

> This README is also the work guide for the team. Person A finishes all of
> their tasks first, then Person M continues with hers.

## Team

- **A**: Santiago
- **M**: Mariana (Mari)

## Workshop requirements (Group 8: Smart Agenda)

| Requirement | Owner |
|---|---|
| Create events (name) | A |
| Save in localStorage | A |
| Drag events to "Today" or "Pending" | M |
| Show the user's location | M |
| Canvas chart with the number of events | M |
| Simple calendar-style design with clean cards | A (base and date badge) and M (calendar theme) |
| Custom logic (so our project is different from the others) | A and M |

Custom logic:

- **A:** validations (minimum 3 characters, no duplicate names, date required) and edit/delete events
- **M:** maximum 5 events in "Today" and overdue events highlighted in red

## Project structure

    smart-agenda/
    ├── index.html
    ├── README.md
    ├── css/
    │   ├── base.css          (A) layout, form, cards
    │   └── calendar.css      (M) calendar style, colors, polish
    └── js/
        ├── storage.js        (A) localStorage
        ├── agenda.js         (A) create, validate, delete, edit, render
        ├── dragdrop.js       (M) drag between Today / Pending
        ├── geo.js            (M) user location
        ├── canvas.js         (M) chart
        └── main.js           (A) entry point

Each person edits **different files** to avoid merge conflicts. The only
exception is task M4, which fills two functions inside `js/agenda.js`.

`calendar.css` is loaded after `base.css`, so M can override any base style.

## Data model

    { id, name, date, status: "today" | "pending", createdAt }

- `id`: string
- `name`: string
- `date`: string in `YYYY-MM-DD` format (the value of `<input type="date">`)
- `status`: `"today"` or `"pending"`
- `createdAt`: timestamp in milliseconds

Events are stored in localStorage under the key `smartAgenda.events`.

## Handoff for Mari

Everything below is ready. M only fills the functions marked `// TODO (Mari)`
and writes CSS. Do not change A's logic.

### Functions available (global, from `js/agenda.js`)

| Function | What it does |
|---|---|
| `getEvents()` | Returns a copy of the current events array |
| `moveEvent(id, newStatus)` | Changes the status (`"today"` or `"pending"`), saves, re-renders, and returns `{ ok, message }`. If it is rejected, nothing changes and `ok` is `false` |
| `showBoardMessage(message)` | Writes the text in `#board-message` |
| `renderAgenda()` | Re-renders all cards, clears `#board-message` and calls `drawChart()` at the end |
| `canMoveEvent(id, newStatus)` | Returns `{ ok: true }` or `{ ok: false, message }`. `moveEvent` calls it before moving. **M fills it (M4)** |
| `isOverdue(event)` | Returns `true` or `false`. `createCard` adds the class `overdue` when it returns `true`. **M fills it (M4)** |

Hooks that M must fill (search for `// TODO (Mari)`):

- `js/dragdrop.js` -> `initDragDrop()`
- `js/geo.js` -> `initGeolocation()`
- `js/canvas.js` -> `drawChart()`
- `js/agenda.js` -> `canMoveEvent()` and `isOverdue()`
- `css/calendar.css` -> all the styling

### HTML hooks

- `#zone-today` and `#zone-pending`: the drop zones (`div.dropzone`). Each has a
  `data-status` attribute (`"today"` or `"pending"`)
- `.zone-today-wrapper` and `.zone-pending-wrapper`: the `<section>` that wraps
  each column (title + drop zone), useful for column colors
- `#board-message`: a `<p>` where M shows messages such as "Today is full"
- `#chart`: the `<canvas>` (400 x 250)
- `#location`: the `<span>` where the location is shown (starts with "Locating...")

### How the cards look in the DOM

    <article class="card [overdue] [editing]" draggable="true" data-id="<event id>">
      <div class="card-badge">
        <span class="badge-day">10</span>
        <span class="badge-month">NOV</span>
      </div>
      <div class="card-body">
        <p class="card-title">Team meeting</p>
        <p class="card-date">2026-11-10</p>
        <div class="card-actions">
          <button class="btn-secondary">Edit</button>
          <button class="btn-danger">Delete</button>
        </div>
      </div>
    </article>

- While a card is being edited it has the class `editing`, `draggable="false"`,
  and the title is replaced by a `form.card-edit-form` (`input.card-edit-input`,
  `p.card-error`, and the buttons `Save` / `Cancel`)
- Cards are **re-created on every render**, so M must use **event delegation**
  (listeners on `#zone-today` and `#zone-pending`, never on each card)
- When the drop target is a card inside a zone, use `event.target.closest(".dropzone")`
  to find the zone
- Cards are sorted by date inside each zone

### Entry point

`main.js` calls `initAgenda()`, `initDragDrop()`, `initGeolocation()` and
`drawChart()` once the page is loaded. `renderAgenda()` also calls `drawChart()`,
so the chart is redrawn every time the data changes. Do not call `drawChart()`
from anywhere else.

### Already done by A (do not redo)

- Create events with validations (min. 3 characters, no duplicates, date required)
- Edit and delete events (with confirmation on delete)
- localStorage save and load (with protection against corrupted data)
- Base layout, form, cards, date badge, edit and delete buttons

### How to test your work

- Use the VS Code extension **Live Server** (geolocation needs HTTPS or `localhost`)
- Keep the browser console open (F12): there must be no errors
- To clear all data: `localStorage.removeItem(STORAGE_KEY); location.reload();`

## Branching model (gitflow)

- `main`: stable, deployed code only
- `develop`: integration branch (default branch)
- `feature/a-*` and `feature/m-*`: one branch per task, each person with their own prefix
- `release/1.0.0`: stabilization before publishing
- `bugfix/a-*` and `bugfix/m-*`: fixes found during testing

Rules:

- Never commit directly to `main` or `develop`
- Everything goes through a Pull Request reviewed by the other person
- Every task branch starts from an updated `develop`

## Commit messages

Format: `<prefix>: <short message>`, in English and imperative mood.

Allowed prefixes (they match the branch type):

- `feature:` commits made on `feature/*` branches
- `bugfix:` commits made on `bugfix/*` branches
- `release:` commits made on `release/*` branches and release tags

Example: `feature: add form validations`.

## Workflow for every task

    git checkout develop
    git pull
    git checkout -b feature/<owner>-<task-name>
    # work and make small commits
    git push -u origin feature/<owner>-<task-name>
    # open a Pull Request to develop and ask the other person to review it

When opening the Pull Request, check that **base** is `develop` and
**compare** is your branch. After the merge, run `git checkout develop` and
`git pull` before starting the next task.

## Work plan

### Phase 0: Setup (A)

| Task | Branch | Commit | Status |
|---|---|---|---|
| Initial repo | `main` / `develop` | `Initial commit` | [x] Done |
| README | `feature/a-readme` | `feature: add project structure and conventions to README` | [x] Done |

### Phase 1: Person A

| # | Branch | Commit | What it includes | Status |
|---|---|---|---|---|
| A1 | `feature/a-base-structure` | `feature: add base HTML structure and empty module files` | `index.html`, `base.css`, empty module files with `// TODO (Mari)`, `main.js` | [x] Done |
| A2 | `feature/a-local-storage` | `feature: add localStorage persistence` | `saveEvents()` and `loadEvents()` with `try/catch` and data validation | [x] Done |
| A3 | `feature/a-create-events` | `feature: add event creation and rendering` | Form, `getEvents()`, `moveEvent()`, `renderAgenda()`, hooks `canMoveEvent()` and `isOverdue()`, `#board-message`, date badge | [x] Done |
| A4 | `feature/a-validations` | `feature: add form validations` | Min. 3 characters, no duplicates, date required, errors in `#form-error` (no `alert`) | [x] Done |
| A5 | `feature/a-delete-edit` | `feature: add delete and edit actions` | Delete button with confirmation, name editing with the same validations | [x] Done |
| A6 | `feature/a-handoff` | `feature: add handoff section to README` | This README, final handoff | [x] Done |

### Phase 2: Person M (starts after A6 is merged)

Start from an updated `develop`.

| # | Branch | Commit | Files | Status |
|---|---|---|---|---|
| M1 | `feature/m-drag-drop` | `feature: add drag and drop between zones` | `js/dragdrop.js` | [ ] |
| M2 | `feature/m-geolocation` | `feature: show user location` | `js/geo.js` | [ ] |
| M3 | `feature/m-canvas-chart` | `feature: draw event count chart on canvas` | `js/canvas.js` | [ ] |
| M4 | `feature/m-custom-rules` | `feature: add today limit and overdue highlighting` | `js/agenda.js` (only 2 functions) | [ ] |
| M5 | `feature/m-calendar-style` | `feature: add calendar theme and responsive layout` | `css/calendar.css` | [ ] |

#### M1: Drag and drop (`js/dragdrop.js`)

- Fill `initDragDrop()` using event delegation on `#zone-today` and `#zone-pending`
- `dragstart`: save the card's `data-id` in `event.dataTransfer`
- `dragover`: call `preventDefault()` and add the class `drag-over` to the zone being hovered
- `dragleave` and `drop`: remove the class `drag-over`
- `drop`: read the id, take the new status from the zone's `data-status`, and call `moveEvent(id, newStatus)`
- If `moveEvent` returns `ok: false`, call `showBoardMessage(result.message)`. If it returns `ok: true`, do nothing else (`renderAgenda()` already updated the board)
- Done when: cards move between zones, the change persists after a reload, and no errors appear in the console

#### M2: Geolocation (`js/geo.js`)

- Fill `initGeolocation()` using `navigator.geolocation.getCurrentPosition()`
- Show latitude and longitude in `#location` (for example `4.8143, -75.6946`)
- Handle denied permission, timeouts and browsers without support with a clear message such as "Location unavailable."
- Done when: the location is shown after accepting the permission, and the denied case shows the message without errors

#### M3: Canvas chart (`js/canvas.js`)

- Fill `drawChart()`: two bars, "Today" and "Pending", with the real counts from `getEvents()`
- Include labels and the number above each bar, and clear the canvas before drawing
- Do not call `drawChart()` from other places: `renderAgenda()` already calls it
- Done when: the bars change every time an event is created, moved, edited or deleted

#### M4: Custom rules (`js/agenda.js`, only two functions)

- `canMoveEvent(id, newStatus)`: if `newStatus` is `"today"` and "Today" already has 5 events, return `{ ok: false, message: "Today is full (max. 5 events)." }`. Otherwise return `{ ok: true }`. Moving an event to the status it already has must be allowed
- `isOverdue(event)`: return `true` if `event.date` is before today's date (compare `YYYY-MM-DD` strings using the local date, not UTC)
- Do not change anything else in `agenda.js`
- Done when: the 6th drop into "Today" is rejected with the message, and overdue cards get the class `overdue`

#### M5: Calendar style (`css/calendar.css`)

- Simple calendar look, clean cards, different colors per column (`.zone-today-wrapper` and `.zone-pending-wrapper`)
- Style the date badge (`.card-badge`, `.badge-day`, `.badge-month`)
- Style `.overdue` in red
- Style `.drag-over` (highlighted drop zone while dragging)
- Review the buttons (`.btn-secondary`, `.btn-danger`) and the edit mode (`.editing`, `.card-edit-input`, `.card-error`)
- Responsive layout for phones
- Done when: the app looks consistent on desktop and on a phone-sized screen

### Phase 3: Release and deployment (both)

| Step | Branch | Commit | Who |
|---|---|---|---|
| Cross-testing | | | Both test the other person's part |
| Fixes | `bugfix/a-*` or `bugfix/m-*` | `bugfix: <short description>` | Whoever owns the bug |
| Release | `release/1.0.0` (from `develop`) | `release: prepare version 1.0.0` | Both |
| Merge to `main` | PR `release/1.0.0` to `main` | | Both |
| Tag | `v1.0.0` on `main` | `release: deliverable version 1.0.0` | A |
| Merge back | PR `release/1.0.0` to `develop` | | Both |
| Deployment | GitHub Pages from `main` (root folder) | | M |
| Delivery document | Deployment link and names of both | | M |

Tag commands:

    git checkout main
    git pull
    git tag -a v1.0.0 -m "release: deliverable version 1.0.0"
    git push origin v1.0.0

## Final checklist

- [ ] Events can be created, with validations
- [ ] Events can be edited and deleted
- [ ] Cards drag between Today and Pending
- [ ] Everything persists after a reload
- [ ] The location is shown (and the denied-permission case works)
- [ ] The chart shows the real counts and redraws when data changes
- [ ] Maximum 5 events in Today and overdue events in red
- [ ] The deployed link works (geolocation requires HTTPS, which GitHub Pages provides)
- [ ] Delivery document has the link and both names