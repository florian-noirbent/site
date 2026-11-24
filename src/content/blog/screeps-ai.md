---
title: "Screeps: Writing an AI for an MMO Where Code Is the Only Controller"
description: "A month of JavaScript for Screeps, the MMO strategy game played only through code: role modules, spawn priorities, static mining, remote rooms and defense."
date: 2016-11-12
type: technical
tags:
  - "Screeps"
  - "JavaScript"
  - "AI"
  - "Programming game"
cardImage: /images/blog/screeps-ai/colony.webp
---

For the last three weeks, most of my evenings have gone into a game I never actually play with the mouse. [Screeps](https://screeps.com/) is an MMO real-time strategy game where the only way to give orders is to write JavaScript, and that code keeps running on the server while I sleep. This article introduces the game, then walks through the AI I wrote for it, [ScreepsIA](https://github.com/florian-noirbent/ScreepsIA): how it is organized, how each kind of unit behaves, and the economy that comes out of those simple rules.

## What Screeps is

Screeps calls itself a "massive multiplayer online real-time strategy game" for programmers ([official introduction](https://docs.screeps.com/introduction.html)). Every player builds a colony in one single persistent world shared with everyone else. The world is a grid of rooms of 50 by 50 tiles, connected by exits, with plains, swamps and walls. It has been on Steam Early Access since June 2016, sold as lifetime access with an optional monthly subscription that increases how much CPU your scripts may use ([MMOs.com](https://mmos.com/news/screeps-the-mmorts-for-programmers-launches-on-steam-early-access), [Steam page](https://store.steampowered.com/app/464350/Screeps_World/)).

![A developed Screeps base: central structures surrounded by rows of extensions, roads and creeps inside the room walls](/images/blog/screeps-ai/colony.webp)

*Image: © Screeps, LLC, from the [Screeps: World Steam page](https://store.steampowered.com/app/464350/Screeps_World/).*

The twist is in the input. There is no unit selection and no right-click to move. You upload a `main.js` module that exports a `loop` function, and the server calls it once per game tick for every player. Whatever your code tells your units to do during that tick is what they do. When you log off, the code keeps running: your colony mines, builds and defends itself without you, for better or worse.

![The in-game script editor, where the colony is controlled entirely through JavaScript modules](/images/blog/screeps-ai/script-editor.webp)

*Image: © Screeps, LLC, from the [Screeps: World Steam page](https://store.steampowered.com/app/464350/Screeps_World/).*

The pieces of the game you program against:

- **Creeps** are the units. Each one is built from a list of body parts: `WORK` to harvest, build, repair and upgrade, `CARRY` to transport resources, `MOVE` to walk, `ATTACK` and `RANGED_ATTACK` to fight, `CLAIM` to take over rooms, `TOUGH` as padding. Every non-`MOVE` part generates fatigue when the creep walks, so the ratio of `MOVE` parts decides its speed. A creep lives 1,500 ticks and then dies, so a colony constantly has to replace its population ([creeps documentation](https://docs.screeps.com/creeps.html)).
- **Spawns** create creeps. A spawn holds 300 energy, and each extension you build next to it adds more, which is what allows bigger and more expensive bodies.
- **Energy sources** are the economy. A source holds 3,000 energy in a room you own and refills every 300 ticks. A `WORK` part harvests 2 energy per tick, so five `WORK` parts are enough to empty a source exactly as fast as it regenerates.
- **The controller** is the heart of a room. Feeding it energy raises the room control level (RCL), from 1 to 8, and each level unlocks more extensions, towers at RCL 3, storage at RCL 4, and so on ([control documentation](https://docs.screeps.com/control.html)). Reserving the controller of a neighboring room keeps its sources at full capacity without owning it.
- **CPU** is the real resource limit. Each tick, your script has a CPU budget in milliseconds, with a bucket that stores unused time for occasional bursts ([CPU limit documentation](https://docs.screeps.com/cpu-limit.html)). An AI that calls `room.find()` everywhere eventually pays for it.
- **Memory** is a global JSON object saved between ticks. It is the only thing that persists from one tick to the next, so every bit of state your AI needs (a creep's role, its current task, a cached path) has to live there, in serializable form.

![Diagram of the CPU bucket: unused CPU accumulates each tick, up to 10,000, and up to 500 can be spent from it in a single tick](/images/blog/screeps-ai/cpu-bucket.webp)

*Image: © Screeps, LLC, from the [Screeps documentation](https://docs.screeps.com/cpu-limit.html).*

What makes it interesting for a programmer is that every RTS problem becomes an engineering problem: logistics, build orders, scaling, error handling, and doing all of it within a CPU budget, in a world where other players' code is trying to do the same thing next door. I have written RTS prototypes before ([RTS Prototype](/blog/rts)); this time the AI *is* the player.

## From the tutorial to a role architecture

The [first commit](https://github.com/florian-noirbent/ScreepsIA/commits/master), on October 22, is a single `main.js` with three roles and a hardcoded spawn order: three harvesters, then two upgraders, then three builders, all with the same `[WORK, WORK, CARRY, MOVE]` body. That is roughly where the in-game tutorial leaves you, and it falls apart as soon as the room grows.

Three days later I moved to the structure I kept until the end. Each creep stores a `role` in its memory, and each role is a module exposing the same small interface:

- `getSpawnInfo(room, creeps)` looks at the room and the existing creeps of that role and answers "I need one more, with this body and this task", or `null`.
- `run(creep)` drives one creep for one tick.
- optional `initialize(creep)` and `onCreepDied(name)` hooks keep counters in memory up to date.

The spawn simply asks each role in priority order and builds the first creep that is needed:

```js
var roles = ['protector', 'hauler', 'harvester', 'upgrader', 'builder',
             'repairer', 'thief', 'colonist', 'scoot', 'attacker'];

for (var i = 0; i < roles.length; i++) {
    var roleFile = require('role.' + roles[i]);
    var spawnInfo = roleFile.getSpawnInfo(spawn.room, /* creeps of that role */);
    if (spawnInfo) {
        trySpawn(spawnInfo);
        break;
    }
}
```

The build order is not written anywhere: it emerges from the priority list and from each role's own conditions. Defense first, then the economy, then growth, then expansion and war. Adding a role means adding a file and a name in the list.

Two helpers make the population self-maintaining. `shouldSpawn` asks for a new creep not only when there are too few, but also when one of them is about to die, while never going more than one above the target:

```js
return (roleCreeps.length < expectedNumber || hasDyingCreep)
    && roleCreeps.length < expectedNumber + 1;
```

So the replacement is already walking to its post when the old creep expires. Harvesters use the same idea: when counting how many creeps already work a source, any harvester with fewer than 45 ticks to live is ignored, so its successor is spawned in time.

## The economy: static mining and haulers

The early-game Screeps pattern is a creep that harvests, walks back to the spawn, unloads, and walks back again. Most of its life is spent walking. I switched early to the pattern known as static mining: split the job between harvesters that never leave their source and haulers that only carry.

When a room becomes one of my main rooms, its sources are recorded once in memory, with their position and the number of free tiles around them:

```js
function getMiningSlot(pos) {
    var terrainArray = Game.rooms[pos.roomName].lookForAtArea(LOOK_TERRAIN,
        pos.y - 1, pos.x - 1, pos.y + 1, pos.x + 1, true);
    return terrainArray.filter((t) => t.terrain == 'plain' || t.terrain == 'swamp').length;
}
```

A source surrounded by walls on five sides can only be worked by three creeps at once, so this count is the physical limit on miners per source. It is stored with each source as `slot`; the actual number of harvesters and haulers per source is a per-source setting in memory (`harvesterCount`, `haulerCount`) that defaults to one, which is the right answer once a harvester is big enough to drain the source alone.

Each source gets a numeric `task`, and every harvester and hauler is assigned to one. The harvester's bodies follow the room's energy capacity, and the thresholds are not arbitrary: 300 energy is a bare spawn, 550 is RCL 2 with its five extensions, 800 is RCL 3 with ten.

```js
var energyAvailable = creeps.length == 0 ? mainRoom.energyAvailable
                                         : mainRoom.energyCapacityAvailable;
if (energyAvailable < 550)      // RCL 1
    var body = [WORK, WORK, CARRY, MOVE];
else if (energyAvailable < 800) // RCL 2
    var body = [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE];
else                            // RCL 3+
    var body = [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE];
```

The RCL 3 harvester costs exactly 800 energy and has six `WORK` parts: five to keep up with the source's 10 energy per tick, one to spare for repairs. It only has two `MOVE` parts because it walks once in its life. The first line handles the worst case: if every harvester is dead, the room no longer refills its extensions, so waiting for full capacity would deadlock the colony. In that case the spawn builds whatever it can afford right now.

![Diagram of how creep body parts appear in game: Work, Attack, Ranged Attack, Heal, Tough and Move, plus the energy the creep carries](/images/blog/screeps-ai/body-parts.webp)

*Image: © Screeps, LLC, from the [Screeps documentation](https://docs.screeps.com/creeps.html).*

Once at its source, a harvester is a two-state machine (`harvest` and `drop`). When full, it looks for a container within two tiles and remembers its id. If the container is damaged and has energy in it, or is close to collapsing, the harvester repairs it with its own energy; otherwise it transfers into it and keeps harvesting in the same tick. If there is no container, it drops the energy on the ground. And if the room has no hauler at all, typically right after a restart, the harvester carries the energy to the spawn itself until haulers exist.

Haulers do the rest. A hauler first picks up dropped energy within three tiles, then withdraws from its source's container, then delivers to the closest spawn or extension that isn't full, to the container next to the controller, or to a tower, with storage as the default. Their body is `[CARRY, CARRY, MOVE]` repeated: an empty `CARRY` part generates no fatigue and roads halve the cost of the full ones, so one `MOVE` for two `CARRY` is enough on roads. One rule is a deliberate safety: towers are only refilled when the room has at least two haulers, so a lone hauler never starves the spawn to fill a tower.

The spawn priority puts haulers before harvesters, but a hauler is only requested for a source that already has a harvester. The result is that the spawn alternates naturally: a harvester for the first source, its hauler, a harvester for the second source, its hauler. The commit "Fix harvester & hauler priority" on November 10 was about getting that interleaving right.

## Building, upgrading, repairing

The other civilian roles are simpler, and they all pull energy from the logistics chain instead of mining:

- **Upgraders** (two by default) withdraw from the container next to the controller, then from storage, then from the spawn only if it is full, and pour everything into the controller. Their bodies grow with the room's energy capacity, and once the storage holds more than 50,000 energy they become an 11-`WORK` body: a surplus of energy turns directly into controller progress.
- **Builders** exist only when there are construction sites, in the main room or in its reserved rooms. They loot dropped energy, then use the closest container or storage, and harvest a source themselves only as a last resort. With nothing left to build, they upgrade the controller instead of idling.
- **Repairers** maintain roads and containers, and only until the room has a tower. After that, the **tower** takes over: it shoots the closest hostile if there is one, otherwise repairs the most damaged structure under 90 % of its hits, then walls and ramparts under 100,000.

When storage passes 200,000 energy, a dedicated "storage" hauler is added to move energy out of it where it's needed.

## Expansion: flags and remote rooms

Expansion is driven by flags, the markers players can place on the map. Every new flag is attached to the nearest main room in memory, and that room becomes responsible for it.

- A `newColony` flag makes the room spawn a colonist with a `CLAIM` part to take the target controller, then two builders who walk there, place the construction site of the new spawn on the flag, and build it.
- Rooms listed in a main room's `reserved` memory get a colonist with two `CLAIM` parts that keeps the reservation above 2,000 ticks, so their sources stay at full capacity.
- A scout (a single `MOVE` part) walks to a `ScootTarget` flag and registers every source it sees in the main room's source list. A remote source becomes active once it is given a task, and from then on it gets its harvester and hauler like a local one. Remote haulers get two extra `WORK` parts and repair the roads around them when they are outside the main room.

Positions are stored serialized in memory (`serializedPos`) and turned back into `RoomPosition` objects when needed. This matters because a script only sees rooms where it has a creep or a structure: a harvester heading to a remote source has to walk to a remembered position, since the source object itself is not reachable until it arrives.

For long trips, colonists compute a route between rooms with `Game.map.findRoute` and a cost callback. My own and reserved rooms cost 1, highway rooms (coordinates that are multiples of 10, which have no controller and therefore no owner) cost 1, and any other room costs 2. The colonist prefers going around unknown territory, where someone else's towers might be waiting.

There are also two more aggressive roles: a "thief" that empties the spawn and extensions near a `DepotThiefFlag` (useful against abandoned rooms), and an attacker that, as of the last commit, dismantles whatever sits under an `AttackFlag` with `WORK` parts, carries the energy home, and removes the flag when done.

## Defense

Every tick, each visible room checks for hostile creeps. If the room is within one room of a main room, it is marked as invaded in memory, with the position of the first hostile. Three things react to that flag:

![A battle around a base, with lines showing attacks between structures and creeps](/images/blog/screeps-ai/tower-defense.webp)

*Image: © Screeps, LLC, from the [Screeps: World Steam page](https://store.steampowered.com/app/464350/Screeps_World/).*

- remote harvesting is suspended: `getAvailableSource` skips sources in invaded rooms, so no new harvester or hauler is sent to die there;
- the nearest main room spawns a **protector**, an `ATTACK`/`MOVE` body sized to the room's energy, which walks to the reported position, fights, and once the room is clear deletes the invasion marker and goes back to be recycled;
- civilian creeps (anything with a `CARRY` part) that see an armed hostile within eight tiles drop what they are doing and head back home. This shared behavior lives in a `role.common` module that runs before every role and can override it; it also handles recycling, where a creep returns to a spawn to get part of its cost back.

The last line of defense is safe mode, which makes a room invulnerable to other players for a while. The tower triggers it when an attacker that isn't one of the game's NPC `Invader`s is in the room and a wall or rampart drops below 35,000 hits:

```js
if (closestHostile.owner.username != 'Invader'
        && findDamagedWalls(tower.room, 35000).length > 0) {
    tower.room.controller.activateSafeMode();
    Game.notify("Safe mode activated in " + tower.room.name + ", attacker: "
                + closestHostile.owner.username);
}
```

NPC invaders are handled by towers and protectors; safe mode is kept for real players, because it can't be used again for a long time once triggered.

## Error isolation and logging

In Screeps, an uncaught exception ends your script for that tick, which means none of your creeps act. One typo in the builder would freeze the miners and the towers too. So since October 26, every room update, every structure update and every creep update in the main loop has its own `try/catch`:

```js
for (var name in Game.creeps) {
    try {
        var creep = Game.creeps[name];
        if (!creep.spawning && !require('role.common').run(creep))
            require('role.' + creep.memory.role).run(creep);
    }
    catch (error) { logger.printError(error); }
}
```

The spawn loop does the same for each role's `getSpawnInfo`. The logger prints the stack trace to the console and also sends it with `Game.notify`, which emails it to me. Since the code runs while I'm away, that email is often the first time I hear something broke. The same channel reports hostiles and safe mode activations.

Memory hygiene is part of this too. At the start of each tick, memory entries of dead creeps and deleted flags are removed, and the dead creep's role gets a chance to run `onCreepDied`, which is how counters like "how many builders are assigned to this flag" stay correct.

## Where it stopped

ScreepsIA is about 1,300 lines of JavaScript written between October 22 and November 12, 2016, in 16 commits. It runs a self-sustaining colony: it bootstraps itself after a wipe, keeps its population topped up, scales bodies with the room level, mines and hauls in remote rooms, and defends itself well enough against NPC invaders.

It is also clearly a month of evenings. Several of the last features are marked untested in the commit messages, like the protector and the flee behavior, and reading the flee code again, the lookup of the home spawn uses the wrong `find` constant. A lot of the strategy is still configured by hand: which remote sources to mine, which rooms to reserve, how many builders or upgraders a room gets are all values I set in memory from the console.

The next steps are already visible in the code:

- **Minerals.** The last commit prepares a 10-`WORK` mineral harvester for rooms with an extractor; the spawn request is written but still commented out.
- **Hauler sizing by distance.** A `TODO` says it: hauler bodies should be computed from the distance between the source and the drop-off, not from a fixed multiplier.
- **Using the mining slots.** The free-tile count is stored for each source but not yet used to decide how many harvesters a source can take before the bodies are big enough to drain it alone.
- **Construction priorities.** Builders take the closest construction site; another `TODO` asks for real priorities.
- **Automatic expansion**, so that the AI picks its own remote rooms from the scout's reports instead of waiting for me.

## Links

- [ScreepsIA on GitHub](https://github.com/florian-noirbent/ScreepsIA)
- [Screeps official site](https://screeps.com/) and [documentation](https://docs.screeps.com/introduction.html)
- [Screeps on Steam](https://store.steampowered.com/app/464350/Screeps_World/)
- [Room control levels](https://docs.screeps.com/control.html) and [CPU limit](https://docs.screeps.com/cpu-limit.html) in the documentation
