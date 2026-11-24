---
title: "RTS"
description: "This time I'll talk about an RTS (real time strategy) I made with Unity at the end of my second year. Concept The game take place in a slightly futuristic world, where 2 human…"
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

This time I'll talk about an RTS (real time strategy) I made with Unity at the end of my second year.

## Concept

The game take place in a slightly futuristic world, where 2 human factions fight for the control of a extraterrestrial ship crash site. It's played with very few units (a player shouldn't be above around 30 units at the same time -with harvesters-) and focus on [micromanagement](http://en.wikipedia.org/wiki/Micromanagement_(gameplay)). The game is played on interiors, the first map is supposed to be at the top of a skyscraper, while the second is in an industrial area. the objective being to have games lasting from 10 to 20 minutes.

**The gameplay** is inspired from [populous](http://en.wikipedia.org/wiki/Populous:_The_Beginning)(1998) and [batlle realms](http://en.wikipedia.org/wiki/Battle_Realms)(2001): a command center spawn a base unit at regular time interval, which is extended with the number of unit in game, these appear unarmed and must equip themselves in different buildings: a weapon depot, an armor depot and a "special" depot. So the player must build it's units according to it's play style, for example the bazooka from the weapon depot is a powerful weapon, but it considerably slow the holder, then the player choose between an heavy armor that'll reduce it's speed even more, but make it an extremely dangerous unit, or choose to equip a light armor to catch up the rest of the army, in this case it's still powerful but fragile. the special depot hasn't been implemented, it was supposed to give additional skills to units like teleportation, speed life regeneration, etc.

**The resources** ended as a mix between stacraft and warcraft III, which no longer need to be introduced. There is 2 resources type, to harvest them, the player just need to leave any unit near the deposits (I thought about adding a special capacity for that), every deposit is infinite, but has a maximum amount of harvesters. the common resource has a large deposit in the starting base and a medium just outside. the rare one is on small deposits far from the spawn. every deposits are protected by neutral (the alien if you follow), units attacking both players at sigh, some path to the enemy base are protected too.

**The technologies tree**, is somewhat simple, there is 4 tiers of simple weapons and armors, that must be researched successively, once a weapon is unlocked, it's then necessary to buy it for each unit that want to equip it. simple weapons and armors only requires the common resource to be researched and bought, but for each tiers there is enhanced version that require the rare resources.

![RTS prototype](/images/blog/rts/RTS-prototype-1024x728.png)

![RTS prototype2](/images/blog/rts/RTS-prototype2-1024x779.png)

Here is the final look, the project was abandonned because the graphist I was working with dropped it because of personal problems... about that, I'm taking this opportunity to pass my advert again :), if you are a graphist passionate by video games, feel free to contact me!

Beside the lack of assets, it's fully functional fight, buying weapons, technological tree, networking) except for the fog of war who caused some performance issue and needed to be rewrited several times, I didn't know about shaders yet.

Another completely unexpected issue was balancing the game, the workload is huge to get an interesting game, with a rich variety of possible strategy, with games not being stuck or unfinishable, and just have a... fun game. It represent as much work as programming the gameplay, I almost didn't start it, I would have need to make a large amount of people test it, but for that I needed assets, a master server, find players, so it was just not the moment yet.

I chose not to dwell on technical stuff since this article is already quite big, but don't hesitate to ask questions in the comments
