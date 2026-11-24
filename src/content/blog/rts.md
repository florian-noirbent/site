---
title: "RTS Prototype: Small Armies, Big Decisions"
description: "A Unity real-time strategy prototype built at the end of my second year: micromanagement, units equipped at depots, two resources and a weapon tech tree."
date: 2013-04-27
type: devlog
tags:
  - "Unity"
  - "RTS"
  - "Prototype"
  - "C#"
  - "Student"
cardImage: /images/blog/rts/RTS-prototype-1024x728.png
---

This time I'm presenting a real-time strategy (RTS) game I built with Unity at the end of my second year.

## Concept

The game is set in a slightly futuristic world where two human factions fight for control of the crash site of an alien ship. Armies stay small: a player shouldn't go much above 30 units at once, harvesters included, so the focus is on [micromanagement](http://en.wikipedia.org/wiki/Micromanagement_(gameplay)), the fine control of each individual unit in combat. The maps are enclosed spaces: the first one sits on top of a skyscraper, the second inside an industrial area. The target length of a match is 10 to 20 minutes.

**Gameplay.** The core loop draws on [Populous: The Beginning](http://en.wikipedia.org/wiki/Populous:_The_Beginning) (1998) and [Battle Realms](http://en.wikipedia.org/wiki/Battle_Realms) (2001). A command center spawns a basic unit at regular intervals, and the interval grows with the number of units already in play. These units arrive unarmed and have to equip themselves at three buildings: a weapon depot, an armor depot and a "special" depot. Players therefore shape their army around their own play style. The bazooka from the weapon depot, for example, hits hard but slows its carrier considerably. Add heavy armor and the unit becomes even slower but extremely dangerous; pick light armor instead and it keeps pace with the rest of the army, still powerful but fragile. The special depot was never implemented: it was meant to grant extra abilities such as teleportation, speed or health regeneration.

**Resources.** The economy ended up as a mix of StarCraft and Warcraft III, which hardly need an introduction. There are two resources. To harvest, a player simply leaves any unit near a deposit (I considered making harvesting a dedicated ability). Deposits never run dry, but each one accepts only a limited number of harvesters. The common resource has a large deposit inside the starting base and a medium one just outside. The rare resource comes from small deposits far from the spawn points. Every deposit is guarded by neutral units, the aliens, who attack both players on sight, and some of the routes to the enemy base are guarded as well.

**Tech tree.** The technology tree is deliberately simple: four tiers of basic weapons and armor, researched one after the other. Unlocking a weapon does not hand it out for free; it still has to be bought for each unit that wants to carry it. Basic weapons and armor cost only the common resource to research and buy, while every tier also has an enhanced version that requires the rare one.

![Top-down view of the RTS prototype with units fighting on the skyscraper map](/images/blog/rts/RTS-prototype-1024x728.png)

![Another in-game view of the RTS prototype](/images/blog/rts/RTS-prototype2-1024x779.png)

## Where the project stopped

This is the final look of the game. The project was shelved when the artist I was working with had to leave it for personal reasons. Which gives me a chance to repeat my call: if you are an artist passionate about video games, get in touch!

Apart from the missing assets, the game is fully functional: combat, buying equipment, the tech tree and networking all work. The exception is the fog of war, which caused performance problems and had to be rewritten several times. I didn't know about shaders yet, and computing visibility on the GPU would have been the natural fix.

The truly unexpected challenge was balancing. Getting an interesting game takes a huge amount of work: a rich variety of viable strategies, no matches that stall or can't be finished, and in the end, simply a fun game. Balancing is as much work as programming the gameplay, and I had barely started it. It would have required many people playtesting, which in turn required assets, a master server for matchmaking and a player base. The timing just wasn't right.

I've kept the technical details out of this article since it's already long, but feel free to ask questions in the comments.
