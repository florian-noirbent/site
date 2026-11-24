---
title: "Occulus rift"
description: "I'm lucky enough to make an Occulus rift application in my internship for few weeks now and I want to share my experience. First let's talk about what everyone else say: the DK2…"
date: 2014-11-20
type: devlog
tags:
  - "Oculus Rift"
  - "Student"
cardImage: /images/blog/occulus-rift/occulus-rift-225x300.jpg
---

I'm lucky enough to make an Occulus rift application in my internship for few weeks now and I want to share my experience.

First let's talk about what everyone else say: the DK2 resolution is better, but there is still a long way to go before it can be considered acceptable (I found that video showing what we actually see inside the first version: https://www.youtube.com/watch?v=eUbFdUzUYmA). The field of view is also a problem, but I don't see him evolve any soon, and it would make worse the resolution problem. finally the nausea, I don't know why everyone think he won't be concerned (I was too), maybe the marketing team did a great job, insisting heavily on "some people..." in every sentence mentioning it, and announcing every while that a magical update fixed it. In practice everyone get ill, on about twenty persons, everyone single on was... but there is resilience differences, some just need 10 seconds while other can stand it 10 minutes for a first try. I've heard that it get slowly better with training, it seems true since at start I could bear 3 minutes and now 8 minutes before feeling anything, but I mainly learned to avoid to do everything that could make me ill, and now I barely dare to move the head when I wear it.

![occulus rift](/images/blog/occulus-rift/occulus-rift-225x300.jpg)

Now, from a developer view point, there is other issues: cinematics can't be precomputed, everything has to be fully in real-time, we did a lot of research to make that possible but nothing yielded to acceptable results.

The framerate can't drop bellow 75, at the time where more and more console games are satisfied with 30 fps, this imperative of 75fps is quite disturbing, especially since stereoscopic rendering need 2 image, so software need to be able to make 150 scene render each second. add to that a quite large resolution (on paper at least), which promise to be increased again for the official release version and even for next ones until we reach the minimum acceptable of 4k! so huge graphics concession are necessary. When I say "imperative", it's not an overstatement: any drop bellow even if only at 70fps for a frame will slash a considerable part of your precious minutes (/seconds) before the sickness catch up.

I regret not to have a razer hydra, or STEM system (http://sixense.com/wireless) ... being in a virtual world "without hands" is very disturbing. Using mouse and keyboard is not at all intuitive and breaks immersion, virtual reality visualization tools might even have to wait for powerful interfaces to really shine.

I realize that this is a rather negative picture, I am still convinced that this is the future, or at least a new emerging branch that will co-exist with other media, but it will take at least 5 to 10 years of hardware improvement and think more the role of this technology.
