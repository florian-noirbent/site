---
title: "First Tests with Unreal Engine 4"
description: "A small multiplayer prototype built entirely with Unreal Engine 4's Blueprint visual scripting, and when it makes sense to drop down to C++."
date: 2014-09-15
type: devlog
tags:
  - "Prototype"
  - "Unreal Engine 4"
  - "Blueprint"
  - "Student"
cardImage: /images/blog/test-using-unreal-engine-4/blueprint-AI-1024x543.png
---

I've recently been learning Unreal Engine 4. You can program it in C++, but Epic Games has also built a node-based visual scripting system called Blueprint. I started with C++ for my first tests, since Blueprint meant learning one more tool, but this demo ended up as a 100% Blueprint project. I made that choice for two reasons: Blueprint avoids compilation times (which are surprisingly long for a UE4 project), and it integrates seamlessly with the editor. The result is very short prototyping times, provided you know how to use it efficiently.

Here's what it looks like. This is the script for my AI:

![The AI script built as a Blueprint node graph](/images/blog/test-using-unreal-engine-4/blueprint-AI-1024x543.png)

Of course, Blueprint runs somewhat slower than C++. But since the Blueprint and C++ APIs are identical, it's very easy to rewrite performance-critical parts in C++. In my opinion, the best practice is to identify those parts at design time (a voxel engine, elaborate AI, etc.), write them in C++, and expose them to Blueprint, where the gameplay is scripted.

Here's a short video of my test project:

<iframe src="https://www.youtube-nocookie.com/embed/BOVaQUbBcl8" title="YouTube video" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Update: [Youku mirror](http://v.youku.com/v_show/id_XNzgyOTY4NDYw.html)

Multiplayer works, even though the other players in the video are bots. As usual, if anyone thinks the source code could be useful to them, I'll be happy to share it.
