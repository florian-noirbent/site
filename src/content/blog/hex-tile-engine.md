---
title: "Hex Tile Engine: Painting Hexagonal 3D Terrain in the Unity Editor"
description: "A Unity tool from 2015 that builds chunked 3D meshes for a hexagonal map, with cliffs, beveled edges and a brush to paint tiles in the scene view."
date: 2019-02-07
type: technical
tags:
  - "Hex Tile Engine"
  - "Unity"
  - "C#"
  - "Procedural mesh"
  - "Tools"
---

In spring 2015 I wrote a hexagonal tile engine for Unity: a component that turns a grid of hexagons, each with a terrain type and a height, into 3D meshes, plus the editor tooling to paint that map directly in the scene view. I put it on GitHub in December and upgraded it from Unity 5.2 to Unity 2018.3 this week, so it is a good moment to describe how it works and where it stopped.

The code is here: [HexTileEngine on GitHub](https://github.com/florian-noirbent/HexTileEngine).

## Why I built it

A few months earlier I had written [Hexa](/blog/hexa), a 2D hexagonal tile engine in C++ and SFML with A\* pathfinding. It taught me the math of hex grids, mostly the hard way. This time I wanted the opposite trade-off: no engine of my own, but a reusable Unity tool for 3D hexagonal maps that a level designer could actually use. The goal was something you drop into a project, create a map from a menu, pick a brush and paint terrain, the way Unity's own terrain tool works.

The repository description says "as unity package", and that was the intent: a self-contained set of scripts and assets to reuse across games. In practice it is still a full Unity project with a test scene, not a Package Manager package. There is no `package.json`, no assembly definition and no tests yet.

The last 2015 commit hints at the kind of game I had in mind. It adds a `PawnControler` with three fields:

```csharp
[SerializeField] private float _climbMaxHeight;
[SerializeField] private float _fallMaxHeight;
[SerializeField] private float _movementPoint;
```

Movement points and maximum climb and fall heights are the rules of a turn-based tactics game on terrain with elevation. The pawn registers itself on the tile under it and snaps to that tile's height, but movement and pathfinding were never written.

## The coordinate system

Red Blob Games' [guide to hexagonal grids](https://www.redblobgames.com/grids/hexagons/) is still the reference I recommend, and the engine follows its vocabulary even where it does not say so.

The tiles are pointy-top hexagons, and each tile is addressed with **axial coordinates**: two integers `(x, y)` on two axes that are not perpendicular. The `y` axis goes up a row, and each row is shifted half a tile to the right. A third **cube** coordinate exists implicitly (`s = -x - y`), which is what makes hex distances and rounding easy, but this engine never uses it. Converting a tile to a world position is a linear transform:

```csharp
return new Vector3(coordinate.x * Hexagon.Scale.x + coordinate.y * 0.5f * Hexagon.Scale.z,
                   0,
                   coordinate.y * 0.75f * Hexagon.Scale.z);
```

Rows are 0.75 tile apart because pointy-top hexagons interlock vertically. One simplification: my hexagon is exactly as wide as it is tall (one unit, scaled by 10), while a regular pointy-top hexagon is only √3/2 as wide as it is tall. The tiles are about 15% wider than regular, which nobody notices on a game board and keeps every vertex on a quarter-unit grid.

With axial coordinates the six neighbours are always the same six offsets, whatever the row:

```csharp
neighbours[0] = hexaData[coordinate.y + 1, coordinate.x - 1];
neighbours[1] = hexaData[coordinate.y + 1, coordinate.x];
neighbours[2] = hexaData[coordinate.y,     coordinate.x + 1];
// ... (+1,-1), (0,-1), (-1,0)
```

That is the main advantage over **offset coordinates**, where odd and even rows have different neighbour offsets.

The map itself is hexagon-shaped. It is stored in a square array of `(2n - 1) × (2n - 1)` cells, and `Contains` rejects the two corners that fall outside the hexagon. Red Blob describes this exact layout in its map storage section: a few array cells are wasted, but indexing stays a plain `y * width + x`.

### Picking a tile from a world position

Turning a world position back into a tile uses the same idea as in Hexa. Inverting the linear transform gives an approximate tile, but its "hitbox" is a parallelogram, not a hexagon. So the code takes that tile and its four axis neighbours, measures the distance from the point to each center, and keeps the closest one. In Hexa I lost half a day measuring those distances in skewed coordinates. This time they are measured in world space, with `Vector3.Distance` on converted positions.

It works, but the method still carries a `// TODO: Use math to make this function cleaner.` The clean answer is in the same Red Blob guide: convert to fractional cube coordinates and round them, correcting the component with the largest rounding error. That is exact, with no candidate list, and it would also cover the two diagonal neighbours that my five-candidate check skips.

## Mesh generation

Rendering one GameObject per tile would quickly cost too many draw calls, so the terrain is split into **chunks** of 16 × 16 tiles, each with one `Mesh`. I used the same chunk idea in my [voxel engine](/blog/voxel-engine-part-1), and it brings the same problem at chunk borders, more on that below.

Each tile adds its own geometry to its chunk's mesh data:

- **The top** is a fan of six triangles around a center vertex, from lookup tables of positions and UVs.
- **The sides** are only generated on faces that can be seen: when the neighbour is lower or missing. Each side goes down to the neighbour's height, or 10 units below zero on the map's border.
- **The edge** is an optional band at the top of the cliff with its own material, used as a transition between the grass on top and the rock on the side. A `SizeMultiplier` below 1 shrinks the top face, which turns that band into a bevel.

```csharp
bool IsSideVisible(Hexagon neighbour, HexagonTypeData types)
{
    return neighbour == null ||
           neighbour.Height < this.Height - HexagonUtils.FloatEpsilon;
}
```

The bevel took three commits, "Edge fix 1" to "Edge fix 3". A top vertex is pulled inward only when the two faces it touches are both visible. When just one of them is, the vertex has to slide along the hidden side to meet the neighbouring tile, otherwise you get gaps or spikes at inner corners. `ComputeVertexRelativePosition` handles those four cases.

### Materials and UVs

Terrain types live in a `HexagonTypeData` ScriptableObject. Each type has a name, three materials (top, edge, side), an edge height, a size multiplier and a side texture repeat frequency. The test project has grass, dirt, rock, sand, snow and water materials with royalty-free test textures.

A chunk uses one mesh with several **submeshes**, one per material. Several types often share a material (every type in the test data uses the same rock for its sides), so `GetMaterials()` builds a list without duplicates and stores each type's index into it. Fewer submeshes means fewer draw calls.

For the sides, the bottom UV depends on the height of the cliff:

```csharp
1 - (bottomEdgeHeight - baseLevel) * types[_typeID].SideLoopFrequency
```

so the rock texture repeats along a tall cliff instead of stretching. Vertices also get a color (white for now), and the custom `HexaShader` multiplies the albedo by it, ready for per-tile tinting such as highlighting reachable tiles. Normals come from `Mesh.RecalculateNormals()`.

## Editor tooling

Most of the work went into making this usable without writing code:

- **Window > Create Hexagonal terrain** opens an editor window that creates the two assets (`HexTerrainData` for the tiles, `HexagonTypeData` for the types) and a `HexTerrain` GameObject that builds the chunks.
- A **custom inspector on `HexagonTypeData`** lists every type with fields for its materials and parameters, and an "Add new type" button.
- A **custom inspector on `HexTerrain`** is the painting tool: a mask to choose what the brush writes (type, height, or both), a type dropdown, a height slider, an edit mode toggle and a "Force rebuild" button.

When edit mode is on, `OnSceneGUI` takes over mouse input in the scene view: it casts a ray from the mouse onto the ground plane, converts the hit point to a tile and edits it. When dragging, it paints along a line between the previous and the current mouse positions, so a fast stroke does not leave holes. Every edit marks the containing chunk as dirty, and only dirty chunks are rebuilt.

Map data is a ScriptableObject because it survives editor restarts and script reloads. The first version saved the array with `BinaryFormatter` to a `.hex` file; that code is still in the repository, commented out. Another 2015 commit message reads "Fix hot reload of C# assemblies in editor (awake => onEnabled)": with `[ExecuteInEditMode]` components, `Awake` is not called again after a script recompile, but `OnEnable` is, so event bindings and mesh references have to be restored there.

## Where it stopped

The engine does what I first set out to do: you create a map, define terrain types and paint a 3D hex landscape with cliffs and beveled edges in a few minutes. The known gaps are clear from the code:

- **Picking uses the ground plane**, not the terrain. On high tiles, the brush lands on a different tile than the one under the cursor.
- **Chunk borders**: editing a tile only dirties its own chunk, but a height change also changes its neighbour's cliffs. A neighbour in the next chunk stays stale until a full rebuild.
- **`HexagonTypeData` uses `UnityEditor`** in a runtime script, so it has to move behind `#if UNITY_EDITOR` before a player build, and before it can become a real package.
- **No pathfinding and no tests**. The pawn has its rules but does not move.

When my current project, [Boats](/blog/boats), needed a hexagonal grid for its stations in December, I did not reuse this engine. I wrote a small `CubeCoord` struct with proper cube coordinates and rounding, referencing the Red Blob guide directly. That is the main lesson of going from Hexa to this engine and then to Boats: start from cube coordinates and do the math instead of searching among candidates. If I come back to the Hex Tile Engine, that is where I will start, followed by picking against the real terrain and the move to a proper Unity package.

## Links

- Source code: [florian-noirbent/HexTileEngine](https://github.com/florian-noirbent/HexTileEngine)
- My earlier 2D engine: [Hexa, a hexagonal tile engine with A\* pathfinding](/blog/hexa)
- Red Blob Games: [Hexagonal Grids](https://www.redblobgames.com/grids/hexagons/)
- Unity manual: [ScriptableObject](https://docs.unity3d.com/Manual/class-ScriptableObject.html)
