---
title: "Hop Boy: Our First Mobile Game and Its Procedural Level Generator"
description: "Hop Boy, the first mobile game from SupremApp, is out on Android and iOS. Here is how its infinite tower is assembled from tagged, rule-driven modules."
date: 2016-08-04
type: devlog
tags:
  - "Hopboy"
  - "Unity"
  - "Mobile"
  - "Android"
  - "Procedural generation"
---

A little over a year ago, a friend and I decided to start making mobile games. I waited until I had something concrete to show before writing about it, and now I do: our first game, Hop Boy, is out on Android and iOS.

<iframe src="https://www.youtube-nocookie.com/embed/VdsMrNF2yJk" title="Hop Boy" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## A long road to a first release

I will probably write a separate article about the journey and why it took us so long to get here. The short version: I worked on six different game prototypes and with at least five artists along the way (freelancers, an artist based in India, an intern, and so on). My partner handles the administrative side, finding artists, buying music and sound effects, game design, testing and marketing, while I focus on development.

## The game

Hop Boy is an infinite runner that goes up instead of sideways. You tap to make the character jump and climb as high as possible, avoiding the obstacles in his way and picking up the gems he finds. Gems let you continue after dying and unlock new characters. The game is deliberately hard. You can read more about it on its [game page](/games/hopboy).

## Where the time actually went

Real development on Hop Boy started in early February. Honestly, most of the work was not gameplay at all but integration: analytics, ad networks, Google Play Games, Game Center, in-app purchases. Anyone who has shipped a free-to-play mobile game knows this part is long, unglamorous and unavoidable. It is not very interesting to write about, though, so I would rather talk about the part I enjoyed most: the procedural level generation.

## Procedural generation from modules

The basic idea is simple. I built a set of hand-made modules, short sections of tower, split into four difficulty levels. As the character climbs, new modules are instantiated "randomly" above him. To avoid building everything twice, a module can be mirrored left/right when it is instantiated, which doubles the content for free.

I quickly realized that pure randomness did not produce a good climb. Some stretches were too repetitive, and some sequences of modules were simply impossible to get through: the end of one module and the start of the next could combine into a jump no player could make. This is the classic problem with assembling levels from chunks. Each chunk is fine on its own, but nothing guarantees the seams are.

## A generic engine for infinite levels

To fix this I wrote a generic engine for generating infinite levels, one I have already started reusing in other games we have in development. It works in two layers.

**Tags.** Each module carries a list of tags that describe it. The tag list itself is not hard-coded: it is created dynamically in the Unity inspector, so every game can define its own vocabulary. In Hop Boy, the tags include:

- "left" or "right", the side of the first obstacle in the module;
- the difficulty: "start", "easy", "medium" or "hard";
- whether the module contains a gem;
- whether it is rather "short" or "long".

**Rules.** On top of the tags, an algorithm, also defined dynamically in the inspector, sets the rules for which modules may appear next. Because both the tags and the rules live in data rather than in code, adjusting the shape of a level is a design task, not a programming task.

The goal was to take back as much control over the level design as possible while keeping the generation procedural. Pure hand-made levels run out; pure randomness gives you garbage and impossible seams. Rules over tagged modules sit between the two: designers decide what is allowed to follow what, and the randomness only chooses among acceptable options.

This reuses ideas from my [end-of-year project at Epitech](/blog/end-of-year-project-part-2), a modular roguelike proof of concept where dungeons were assembled from modules built in a custom editor. Back then, modules were connected using only which of their sides opened onto a neighbor, and I noted that I wanted more constraints per module. This engine is that idea, carried a lot further.

## Current limits and next steps

For now the engine only works with booleans. The rules filter the modules down to a list of candidates, then an ordinary uniform random picks the next module from that list. Every valid candidate has the same chance of appearing.

We have several infinite runner projects in development, and I plan to keep reusing and improving this system. The next step is to specify spawn probabilities depending on the circumstances, a weighted random instead of a uniform one, so the shape of the levels can be tuned even more finely. For example, a module could be allowed but rare at a given moment, rather than just allowed or forbidden.

## Try it

Hop Boy is free on [Android](https://play.google.com/store/apps/details?id=fr.supremapp.hopboy) and [iOS](https://itunes.apple.com/us/app/hop-boy/id1076690375). Give it a try, and I am looking forward to your feedback. Alongside my other projects, I am also working on an update for Hop Boy.
