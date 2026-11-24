---
title: "Test using unreal engine 4"
description: "Dernièrement je me forme à l’utilisation de l'unreal engine 4, on peut programmer en C++, mais Epic games à aussi développer un système d'interface nodal pour programmer. J'ai…"
date: 2014-09-15
type: devlog
tags:
  - "Prototype"
  - "Unreal Engine 4"
  - "Blueprint"
  - "Student"
cardImage: /images/blog/test-using-unreal-engine-4/blueprint-AI-1024x543.png
---

Dernièrement je me forme à l’utilisation de l'unreal engine 4, on peut programmer en C++, mais Epic games à aussi développer un système d'interface nodal pour programmer. J'ai d'abord commencé en C++ pour mes premier test, l'interface nodal étant un apprentissage supplémentaire, mais sur cette démo j'en suis arrivé à un projet 100% blueprint (le nom de l'interface). J'ai fait ce choix parce que la programmation en blueprint permet de s'affranchir des temps de compilation (qui sont étonnamment long lorsque l'ont compile un projet UE4) et pour avoir une intégration parfaite avec l’éditeur. Ce qui apporte des temps de prototypage très cours, pour peut que l'ont sache s'en servir efficacement.

Voici à quoi ça ressemble, ceci est le script de mon IA:

![blueprint AI](/images/blog/test-using-unreal-engine-4/blueprint-AI-1024x543.png)

Bien sur c'est un peu plus long à exécuté que du code C++, mais les API blueprint et C++ étant identique il est très facile de réécrire les parties posant des problèmes de performance en C++, une bonne pratique étant à mon avis d'identifier c'est partie au moment de conception (voxel engine, AI élaboré, etc) de les programmer en C++ puis de les exposer au blueprint ou y est programmer le gameplay.

Voici une petite vidéo de de mon projet de tests:

<iframe src="https://www.youtube-nocookie.com/embed/BOVaQUbBcl8" title="YouTube video" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

update: youku miror http://v.youku.com/v\_show/id\_XNzgyOTY4NDYw.html

Le multijoueur est fonctionnel, même si il s'agit de bot. Comme d'habitude si quelqu'un pense que les sources peuvent lui être utile, je me ferrai un plaisir de les partager.
