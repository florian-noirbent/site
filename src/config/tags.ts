/**
 * Blog tag taxonomy. Posts keep free-form tags in their frontmatter; every tag
 * is resolved here to a canonical tag in a group, folded into another tag
 * (alias), or hidden. This keeps the filter short and consistent without
 * rewriting old posts.
 *
 * To add a tag: put it under the right group below. Unknown tags still work
 * (they land in "Topics") but log a build warning so they get classified.
 */

export const TAG_GROUPS = [
  { key: "topic", label: "Topics" },
  { key: "tech", label: "Engines & tools" },
  { key: "language", label: "Languages" },
  { key: "platform", label: "Platforms & genres" },
  { key: "project", label: "Projects" },
  { key: "context", label: "Context" }
] as const;

export type TagGroupKey = (typeof TAG_GROUPS)[number]["key"];

/** Order used when a card or article lists its tags (most specific first). */
export const TAG_DISPLAY_ORDER: TagGroupKey[] = ["project", "topic", "tech", "language", "platform", "context"];

export const TAG_UI = {
  /** Tags shown per group in the blog filter before "Show more". */
  filterVisiblePerGroup: 6,
  /** Tags shown on a blog card before "+N". */
  cardMaxTags: 4
} as const;

interface TagDefinition {
  /** Other spellings or narrower tags folded into this one. */
  aliases?: string[];
}

export const TAGS: Record<TagGroupKey, Record<string, TagDefinition>> = {
  topic: {
    AI: { aliases: ["Machine learning", "Genetic algorithm", "Robotics"] },
    Pathfinding: {},
    Shaders: { aliases: ["HLSL", "Cg"] },
    Rendering: { aliases: ["OpenGL", "DX11", "DirectX"] },
    "GPU compute": { aliases: ["DirectCompute", "CUDA", "OpenCL", "Compute shader"] },
    "Procedural generation": { aliases: ["Procedural mesh", "Terrain", "Voxel"] },
    "Physics & simulation": { aliases: ["Physics", "Simulation"] },
    Multiplayer: { aliases: ["Networking"] },
    Architecture: {},
    Compilers: {}
  },
  tech: {
    Unity: {},
    Godot: {},
    "Unreal Engine": { aliases: ["Unreal Engine 4", "Unreal Engine 5", "Blueprint"] },
    XNA: {},
    Core: {},
    Blender: {},
    SFML: {},
    WPF: {},
    "Web stack": { aliases: ["React", "Node.js"] }
  },
  language: {
    "C#": {},
    "C++": {},
    C: {},
    JavaScript: {},
    TypeScript: {},
    Python: {},
    Lua: {}
  },
  platform: {
    Mobile: { aliases: ["Android", "iOS"] },
    Xbox: {},
    VR: { aliases: ["Oculus Rift"] },
    Strategy: { aliases: ["RTS", "Tower defense", "Factory"] },
    "Programming game": { aliases: ["CodinGame"] }
  },
  project: {
    "Claim Earth": {},
    Rocket: {},
    Hopboy: { aliases: ["Hop Boy"] },
    "Cursor Machina": {},
    "End-of-Year Project": { aliases: ["End-of-year project", "PFA"] },
    "Vehicle Shifter": {},
    Bomberman: {},
    "R-type": {},
    Screeps: {},
    Rosil: {},
    "Mars Lander": {},
    "Window Fracture": {},
    "Hex Tile Engine": {},
    "Top-Down Shooter": {},
    "Adventure Game": {},
    Boats: {},
    Beltwork: {},
    "Core Fantasy Arena": {}
  },
  context: {
    Student: { aliases: ["Epitech", "EIP", "Beijing Jiaotong University"] },
    "Game jam": { aliases: ["Ludum Dare", "Trijam"] },
    Prototype: {}
  }
};

/** Tags that add no filtering value (too vague, or already covered by the post type). */
export const HIDDEN_TAGS = ["3D", "Tools", "VS Code", "Game design"];
