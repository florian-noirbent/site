---
title: "Voxel engine, part 2"
description: "It's been almost a month I havn't spoken about my voxel engine and it's time for an update. I temporarily dropped compute shaders because I have to few opportunities to work with…"
date: 2013-08-09
type: technical
tags:
  - "Unity"
  - "C#"
  - "Voxel"
  - "Terrain"
  - "Student"
cardImage: /images/blog/voxel-engine-part-2/chunkWater.png
---

It's been almost a month I havn't spoken about my voxel engine and it's time for an update.

I temporarily dropped compute shaders because I have to few opportunities to work with directX 11 hardware to be effective, anyway it's still necessary to have CPU fallbacks for old hardware.

## Chunk Management

Most of the work was for chunk management, now chunks form a network where each chunk has references on each 6 surrounding chunks, moreover they now have 5 states:

- **Initialised**: when the ChunkManager class a chunk to the network, depending of the player's position, this state is defined after the initialisation. the init function lookup for it's 6 adjacents chunks (this lookup offers great optimization perspectives), then for each found chunk the liaison is created for both chunks. in this process, if one of the found chunk has it's links, it is added to tue list of chunk waiting for the voxel generation.

- **VoxelGenerated:** The ChunkManager trigger the voxel generation for every waiting chunk each frame. This state is defined once the voxels are generated. Then the chunk check if any of its linked chunk or himself is now ready for the next phase (every link need to have it's own voxels generated), if that's the case, this chunk is added to the list of chunks waiting for lightning. When serialisation is done, a loading function will replace the generation function for existing chunks, so the player find back its modifications when he retraces its steps.

- **LightningGenerated:** In the same way, ambient lightning will be calculated in this pass, see "lightning" section bellow. For now it imediatly switch to the next state and added to the list of chunks waiting for mesh. see "mesh" section bellow

- **MeshGenerated:** Once the voxels are ready, it's time to build the geometry. This state is applied once the mesh, the collider and the link with Unity are done. at this step the chunk is visible by the player.

- **Disposed:** A somewhat apart state, when a chunk is out of range, it join this state, it's array of voxel join the pool, the mesh is destroyed and the chunk join the pool of chunks, waiting to be recycled for another part of the map.

Array of voxels and chunks are separate because a chunk release it's array if it's empty after the generation part if it's empty, but it still exist as chunk for the network purpose, and if a player try to add a voxel on an empty chunk (build a tower for example), then an empty array is recovered on the fly. This save a lot of space.

This management is multi-thread, only the "link with unity", after a mesh is built is done from the main thread. Make sure everything work without exploding was long and tedious, mostly because it took me a lot of time to discover that unity silently ignore exceptions thrown from threads.

Most of the passes need that the precedent pass to be done for every adjacent chunk, so each pass reduce the view range, for now the strict minimum is implemented, but it limit a lot the possibilities to add more, for example I would like to generated the voxels in multiple pass, but I strongly hesitate to do it.

## Ambient lightning

This part is being designed. It's a complex subject because of the infinite height/depth, the algorithm used in most voxel engines need a fix height, it's main idea is to start sun light from the top of the chunk, to stop it at the first block found, then diffuse it in the 4 horizontal directions. Which obviously don't work for an infinite height.

I got in touch with the block story maker, [who has himself faced this problem](http://www.youtube.com/watch?v=7UPPsALgNCE), he define at the generation time, lit air blocks and dark air blocks, the output is excellent but there is still artefacts, that I consider pretty annoying (even if apparently only few of its players noticed): if you build a close room at the surface, it's still lit inside, now if you fil it and dig again, now it's dark. The idea I got to enhance this is to simply update the air blocks under a modified block. This solve some problems, but brings several others: the depth is theorically infinite so update the blocks on an undefined distance could also be infinite, and some air blocks that should be modified could even not be loaded. These are not insoluble problems, but there will still be artefacts, but invisble for a "normal" usage, I guess.

## Isosurface extraction

First, let's talk about the extraction methods I wanted to test:

[**Adaptive skeleton climbing**](http://www.cse.cuhk.edu.hk/~ttwong/papers/asc/asc.html): This one interested me for the LOD possibilities, but it don't allow to easily transit between LOD's (actually like most of the algorithms) but more importantly it don't allow to edit the voxels nor to add chunks easily without rebuilding the entire terrain, which is unacceptable.

[**Dual contouring**](http://www.frankpetterson.com/publications/dualcontour/dualcontour.pdf): This method is theoretically completely usable, but I couldn't approach acceptable performance yet, having put aside compute shader. As far as I know, the only one in the world that made it is Miguel Cepero, by using openCL (by the way, he just licensed its engine to Sony for everquest next, [annonced earlier this week](https://www.youtube.com/watch?v=cdgPuEl5Nuk)).

Like I said in the previous article about the HLSL noise library, I'll make a voxel engine based on multiple shape (cube, "triangle", etc). For now, I am facing a relatively stupid design problem, yet blocking, each shape need it's own generation function for each possible orientation, which mean I'll need to almost duplicate this generation function hundreds times, so I'm looking for a cleaner way, which would keep maintainability of the code.

## Submesh et transparent voxel

![chunkWater](/images/blog/voxel-engine-part-2/chunkWater.png)

Finally a screenshoot! I integrated transparent voxels and multiple shaders usage to render chunks, here is the result, it's also an opportunity to see the improvement I made on the terrain functions with [Fractional Brownian motion](http://en.wikipedia.org/wiki/Fractional_Brownian_motion). I also made mipmap available for DX10+ graphics card, this solve the texture flickering problem existing in the POC.

![voxelEngine](/images/blog/voxel-engine-part-2/voxelEngine.png)

## Mesh Collider optimization

Finally, I optimized mesh collider, as seen in this screenshoot (I added a block in the second to illustrate the modification that happen when the terrain is edited):

![chunkCollider](/images/blog/voxel-engine-part-2/chunkCollider-1024x460.png)

For now it's not applied to the rendering mesh (blue mesh), I need to wait for lightning , since it need to keep some vertices, for the light gradient to be correct, I don't know if it will be a necessary optimization.

I did not found any information about doing this optimization, while it's mentioned everywhere, but that's actually relatively straightforward, instead of generating the geometry per block, it's generted per face, a bool array tell if a block face as been generated, one just need to iterate along a direction until a bloc already generated or don't need do be, then try the other direction with the defined length until a block already generated or don't need to be, the length from the first direction, the length from the second and the starting point define a rectangle, which you generate, without forgetting to mark each voxels as generated, then continue to iterate on the voxel array to find another voxel that need to be generated and not yet done. This pattern is reproduced until the end of the array is found by the main iteration, then this is done for each face. It's short, but (hopefully) concise.

While writing this article, I realized that it wouldn't be a problem if some part of the quad collider where overlapping or inside the geometry, for example, when I added the bloc on the screen, we could just add a quad on the top without modifing the rest of the collider, I'll look into it.

For now this is only done for the top face, here again I'm looking for a way to avoid to duplicate this code, especially because this algorithm should evolve a lot when with the integration of new shapes.
