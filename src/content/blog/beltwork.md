---
title: "Beltwork: An OGame-Like Without the War, and an Event-Driven Backend in TypeScript"
description: "A month of building a cozy asteroid-mining browser game to learn React, Node and PostgreSQL: game design, scheduled domain events, a player journal and a canvas station."
date: 2026-03-12
type: technical
tags:
  - "Beltwork"
  - "TypeScript"
  - "React"
  - "Node.js"
  - "Architecture"
---

[Beltwork](/games/beltwork) is a browser game I have been building since mid-February: you run a small industrial station in the asteroid belt, send mining rigs to asteroids, refine what they bring back and, eventually, trade it on a market shared by every player. It is also, quite openly, a training project. I have spent my career in Unity and C#, and I wanted a real reason to learn the modern web stack end to end: TypeScript everywhere, React and Vite on the front, Node and Fastify on the back, PostgreSQL with Drizzle in between. The source is on GitHub: [florian-noirbent/beltwork](https://github.com/florian-noirbent/beltwork).

## The inspiration: OGame, minus the war

[OGame](https://en.wikipedia.org/wiki/OGame) is a browser space strategy MMO released by Gameforge in 2002. You own a planet, build metal, crystal and deuterium mines, research technologies and build fleets, and everything takes real time: an upgrade might finish in twenty minutes or in two days. The game keeps running when you close the tab, so you log in a few times a day, queue the next upgrades and leave. For a programmer it is a fascinating kind of game, because the server never really "plays" it: state is mostly timestamps and timers, and the economy has to be correct whether a player checks in every five minutes or once a week.

What I never liked about OGame is the other half of it: fleets exist to raid other players, and a night away can cost you everything. Beltwork keeps the part I enjoy, a persistent, idle-friendly economy driven by timers, and drops combat entirely. The design document describes it as **cozy hard-SF**: realistic constraints such as power, heat and logistics, but friendly cartoon visuals, calm pacing and no sudden failures. There is no PvP, no sabotage and nothing to lose. Players interact only through a shared market, and NPC traders on Mars and the Moon keep it alive when players are scarce.

The core loop is short:

1. Scan for new asteroids.
2. Deploy mining rigs to extract resources (water, metals, conductors, carbon materials).
3. Process materials in the station's refinery and assembler.
4. Decide whether to reinvest or sell on the open market.

The station has ten slots for buildings, each with its own role: a fusion reactor that burns water for power, life support, radiators that shed heat (an overheated station stops its factories), storage, a scanner, mining docks that set how many rigs can fly at once, the two factories and a trading hub. Sessions are meant to last five to fifteen minutes: plan, queue, leave.

All the balancing lives in JSON files under `gameconfig/`: buildings with build costs, upgrade curves, power and heat rules, asteroid templates with spawn weights and compositions, and blueprints (the production graph). For example, the refinery's "Metal Plating" blueprint turns 10 metals into 6 metal plates in 60 seconds. The server parses these files with Zod schemas at load time, so a typo in balancing data fails loudly instead of producing silent nonsense.

## No game loop: everything is an event

The constraint I set myself from the first day, written in the project's agent notes, was: no global tick, no per-second loop, no in-memory simulation. The backend only does work when an HTTP request arrives or when a scheduled domain event becomes due. That is exactly how an OGame-like has to work to scale, and it is a good exercise in thinking in timestamps.

When you upgrade a building, the API does not increment a level. In one transaction it locks the building row, writes `upgrade_started_at`, and inserts a row in a `domain_events` table due one minute later (a placeholder duration until the cost and time curves from the config are wired in):

```ts
await tx.insert(domainEvents).values({
  stationId: stationRow.id,
  eventType: 'station.building.upgrade.finalize.v1',
  payloadJson: { building_id: input.buildingId, upgrade_started_at: upgradeStartedAtIso },
  idempotencyKey: `station_building_upgrade:${input.buildingId}:${upgradeStartedAtIso}`,
  dueAt,
})
```

Every event type is registered with a handler that declares whether it needs a station lock, how to validate its JSON payload, and what to do:

```ts
export type DomainEventHandlerDefinition<TPayload, TServices> = {
  requiresStationLock: boolean
  parsePayload: (payloadJson: unknown) => TPayload | null
  handle: (input: DomainEventHandlerInput<TPayload, TServices>) => Promise<void>
}
```

A small agent runs inside the API process. Every ten seconds it reads the events due in the next ten-second window, keeps them in a map, and arms a single `setTimeout` for the earliest one, so an upgrade completes at its due time rather than at the next poll. Processing happens in a transaction: re-read the event, parse the payload, run the handler, delete the event. Because the events live in PostgreSQL, a server restart or a player being offline for a week changes nothing: the overdue events are simply picked up on the next poll.

Two details made this robust. First, handlers are written to be safe to run twice. The upgrade handler only increments the level if `upgrade_started_at` still matches the timestamp stored in the payload, and every event carries a unique idempotency key built from the operation and its phase start time. A stale or duplicated event finds nothing to update and is discarded. Second, events that touch the whole station take a lease lock, implemented as a single upsert that only succeeds if the previous lease has expired:

```sql
insert into simulation_locks (station_id, locked_by, locked_at, expires_at)
values ($1, $2, $3, $4)
on conflict (station_id) do update set locked_by = excluded.locked_by, ...
where simulation_locks.expires_at <= $3
returning station_id
```

If the lock is contended the agent retries a second later. This keeps the door open to running several API processes later without double-processing.

## Mining as a chain of events

Mining is where the design pays off. A rig is a small state machine, `flying_to_destination`, then `mining`, then `returning`, and each transition is one event scheduled for the end of the current phase. Travel time comes from the distance between the station and the asteroid and the rig speed defined in `buildings.json`; mining time from the cargo size and mining speed. When a phase ends, its handler decides what happens next: if another rig is already mining the asteroid, or it is depleted, the rig turns around and the player gets a warning in the journal; when the hold is full it heads home, and on arrival the cargo is split into resources according to the asteroid's composition, using a largest-remainder allocation so integer units always add up.

Asteroids are shared world entities, so their remaining units are decremented under a row lock, and each player keeps their own scanned snapshot of an asteroid: you only see its name, yield and composition after scanning it, and that knowledge can go stale while others mine it.

The last thing I built is the **event journal**. Domain events are transient scheduler records and are deleted once handled; what the player sees is a separate `player_journal_entries` table, written by the handlers ("Refinery upgraded to level 3!"), with an importance level (`info`, `important`, `warning`) and JSON metadata for future filters. The journal page pages through it with a cursor, and the shell shows a short banner when new entries appear after a refresh.

## The rest of the stack

The repository is an npm workspaces monorepo with `apps/api` and `apps/web`, Docker Compose for PostgreSQL and the API.

- **API**: Fastify with route modules per area (session and auth, station, map, mining, journal, factories, health with `/live` and `/ready` probes). Players start with a single "Start now" button that creates a guest account with a generated name, a station and a signed `HttpOnly` session cookie; they can later add an email and password or link a Google account without losing progress.
- **Database**: Drizzle schema and eight migrations covering players, sessions, stations, buildings (with database constraints for one building per type and slot indexes from 1 to 10), inventory, asteroids, scans, mining operations, factory jobs, domain events, journal entries and simulation locks.
- **Frontend**: React 19 with React Router, Tailwind and plain context providers and hooks instead of a data-fetching library, which was a deliberate choice to learn the basics first. The API stays authoritative; the client only schedules a refresh for the earliest known upgrade or mining finish time.
- **Station page**: my first plan was a pure HTML/CSS interface with no canvas. On the last stretch I reworked the station into a full-screen canvas: a background image of the station, ten fixed slots with building sprites or empty platforms, clamped pan and zoom, hit detection for hover and selection, and a right-side panel picked from a registry mapping building type to React component. The map page uses the same approach for stations and asteroids.
- **Quality**: Vitest everywhere (about thirty test files), with API tests running against a dedicated PostgreSQL test database that is truncated between tests, and Testing Library on the front. ESLint, TypeScript checks and Prettier are gathered in one `npm run check`, with Husky and lint-staged formatting on commit.

The icons are placeholders produced by a small script that reads a visual description stored next to each entry in the game config and sends it to an image generator (ComfyUI locally, or OpenAI), which kept the screens readable while I focused on code.

## Where it stopped

The work came in two bursts: the design document, scaffolding, authentication, inventory and map between February 13 and 19, then the canvas station, the domain event service, mining and the journal between March 10 and 12. At this point you can start a station, place buildings, upgrade them on a timer, scan asteroids, send rigs to mine them and read what happened in your journal, including after being away.

A lot of the design is still only in the documents and config files. Building placement is still free and instant, and upgrades use a fixed one-minute timer instead of the cost and time curves. Factory production exists only as in-memory scaffolding with a catch-up function; the next step is to persist factory jobs and drive them with the same domain events as mining. Power, heat and crew mood are defined in the config but not simulated, and the market with its NPC traders, which is the whole point of a shared economy, is not started.

As a learning project it already did its job: I now have a feel for how a typed Node backend, a relational schema and a React client fit together, and the event-driven core is the piece I would keep for any persistent game of this kind.

## Links

- Source code: [github.com/florian-noirbent/beltwork](https://github.com/florian-noirbent/beltwork)
- Game page: [Beltwork](/games/beltwork)
- [OGame on Wikipedia](https://en.wikipedia.org/wiki/OGame)
