# Smart Agenda

A lightweight browser-based agenda built with plain HTML5, CSS and JavaScript.
Users create personal events, drag them between "Today" and "Pending", see their
current location, view a canvas chart with the event counts, and keep their data
between sessions using localStorage. No server, no frameworks.

## Project structure

    smart-agenda/
    ├── index.html
    ├── README.md
    ├── css/
    │   ├── base.css          (A) layout, form, cards
    │   └── calendar.css      (M) calendar style, colors, polish
    └── js/
        ├── storage.js        (A) localStorage
        ├── agenda.js         (A) create, validate, delete, render
        ├── dragdrop.js       (M) drag between Today / Pending
        ├── geo.js            (M) user location
        ├── canvas.js         (M) chart
        └── main.js           (A) entry point

## Data model

    { id, name, date, status: "today" | "pending", createdAt }

## Contract between A and M

- `getEvents()` and `moveEvent(id, newStatus)` live in `agenda.js`
- `renderAgenda()` is called every time the data changes
- HTML hooks: `#zone-today`, `#zone-pending`, `#chart`, `#location`

## Work split

| | A | M |
|---|---|---|
| Requirements | Create events + localStorage | Drag and drop + geolocation + canvas |
| Custom logic | Validations + delete/edit | Max. 5 events in Today + overdue in red |
| Design | Structure and base style | Calendar style and polish |
| Extra | Repo setup and gitflow | Deployment and delivery document |

## Branches

- `main`: stable, deployed code only
- `develop`: integration branch
- `feature/a-*`, `feature/m-*`: one per task
- `release/1.0.0`: stabilization before publishing
- `bugfix/a-*`, `bugfix/m-*`: fixes found during testing

Everything goes through a Pull Request reviewed by the other person.

## Commit messages

Short, in English, imperative mood, no prefixes. Example: `Add form validations`.