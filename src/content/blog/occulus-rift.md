---
title: "Developing for the Oculus Rift DK2"
description: "A few weeks of building an Oculus Rift DK2 application during my internship: resolution, motion sickness, the 75 fps requirement, and the missing hands."
date: 2014-11-20
type: devlog
tags:
  - "Oculus Rift"
  - "Student"
cardImage: /images/blog/occulus-rift/occulus-rift-225x300.jpg
---

For a few weeks now, I've had the chance to build an Oculus Rift application during my internship, and I want to share what I've learned.

## The headset itself

Let's start with what everyone else says. The DK2's resolution is better than the first kit's, but there is still a long way to go before it's acceptable (this video shows what you actually see inside the first version: https://www.youtube.com/watch?v=eUbFdUzUYmA). The field of view is also a limitation, and I don't see it improving soon, since widening it would make the resolution problem worse by spreading the same pixels over a larger area.

Then there's the nausea. I don't know why everyone assumes they won't be affected (I did too). Maybe the marketing team did a great job, carefully saying "some people..." every time the subject comes up and regularly announcing that a magical update has fixed it. In practice, everyone gets sick: of about twenty people who tried it here, every single one did. Tolerance varies a lot, though. Some people last ten seconds, others ten minutes on their first try. I've heard it slowly improves with practice, and that seems true: I started at 3 minutes and can now go 8 minutes before feeling anything. Mostly, though, I've learned to avoid everything that makes me sick, and I now barely dare to move my head while wearing it.

![The Oculus Rift DK2 headset](/images/blog/occulus-rift/occulus-rift-225x300.jpg)

## Developer constraints

From a developer's point of view, there are other issues. Cutscenes can't be pre-rendered: since the view follows the player's head, everything has to be rendered in real time. We researched ways around this, but nothing gave acceptable results.

The frame rate can never drop below 75 fps. At a time when more and more console games settle for 30 fps, this requirement is a real shift, especially since stereoscopic rendering needs two images, one per eye, so the software has to render the scene 150 times per second. Add a fairly high resolution (on paper at least), which is set to increase again for the consumer version and the ones after it, until we reach what I consider the acceptable minimum of 4K. Major graphics compromises are unavoidable. And when I say "requirement", I mean it: a single frame dropping even to 70 fps will cut a large chunk off your precious minutes (or seconds) before the sickness kicks in.

## No hands

I wish I had a Razer Hydra or a STEM system (http://sixense.com/wireless). Being in a virtual world without hands is very disorienting. Mouse and keyboard are not intuitive at all and break immersion. VR visualization tools may well have to wait for better input devices before they can really shine.

I realize this paints a rather negative picture. I'm still convinced this is the future, or at least a new branch that will coexist with other media. But it will take at least 5 to 10 years of hardware improvements, and more thought about what this technology is really for.
