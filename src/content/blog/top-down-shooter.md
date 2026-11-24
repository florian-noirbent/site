---
title: "Top-Down Shooter: Prototyping a Mobile Wave Shooter in Unity"
description: "Seven months of evenings on a Unity mobile top-down shooter: auto-targeting abilities, an energy loop, waves, loot tables and a tamper-checked save file."
date: 2022-01-18
type: devlog
tags:
  - "Top-Down Shooter"
  - "Unity"
  - "C#"
  - "Mobile"
  - "Prototype"
---

Since June 2021 I have been building a small mobile game on the side, in Unity, whenever an evening was free. It is a top-down shooter played with one thumb: you steer a mage around an arena with a virtual stick, the character fires on its own at the closest enemy, and the level throws waves of monsters at you until the exit opens. Today I pushed a pause menu and the first layout of the main menu shop, which is a good moment to write down where the project stands.

The code is on GitHub: [florian-noirbent/TopDownShooter](https://github.com/florian-noirbent/TopDownShooter).

## The idea: one thumb, auto-aim, and a reason to stop moving

The reference for this kind of game on phones is [Archero](https://apps.apple.com/app/id1453651052) (Habby, 2019): you only control movement, and your archer automatically shoots the nearest enemy, but only while standing still. Every second becomes a choice between dodging and dealing damage. That model works very well on a touchscreen, because a single thumb is enough to play.

I kept the one-thumb, auto-aim part and turned the core tension around. In my prototype, the fireball can be cast while moving but not while standing still (`_canUseImmobile` is off on the fireball ability), and each cast costs one point of energy. Energy only regenerates when you stop:

```csharp
// just stopped moving
if (!_isStopped && Direction == Vector3.zero)
{
    _isStopped = true;
    _energyRegenReferenceTime = Time.time;
}

// regen energy
if (_isStopped && Time.time > _energyRegenReferenceTime + _energyRegenDelay)
{
    if (_energy < _maxEnergy)
        Energy = _energy + 1;
    _energyRegenReferenceTime = Time.time;
}
```

So moving is attacking, and standing still is recharging while the melee mobs close in. The player starts with 5 energy, recovers one point every 2 seconds of immobility, and the HUD shows it as a segmented bar. Energy orbs dropped by enemies are the other way to refill it. Whether this feels better than the Archero rule is exactly what a prototype is for, and it is cheap to flip: it is a couple of booleans on an ability prefab.

## Abilities as phased state machines

Everything that hurts, the player's fireball and the monsters' melee hit, goes through the same `Ability` component. An ability runs through four phases: **cast → execute → recover → cooldown**. Each phase has a duration, an animation trigger, whether the character may move, whether it should face its target, and a priority:

```csharp
[SerializeField] private Phase _castPhase;     // cast: interruptible
[SerializeField] private Phase _executePhase;  // execute: not interruptible, block movement, animation
[SerializeField] private Phase _recoveryPhase; // post execute animation, block movement, GCD
[SerializeField] private Phase _cooldownPhase; // cooldown before ready
```

Walking itself has a priority (100 by default). When the player pushes the stick, the current ability is asked whether movement is allowed, forbidden, or allowed after cancelling the ability. A cast with priority 50 is simply interrupted by walking; an execute phase at 110 or a recovery at 1000 cannot be. Cancelling during the cast returns the ability to ready, cancelling later sends it to cooldown. The resource is consumed at the start of the execute phase, not at the start of the cast, so an interrupted cast costs nothing.

The fireball is 0.5 s cast, 0.2 s execute, 0.4 s recovery and 0.5 s cooldown, all of them allowing movement. The monster melee ability has a 2.5 m range and locks the monster in place for its whole cast, execute and recovery, which gives the player a readable window to get away. Same code, very different feel, all tuned in the inspector. The actual effect is a `UnityEvent` fired at the end of the execute phase, so an ability prefab can instantiate a projectile (`AbilityInstantiate`) or apply damage directly (`AbilityDamage`) without the state machine knowing about it.

## Targeting, enemies and waves

Auto-aim needs a fast answer to "who is the closest enemy?" every frame. Characters register themselves in a `TargetManager`, grouped by team, and the lookup is a plain double loop over lists, written without LINQ or `foreach` so it allocates nothing. On mobile, garbage collection spikes are one of the first causes of stutter, so I try to keep per-frame code allocation-free from the start.

Monsters use Unity's NavMesh to chase the player. Recomputing a path every frame for every mob would be wasteful, so each mob only refreshes its destination every 0.2 s, and only if the player has moved more than half a metre from the last destination. Both values are exposed with a tooltip that says "performance optimisation", so they can be tuned per enemy type.

A level is a set of `MultiSpawner` objects placed in the scene. Each spawner holds a list of entries (wave number, delay, prefab), and the `LevelManager` derives the total number of waves from them. The level state goes Start → Wave → InterWave → … → Finish (or PlayerDead), with 3 seconds between waves. When the last wave is cleared, an exit trigger at the end of the arena becomes active. The top HUD shows the wave counter ("Waves: 1/2") and a progress bar of mobs killed in the current wave.

## Loot and a save file that resists casual editing

When a mob dies it rolls a `LootTableObject`, a ScriptableObject with a minimum and maximum number of drops, an option to allow duplicates, and a list of prefabs with percentage chances. There is already a hook for a player luck stat that shifts the roll. Drops scatter in a random circle around the corpse: health potions, energy orbs, gold coins and large gold coins.

Gold goes into a persistent inventory, the start of a meta progression. The first version (September 26) saved it with `BinaryFormatter`; three days later I replaced it with a hand-written binary format: item count, key/value pairs, and a final check value computed from every field and its index. If the check fails on load, the file is copied aside as `Inventory_corrupt` and the inventory starts empty. It will not stop a determined cheater, but it stops someone from opening the save in a hex editor and typing 99999 gold, which matters as soon as the game has a shop.

## Built for phones

A few decisions are specific to mobile:

- **Controls.** The new Input System maps movement to WASD, arrow keys and a gamepad left stick, and the level scene has an on-screen stick bound to that gamepad stick, so the same `Move` callback serves the editor and the phone. An action button exists but is still a `TODO`.
- **Camera.** A Cinemachine virtual camera, orthographic, with its Y position locked by a small Cinemachine extension. The orthographic size is computed from a fixed horizontal field of view and the screen aspect ratio, so every phone sees the same arena width, whatever its height.
- **Health bars** live on a screen-space canvas and follow their character with `WorldToScreenPoint`, which made resolution handling simpler than world-space canvases.
- **Pause.** Minimising the app (`OnApplicationPause`) opens the pause menu and stops time, and does not resume on its own when you come back.
- **Scenes.** An `Init` scene holds the persistent `GameManager` and inventory. Any scene can be played directly in the editor: if the `GameManager` is missing, it loads `Init` additively.

For the art I am using placeholders: characters, staves and sceptres from a low-poly fantasy asset pack, and simple tiled ground, wood and stone materials. GitHub reports the repository as mostly ShaderLab, but that is only the TextMesh Pro shaders bundled with the project; there is no custom shader work here yet.

## Where it stands

The timeline in the commit history is honest about the pace: a first commit on June 26, 2021, the character model and animations in July, the HUD, waves and NavMesh in mid-August, mobs that can actually kill you on August 26, the movement refactoring and inventory at the end of September, loot in October, then a gap until today's pause menu and main menu. That is about seven months of occasional evenings.

What works: one test level with three spawners and two waves (five mobs in total), a player that moves, auto-casts fireballs and manages energy, melee mobs that chase and hit, death and game over, loot drops, persistent gold, a pause menu and the main menu.

What the code says is next:

- **The shop.** The main menu now has a tab panel with a store layout and an item template (name, price, "Upgrade" and "Reload" buttons), and the top bar shows gold and a "Boost" resource that the inventory already knows about. None of it is wired yet.
- **Equipment.** The player's ability is still hard-coded on the character prefab, with a `TODO` for proper equipment management, so that different staves can carry different abilities.
- **Win and lose logic.** Both reaching the exit and dying currently just return to the menu.
- **More enemies and levels**, now that waves, spawners and loot tables make them a data task rather than a code task.

## Links

- Source code: [github.com/florian-noirbent/TopDownShooter](https://github.com/florian-noirbent/TopDownShooter)
- Reference game: [Archero on the App Store](https://apps.apple.com/app/id1453651052)
