---
title: "Adventure Game: Lock-On Targeting and Items for a Zelda-Like in Unreal C++"
description: "A third-person Zelda-like prototype in Unreal Engine: Z-targeting style lock-on, auto-jump off ledges, a data-driven item and equipment system, menus and settings, ported from UE 4.27 to UE5."
date: 2022-05-15
type: devlog
tags:
  - "Adventure Game"
  - "Unreal Engine"
  - "C++"
  - "Prototype"
---

Adventure Game is a prototype of an old-school Zelda-like that I have been building in Unreal Engine. The source is on GitHub: [florian-noirbent/AdventureGame](https://github.com/florian-noirbent/AdventureGame). It is small, about a thousand lines of C++ plus Blueprints and widgets, but it already has the parts that make the genre feel right in your hands: a character that moves and jumps like a 3D Zelda hero, a lock-on targeting system, an inventory of items you can equip, and the whole shell around the game (main menu, pause menu, settings, loading screen).

## Which Zelda

"Old-school Zelda" can mean two very different games. The [original Legend of Zelda](https://en.wikipedia.org/wiki/The_Legend_of_Zelda_(video_game)) (1986) and its 2D successors are top-down: you explore a map screen by screen, dungeons are locked behind keys and items, and combat is a sword swing in four directions. The other branch starts with [Ocarina of Time](https://en.wikipedia.org/wiki/The_Legend_of_Zelda:_Ocarina_of_Time) (1998), which moved all of that into 3D and had to invent new controls to make sword fighting work with a camera behind the character.

My prototype is clearly in the second branch. The character has a spring-arm camera behind it, rotated by the mouse or the right stick, and moves relative to that camera, like Unreal's third-person template the project started from. The two mechanics I spent the most code on are the ones Ocarina of Time is known for: target lock, which Nintendo called [Z-targeting](https://zeldawiki.wiki/wiki/Z-Targeting), and a character that jumps on its own when it runs off a ledge.

## Why Unreal, and why C++

My [first contact with Unreal](/blog/test-using-unreal-engine-4) was in 2014: a small multiplayer prototype in UE4, written entirely in Blueprint. My conclusion at the time was that gameplay belongs in Blueprint and that C++ is for the parts that need performance. This project was a chance to test the opposite split on a real game structure: write the gameplay framework in C++ (character, controller, components, item classes) and keep Blueprints for content: specific items, equipped weapons, animations and UI.

It was also a way to learn the newer Unreal systems. The project uses the [Enhanced Input](https://dev.epicgames.com/documentation/en-us/unreal-engine/enhanced-input-in-unreal-engine) plugin instead of the old axis and action mappings, [Gameplay Tags](https://dev.epicgames.com/documentation/en-us/unreal-engine/using-gameplay-tags-in-unreal-engine) to classify actors, the Asset Manager to register items as primary assets, and a custom `UGameUserSettings` for audio settings. It started on Unreal Engine 4.27 and the last commit ports it to Unreal Engine 5.0.

## Lock-on targeting

Every tick, while the camera is not locked, the character sweeps a sphere from the camera boom along the camera's direction (1,000 units long, 300 units of radius) and keeps the first actor carrying the `Targetable` gameplay tag:

```cpp
UKismetSystemLibrary::SphereTraceMulti(
    GetWorld(), Start, End, TargetScanRadius, TraceTypeQuery1, false,
    {this}, EDrawDebugTrace::None, HitResults, true);

for (const auto& HitResult : HitResults)
{
    const auto TagInterface = Cast<IGameplayTagAssetInterface>(HitResult.GetActor());
    static auto TargetTag = FGameplayTag::RequestGameplayTag("Targetable");
    if (TagInterface && TagInterface->HasMatchingGameplayTag(TargetTag))
    {
        BestTarget = HitResult.GetActor();
        break; // TODO: multi target priority
    }
}
```

Using a tag instead of a class means anything can become a target: an enemy, a sign, a chest. The tag is declared in the project config with the comment "Every 3D object that can get a focused cursor", and both the character and a small `AGameplayActor` base class implement `IGameplayTagAssetInterface`.

When the target changes, the character notifies the target's `UTargetableComponent`, which spawns a cursor actor above it and bobs it up and down with a cosine of time. That is my version of Navi hovering over the enemy. The component only ticks while the cursor exists:

```cpp
const float VerticalOffsetAnimation =
    CursorAmplitude * FGenericPlatformMath::Cos(GetWorld()->GetTimeSeconds() * CursorFrequency);
CursorActorInstance->SetActorRelativeLocation(FVector(0, 0, VerticalOffsetAnimation));
```

Holding the lock button freezes the current target, disables the mouse look, and turns the controller toward the target every frame with an interpolated rotation, so the camera swings around smoothly instead of snapping:

```cpp
const FRotator RotationToTarget = UKismetMathLibrary::MakeRotFromXZ(Direction, FVector::UpVector);
const FRotator AppliedRotation =
    FMath::RInterpTo(Controller->GetControlRotation(), RotationToTarget, 12 * DeltaTime, 1);
Controller->SetControlRotation(AppliedRotation);
```

Since movement is relative to the camera, locking also changes how the character moves: forward goes toward the target and left/right circles around it, which is the basis of Zelda-style sword fighting.

## Movement: auto-jump and walking

In Ocarina of Time there is no jump button: Link jumps automatically when he runs off an edge. I kept a jump button, but I also override `OnWalkingOffLedge` so that running off a ledge triggers a jump. Holding the walk key slows the character down (a 0.3 speed multiplier) and lets it simply drop off the edge instead. It is a small detail, but it changes how platforming feels: running means committing to the jump, walking means being careful.

## Items and equipment

Items are data. `UItem` is an abstract `UPrimaryDataAsset` with everything the UI needs: a display name, a description, a thumbnail for the inventory, a mesh for when it lies on the ground, and an action text ("Use, Equip, Eat, etc" says the comment), a nod to Zelda's context-sensitive action button. Behavior is a `BlueprintImplementableEvent`, so each concrete item is scripted in Blueprint.

`UEquipment` extends it for things held in hand. It names an actor class to spawn and a socket to attach it to (usually `hand_r`). Activating an equipment toggles it, and the character spawns the weapon actor and snaps it to the skeletal mesh:

```cpp
EquippedActor = GetWorld()->SpawnActor<AActor>(Equipment->EquipedActor.Get(), Location, Rotation);
if (EquippedActor != nullptr)
    EquippedActor->AttachToComponent(GetMesh(), FAttachmentTransformRules::SnapToTargetIncludingScale,
        Equipment->AttachSocketName);
```

The action button (left mouse) calls `Use` on the equipped item, which forwards to the Blueprint `OnUse` event. The content folders show two items so far, a sword and a fire sword (`DBP_SwordItem`, `DBP_FireSwordItem`), with matching equipped actors, inventory icons, and a sword slash animation for the character.

The inventory itself is a `UInventoryComponent` that lives on the player controller rather than on the character, so that it survives the character's death and respawn. It broadcasts an `OnInventoryUpdated` delegate that the inventory widget listens to. For testing, it fills itself from a list of default items at `BeginPlay`.

## The game shell

A surprising share of the project is not gameplay at all. The first commit already contains a main menu, a pause menu, a settings screen with video, audio and control panels (including a key binding picker); the loading screen came the next day. Audio volumes (master, effects, music) are stored by a custom `UAgGameUserSettings` class, registered in `DefaultEngine.ini`, with Blueprint-callable getters and setters.

I also wrote a small reusable popup in C++. `UPopupSpawner` is a `UBlueprintAsyncActionBase`, which shows up in Blueprint as a single node with an output that fires when the popup closes. The popup can have a countdown, and it uses real time rather than a timer, because a timer would stop while the game is paused, which is exactly when menus and confirmation popups are shown.

## Where it stopped

The history is short: a first commit on 29 April 2022 with the movement and targeting prototype, the menus and the settings; the loading screen the next day; and on 15 May 2022 the upgrade to Unreal Engine 5. The port itself was easy. The C++ change was the switch from `HitResult.Actor.Get()` to `HitResult.GetActor()`, and I took the opportunity to hook audio settings into `ApplyNonResolutionSettings` (the actual mixing code is still a stub).

The level assets are simple geometry: floors, cubes, ramps, stairs and bumps to test movement, plus a dummy actor (`BP_Dummy`), presumably the first thing to lock on to. Nothing in the code or the asset names covers enemy AI, dungeon rooms, keys or doors, or items to pick up in the world yet. The code also lists what comes next: target priority when several targetable actors are in the sweep, moving item activation into the inventory system, and removing the dependency of equipment on the character class.

The same weeks I also wrapped up [Core Fantasy Arena](/blog/core-fantasy-arena), a Guild Wars style arena in Core, whose last commit is from the same day. Core runs on Unreal Engine 4, and the two projects approach the same problem from opposite ends: tab targeting and a skill bar scripted in Lua on top of someone else's framework in one, a lock-on camera and item system written from scratch in Unreal C++ in the other.

## Links

- Source code: [florian-noirbent/AdventureGame](https://github.com/florian-noirbent/AdventureGame)
- My first Unreal prototype: [First Tests with Unreal Engine 4](/blog/test-using-unreal-engine-4)
- The other prototype from the same weeks: [Core Fantasy Arena](/blog/core-fantasy-arena)
- [Z-Targeting on Zelda Wiki](https://zeldawiki.wiki/wiki/Z-Targeting)
- [The Legend of Zelda: Ocarina of Time on Wikipedia](https://en.wikipedia.org/wiki/The_Legend_of_Zelda:_Ocarina_of_Time)
