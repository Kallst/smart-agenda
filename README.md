# Smart Agenda

A lightweight browser-based agenda built with plain HTML5, CSS and JavaScript.
Users create personal events, drag them between "Today" and "Pending", see their
current location, view a canvas chart with the event counts, and keep their data
between sessions using localStorage. No server, no frameworks.

## Features

- Create events with a name and a date
- Drag and drop events between "Today" and "Pending"
- Show the user's current location (Geolocation API)
- Draw the number of events per zone on a canvas
- Persist all data in localStorage
- Custom logic:
  - Validations: minimum 3 characters, no duplicate names, date required
  - Edit and delete events
  - Maximum 5 events in "Today"
  - Overdue events highlighted in red

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
- `dragdrop.js`, `geo.js` and `canvas.js` are created by A with empty
  functions and `// TODO (Mari)` comments
- HTML hooks: `#zone-today`, `#zone-pending`, `#chart`, `#location`

## Work split

| | A | M |
|---|---|---|
| Requirements | Create events + localStorage | Drag and drop + geolocation + canvas |
| Custom logic | Validations + delete/edit | Max. 5 events in Today + overdue in red |
| Design | Structure and base style | Calendar style and polish |
| Extra | Repo setup and