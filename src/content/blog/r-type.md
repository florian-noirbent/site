---
title: "R-Type: A Multiplayer Remake in C++"
description: "Our team's take on R-Type: a cross-platform C++ remake with a multi-game server and enemies loaded as plugins at runtime."
date: 2013-05-06
type: devlog
tags:
  - "Epitech"
  - "C++"
  - "R-type"
  - "SFML"
  - "Student"
cardImage: /images/blog/r-type/R-Type.png
---

Before I continue with my end-of-year project, here's another game we made this year. I'll be honest: I didn't contribute much to this one. I was busy writing an AI for a Gomoku Ninuki project due at the same time (you'll see it in a future article), so I left this one to the rest of my group.

As with Bomberman, the assignment was to recreate a well-known classic, this time R-Type. If you've never played it, I suggest trying the Flash version right away:

[Play R-Type (Flash version)](http://www.classicgamesarcade.com/game/21604/r-type-flash-game.html)

![Screenshot of the original R-Type](/images/blog/r-type/R-Type.png)

The biggest difference from the original was the required multiplayer mode: a server that runs several games at once and lets many players connect to it, a sort of MMO R-Type. New enemies also had to be addable on the fly through plugins, meaning shared libraries loaded at runtime without recompiling the game. Another key requirement was that the application had to run on both Windows and Linux without relying on portable libraries for that part, so the group had to write its own abstraction layer over each system's APIs.

The version my group delivered was very close to the original, and the multiplayer worked. That's an achievement in itself, given that they had less than ten days and I was mostly unavailable to help.
