---
title: "A Peer-to-Peer Chess Game in WPF"
description: "A small multiplayer chess game built in a day with WPF for a peer-to-peer networking project at Beijing Jiaotong University."
date: 2013-10-28
type: devlog
tags:
  - "C#"
  - "WPF"
  - "Beijing Jiaotong University"
  - "Student"
cardImage: /images/blog/chess-game/ChessConnectionpng-1024x579.png
---

Here is a small multiplayer chess game I wrote today for a peer-to-peer networking project. The interface is built with WPF. The two players connect directly to each other, with no central server in between.

The connection dialog:

![Chess game connection dialog](/images/blog/chess-game/ChessConnectionpng-1024x579.png)

A game in progress (a trained eye will judge the skill of both players from these openings):

![A chess game in progress](/images/blog/chess-game/ChessGame-1024x579.png)

It's missing an AI opponent and a 3D board, but networking was the subject today.

We could choose between Western chess and Chinese chess (象棋, xiangqi, as opposed to 西洋棋, "Western chess"). I went with Western chess, because the rules of the Chinese version look rather convoluted. Here is the board, and [the rules are here](http://www.chessvariants.org/xiangqi.html):

![Chinese chess (xiangqi) board](/images/blog/chess-game/free-vector-chinese-chess-clip-art_105147_Chinese_Chess_clip_art_hight.png)
