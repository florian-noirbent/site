---
title: "Voxel Engine, Part 3: Voxel Data and Lighting"
description: "How each voxel fits in 4 bytes, how colored and sun light propagate through the terrain, and my first experiments with non-cubic block shapes."
date: 2013-10-04
type: technical
tags:
  - "Unity"
  - "Voxel"
  - "Terrain"
  - "Student"
cardImage: /images/blog/voxel-engine-part-3/voxelEngineLightning.png
---

I forgot to publish this article a few weeks ago. As I mentioned before, it will be my last article about the voxel engine for a while.

## Voxels

I realized I never explained how the data is stored in memory, and it matters for understanding how the lighting works.

Each voxel takes 4 bytes:

- **1 byte for the type.** A lot is derived from the type through lookup tables: the texture to use, transparency, whether entities can pass through it, the material, how it diffuses light, and so on. A lookup table is simply an array holding one entry per type, indexed by the type. For example, to know whether a cell is transparent: `isTransparent[voxels[x, y, z].type]`.
- **1 byte for the subtype**, which holds additional information. Its meaning depends on the type; for a regular block, for example, the subtype stores the block's shape and orientation.
- **2 bytes for lighting.** Each byte is split into two 4-bit halves, which gives four values between 0 and 15. They store the light in that voxel after the lighting pass (the lighting properties themselves are, again, in a lookup table). The four values are red, green, blue and "sun".

## Lighting

These four values (RGBS) are then passed to the vertices through the mesh's color buffer. Each vertex is shared by four voxels on the side its face points to (the direction of its normal), and the vertex color is the mix of those four voxels' light.

Why a "sun" channel? It makes a day/night cycle possible without recomputing the lighting, since the combination happens in the shader. With this technique, artificial light can take 4,096 distinct colors (16 levels for each of the three channels), independently of where the day/night cycle is. Artificial light can also be filtered when it passes through certain blocks, but the drawback is that sunlight can't be split into colors by a filter (colored glass, for example).

Supporting that would take too much space. In a voxel engine, RAM usage needs optimizing even before compute time, because tens of millions of cubes are loaded at once. For example, I currently load 36,864,000 voxels: chunks of 32 × 32 × 32 voxels, in an area of 15 × 15 × 5 chunks. This figure ignores the empty-chunk optimization, and also the fact that chunks are unloaded at a greater distance than the one they're loaded at. The map therefore takes 147,456,000 bytes, about 147 MB. Going from 4 to 8 bytes per voxel would still be possible (phones would be out of reach, but they aren't my target anyway), but it would have to be worth it, for a physics or fluid simulation, for example. For memory alignment reasons, the voxel size has to be a multiple of 4 bytes, so adding any data at all means doubling the storage.

Light propagation is simple. I already described the lit-air/dark-air principle for sunlight. For the other lights, I loop over the voxel array, and for each light-emitting cell I start a recursive function that spreads its light. The intensity decreases at each cell depending on the properties of the blocks it crosses. The recursion stops when every channel is equal to or lower than the light already in the cell being evaluated, so a light reaches at most 15 cells (the range of a 4-bit gradient).

![Voxel terrain showing the ambient occlusion produced by the lighting](/images/blog/voxel-engine-part-3/voxelEngineLightning.png)

I don't have any caves to show the full effect yet, but this screenshot already shows the ambient occlusion that falls out of this lighting algorithm for free. A vertex's intensity is the average of its four surrounding voxels, and an opaque block counts as having no light. So a vertex in an inside corner, where three of the four voxels are opaque, loses 75% of its intensity; a vertex along an edge where two are opaque loses 50%; and a vertex with a single opaque neighbor loses 25%.

## Multiple shapes

My experiments here gave fairly average results. I tried decomposing my cubes into tetrahedra to see whether that could work. I folded some tetrahedra in origami to visualize the shapes easily, but soon switched to regular tetrahedra, this time in Blender. The results were more interesting, but still not what I'm after.

![Origami tetrahedra used to visualize the shapes](/images/blog/voxel-engine-part-3/CAM00001-768x1024.jpg)

![Regular tetrahedra modeled in Blender](/images/blog/voxel-engine-part-3/thetrahedron.png)

In the end, I think I'll define each shape once in a canonical position, then place it with a matrix (rotation and translation). This also solves the code duplication problem from [part 2](/blog/voxel-engine-part-2), since one generation function per shape covers every orientation. I originally set this option aside because it looked too heavy for an entire terrain, but with the new direction I've chosen for this engine, it should be perfect.

I gave up on dual contouring earlier, following the Blockscape developers' example. In their latest articles, however, they explain that they reworked their engine to use dual contouring and got a huge performance boost, on top of the obvious gain in quality. That made me question the path I've chosen. Maybe I should follow suit and give it a second try, but I don't have time for it right now.

*The source code of this engine is archived on [GitHub](https://github.com/florian-noirbent/voxelTerrain).*
