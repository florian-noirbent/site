---
title: "Glass Shatter System: Pattern-Based Window Fracture in Unity"
description: "How my Unity glass system clips a hand-drawn crack pattern on a window, rebuilds the shards as polygons, and extrudes them into meshes that can break again."
date: 2023-04-03
type: technical
tags:
  - "Unity"
  - "C#"
  - "Window Fracture"
  - "Physics"
  - "Procedural mesh"
---

Breaking glass is one of those effects that players notice immediately when it is wrong. Most Unity fracture tools cut arbitrary 3D volumes, which is expensive and rarely looks like a real window. I wanted something narrower and better: a system dedicated to flat panes of annealed glass, the ordinary non-safety glass that splits into long, sharp shards.

The idea comes from Wolfire Games and their talk on how they handle glass in Receiver 2, [An Indie Approach to Breaking Glass](https://www.youtube.com/watch?v=nuHg6_IIyK8). Instead of simulating fracture, you draw the crack pattern by hand, stamp it on the glass at the impact point, and build shards out of the lines. I built my own version in C# over two steps, and this article covers both.

## Step 1: the first working prototype

<iframe src="https://www.youtube-nocookie.com/embed/qfOdgo5QU9I" title="Glass shatter system - 1" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

The first video, from November 2022, shows the core pipeline running: clicking a pane breaks it along a pattern and spawns the shards. It was rough. Physics rules were not in yet, there were glitches, especially when clicking near the edge of the glass, and the pane could not be scaled nor the pattern rotated.

The weeks after that video were mostly about closing those gaps, one commit at a time: glass thickness, random rotation and a set of several patterns, UV propagation, a fix for rotated panes, passing the polygon directly to child shards, a debug visualizer for the clipped pattern, a couple of fixes for degenerate "micro-lines", and support for differently shaped panes.

## Step 2: every edge case covered

<iframe src="https://www.youtube-nocookie.com/embed/d-GVbH1iRUU" title="Glass shatter system - 2" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

The second step is the complete system: UVs carried over to the shards, inherited physics, any glass thickness, any convex 2D pane shape, non-uniform transform scaling, and the glitches from the prototype gone. The rest of this article is how it works.

## How it works

The whole thing is a single entry point:

```csharp
public void Break(Vector3 breakPosition, Vector3 originVector,
                  int patternIndex = -1, float rotation = float.NaN)
```

`breakPosition` is the world impact point. `originVector` is the incoming direction: the raycast direction for a bullet, or the velocity of a physics object, with its magnitude used as the impact strength. The last two parameters are optional. Left at their defaults, a random pattern and a random rotation are picked; passed explicitly, the fracture is fully deterministic, which is what you need to replicate it over the network.

From there, the work happens in four stages, all in 2D until the very end. Geometry relies on [Math.NET Spatial](https://spatial.mathdotnet.com/) for polygons, segments and intersections.

### 1. Turning the pane into a polygon

The pane is a regular mesh lying on the XY plane, centred on Z. To get its outline, I keep only the vertices on the face that was hit (the sign of the local impact Z tells which side), remove the duplicates that belong to the edge sub-mesh, apply the transform's X and Y scale, and sort the points by angle around the origin. That ordered list is the pane polygon. The thickness is read from the Z extent of the mesh multiplied by the Z scale, and the UVs of the outline vertices are kept for later.

This is why the pane can be any convex shape and any size: nothing is hard-coded to a rectangle, and scaling is baked into the polygon instead of being left on the transform.

### 2. Clipping the pattern

A pattern is a mesh with line topology, drawn in Blender on the XY plane. Unity does not import line meshes out of the box, so I use my own exporter and importer from [BlenderTools](https://github.com/florian-noirbent/BlenderTools). Each pattern is rotated, moved to the impact point, and every segment is tested against the pane polygon:

- both ends inside: the segment is kept;
- one end inside: it is cut at its intersection with the pane edge, and the intersection point is recorded;
- both ends outside: it is discarded.

Then the outline is rebuilt from the original polygon vertices plus all the recorded intersection points, sorted by angle. The result is a closed set of segments: the pane border, split wherever a crack reaches it, plus the cracks inside. Pattern lines must extend past the largest diagonal of any pane, otherwise a crack can stop in the middle of the glass and leave an open shape.

### 3. From lines to shard polygons

Now I have a soup of segments and need the closed regions between them. This is face extraction on a planar graph:

1. Every endpoint is merged with existing points within a small tolerance, and each segment becomes a bidirectional link in an adjacency list.
2. Degenerate segments are dropped: a segment whose two ends merged into the same point, or one that duplicates an existing link. These "micro-lines" were the source of most of the prototype's random failures.
3. Each point's neighbours are sorted by angle.
4. To trace a face, start on a link and, at each point, leave by the neighbour that comes right after the one you arrived from. You always turn the same way, so you walk around exactly one region and come back to the start.

Every link used is removed from a consumable copy of the graph. The outer loop, the outline of the whole pane, is traced and thrown away first, starting from the extreme-Y point, which is guaranteed to be on it. Every loop traced after that is a shard. A guard throws an exception if a loop grows past 100 points, so a broken pattern can never hang the game.

### 4. Building the shard meshes

Each shard polygon is recentred on its centroid, and its UVs are computed by barycentric interpolation against the parent's outline. That works because UVs on a flat pane are an affine mapping, so any triangle of the outline gives the right answer; it is also why the back face UVs must mirror the front.

The mesh is an extrusion: a triangle fan for the front face, the same fan reversed at `-thickness` for the back, and a quad per polygon edge for the sides. Front, back and side use separate vertex copies so the edges stay sharp, and the mesh has two sub-meshes, the surface and the edge, so the pane's two materials carry over unchanged.

## Shards that break again

What happens to a shard depends on its surface:

- **Large shards** stay in place as new glass objects. They receive their polygon, UVs and thickness directly from the parent, so breaking them again skips the mesh analysis entirely. This is what makes recursive breaking cheap.
- **Small shards** get a rigidbody with a mass proportional to their surface, continuous collision detection, and the impact force. They are cleaned up after a few seconds, sooner for the tiniest ones.

Every shard also inherits its parent's materials, tag, transform parent and pattern list.

## Why hand-drawn patterns

The hand-drawn approach has no real drawback for this kind of glass, and three clear benefits:

- **Art direction.** You control the look of the cracks completely, instead of getting a generic procedural pattern.
- **Performance.** There is no physics-based fracture, only some 2D geometry and a few small meshes, so it stays lightweight enough for mobile.
- **Variety for free.** Rotating the pattern around the impact point means a handful of drawings is enough to never look repeated.

It is not the right tool for every glass type though. Tempered glass bursts into thousands of small pebbles, and building a unique mesh for each one would be wasteful; an instanced particle effect is better. Laminated glass cracks without falling apart and its cracks overlap, which this system cannot represent; a shader with an impact texture is the better fit there.

## What's next

The system is ready for a free release on the Unity Asset Store. Next, I want to build a premium version with a graph of shards: each shard linked to its neighbours, so that pieces touching the frame stay attached, unsupported ones fall in a cascade instead of floating, and gameplay can react, for example letting a pane collapse after a number of hits. Further out, an in-engine pattern editor would remove the need to go through Blender.

## Links

- [Window Fracture](/assets/window-fracture): the package page for this system
- [Source code on GitHub](https://github.com/florian-noirbent/WindowFracture)
- [BlenderTools](https://github.com/florian-noirbent/BlenderTools): line mesh exporter and importer used for the patterns
- [An Indie Approach to Breaking Glass](https://www.youtube.com/watch?v=nuHg6_IIyK8), by Wolfire Games, the inspiration
