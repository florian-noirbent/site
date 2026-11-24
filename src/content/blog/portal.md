---
title: "Portal"
description: "I developed a portal (in the portal way) for my final project. Here is the result: The rendering is done using the mirror shader from the wiki (itself made from the water…"
date: 2015-01-16
type: devlog
tags:
  - "Unity"
  - "C++"
  - "Shaders"
  - "Cursor Machina"
  - "Student"
---

I developed a portal (in the portal way) for my final project.

Here is the result:

<iframe src="https://www.youtube-nocookie.com/embed/FlsD2-g8WSM" title="YouTube video" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

The rendering is done using the [mirror shader from the wiki](http://wiki.unity3d.com/index.php/MirrorReflection3) (itself made from the water reflexion package from the standard assets), with a modified projection matrix.

Still have to move the character:

the hitbox is actually quite big and continuous test make it wait the precise frame where the character position relative to the portal is negative on he forward axis to teleport it, make it look seamless and make sure the physic still work without an inch at high speed.

Finally the rotation of the player and its inertia vector are just quaternion multiplications.

as a reminder, Cursor machina beta is now available on our website http://cursormachina.fr/ and even though there is still a lot to do, the project will be done soon.
