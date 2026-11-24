---
title: "Voxel engine, part 3"
description: "I forgot to publish this article few weeks ago. As said previously, this is the last article about the voxel engine before a while. Voxels I realized that I didn't talked about…"
date: 2013-10-04
type: technical
tags:
  - "Unity"
  - "Voxel"
  - "Terrain"
  - "Student"
cardImage: /images/blog/voxel-engine-part-3/voxelEngineLightning.png
---

I forgot to publish this article few weeks ago. As said previously, this is the last article about the voxel engine before a while.

## Voxels

I realized that I didn't talked about the way data are stored in memory, but it is important to understand how work the lighting.

Each voxel is made of 4 byte :

-1 byte of Type: from the type is deducted a lot, with some lookup tables, for example the texture to use, the transparency, the "traversability", the material, the lighting diffusion properties, etc. A lookup table is just an array holding in formation of each type, the index used being the type, for example to know if a case is transparent: isTransparent\[voxels\[x,y,z\].type\]

-1 byte of subtype, hold additional information: this bit meaning depend of the type, for example for a regular bloc, the subtype will hold the shape and it's orientation.

-2 byte of lighting: each bytes is subdivided in 2, so I get 4 values between 0 and 15, inside are stored the light color in that voxel after the lighting pass (again the lighting information are in a lookup table). These 4 values are red, green, blue and "sun".

## Lighting

To talk a bit more on lighting, these 4 information (RGBS) are then given to the vertex in its color buffer, mixing the colors of the 4 superior voxel that the vertex is the center, depending on its normal.

Why a "sun" channel ? This give the opportunity to make a day and night cycle without recalculating the lighting, the combination being done in the shader. With this technique, we can get artificial light of 4096 distinct colors varying depending of the state of the day/night cycle, also artificial lights can be filtered when they get through some kind of blocs, but the drawbacks is that the sun light can't be decomposed in a filter (a colored glass for example).

Getting this feature would require too much space, before the compute time, it's the RAM usage that need to be optimized in a voxel engine, because there is billions of loaded cubes. For example, right now, 36 864 000 cubes are loaded (this value ignore empty chunk optimization but also the superior suppression distance: 32 x 32 x 32 x 15 x 15 x 5), so the map takes 47 456 000 bytes (or 147 mega), it would still be possible to go from 4 to 8 bytes per voxels (it's loosing smart phone but it's not my goal anyway) but it need to worth it, for a physcis simulation or a fluid simulation, etc. for memory alignment reasons, the voxel size need to be a multiple of 4, so if I decide to add data, I'll have to directly double the storage size.

The light propagation is simple, I already explained the lit-air / dark-air principle for the sun light, them I just loop over the array and for each case casting light, a recursive function is started to propagate it, the intensity is decreased each cell depending of the crossed blocs properties. when each channel is 0 of inferior to the evaluated bloc, the recursion end, the range being of 15 cases maximum (the 4 bits gradient)

![voxelEngineLightning](/images/blog/voxel-engine-part-3/voxelEngineLightning.png)

I don't have any cave to show it's effect right now, but on this screenshot we still can see the ambient occlusion generated automatically with this lighting algorithm: the intensity of a vertex is defined by the average of the 4 surrounded voxels, an opaque bloc being considered as without light, so the corners remove 75% of the light intensity, the edges 50% and the angles 25%.

## Multiples shapes

The result of my experiment on this were pretty average, I tried to decompose my cubes in tetrahedron to see if it could work, so I made some standard tetrahedron with origami to visualize the shape easily but I quickly gave up this to regular tetrahedron this time with blender, result where more interesting but still not what I'd like to have.

![CAM00001](/images/blog/voxel-engine-part-3/CAM00001-768x1024.jpg)

![thetrahedron](/images/blog/voxel-engine-part-3/thetrahedron.png)

Finally I think I'll make a canonical position for each shape, then place it with a matrix (rotation and translation). I originally left aside this possibility because it looked too heavy for a complete terrain, but with my new purpose for this engine, it should be perfect.

I gave up dual contouring before, to follow the example of the Blockscape developers as I said, but in their last articles they said they reworked their engine to use dual contouring, and they said they have a huge performance boost with the obvious enhanced quality result, this made me doubt about the path I chose, maybe I should follow the movement too and give it a second try, but I don't have the time for it right now.
