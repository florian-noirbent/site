---
title: "Building Portals in Unity"
description: "How I built Portal-style portals for Cursor Machina: a modified mirror shader for rendering, and seamless teleportation that holds up at high speed."
date: 2015-01-16
type: devlog
tags:
  - "Unity"
  - "C++"
  - "Shaders"
  - "Cursor Machina"
  - "Student"
---

I built a portal, as in the game Portal, for my end-of-studies project.

Here is the result:

<iframe src="https://www.youtube-nocookie.com/embed/FlsD2-g8WSM" title="YouTube video" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Rendering

The rendering uses the [mirror shader from the Unity wiki](http://wiki.unity3d.com/index.php/MirrorReflection3) (itself derived from the water reflection package in the standard assets), with a modified projection matrix. A mirror works by rendering the scene from a second camera into a texture that is then displayed on a surface. For a portal, the second camera is not reflected across the surface: it is placed relative to the exit portal the same way the player's camera is placed relative to the entrance, so the texture shows what lies on the other side.

## Moving the character

Next, the character has to actually go through. The portal's trigger volume is fairly large, and while the character is inside it, a continuous check waits for the exact frame where the character's position relative to the portal becomes negative on its forward axis, meaning the character has just crossed the portal's plane. Teleporting at that precise moment makes the transition look seamless and keeps the physics working without a hitch, even at high speed.

Finally, rotating the player and their velocity vector to match the exit portal is just a matter of quaternion multiplications.

As a reminder, the Cursor Machina beta is now available on our website, http://cursormachina.fr/. There is still a lot to do, but the project will be finished soon.
