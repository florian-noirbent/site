---
title: "Beltwork"
description: "Cozy, idle-friendly automation and trade game in the asteroid belt. Mine asteroids, run your station's factories, and trade in a shared player economy at your own pace."
cardImage: /images/games/beltwork/cover.webp
date: 2026-02-13
status: unreleased
platforms:
  - Web
engine: React + Fastify (TypeScript)
genre: Cozy automation / idle
releaseNote: In development.
links:
  source: https://github.com/florian-noirbent/beltwork
---

## Overview

Beltwork is a cozy space station game inspired by hard science fiction but drawn with friendly, cartoon visuals. You run a small industrial station in the asteroid belt: scan for asteroids, deploy mining rigs, refine and assemble materials in your station's buildings, then decide whether to reinvest or sell on the open market.

There is no combat and nothing to lose. Your station keeps working while you're away, so short sessions of 5 to 15 minutes are enough to plan the next step.

- Realistic constraints such as power, heat and logistics, with calm pacing and no sudden failures
- Automation by intent: you set priorities and the station runs itself
- Continuous offline progress
- Shared multiplayer market without PvP, with NPC buyers on Mars and the Moon

## Tech

Beltwork is a browser game built as a TypeScript monorepo: a React and Tailwind web client, a Fastify API, and PostgreSQL with Drizzle, all running in Docker.
