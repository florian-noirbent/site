---
title: "Rosil: Designing a Robot Scripting Language for a Programming Game"
description: "The first block of a PvP programming game inspired by Colobot: a small indentation-based language, its C++ tokenizer, a C# language server and a VS Code extension."
date: 2022-07-07
type: technical
tags:
  - "Rosil"
  - "C++"
  - "Compilers"
  - "Programming game"
  - "VS Code"
cardImage: /images/blog/rosil/robot-illustration.webp
---

[Rosil](https://github.com/florian-noirbent/Rosil), short for "RObot Scripting Language", is the language for a game I want to make: a PvP programming game, where you don't control your robots with a mouse or a gamepad but write the code that drives them, and then watch that code fight the code of another player. Before there can be robots or an arena, there has to be a language, so that is where I started. This article covers the first two weeks of work, from the first sample scripts on June 27 to a language server talking to Visual Studio Code.

![Illustration of a four-legged utility robot with a manipulator arm, antenna and cargo crates, standing on a lunar surface near a base](/images/blog/rosil/robot-illustration.webp)

*The kind of robot a Rosil script would drive: sensors, an arm, cargo, and no human at the controls.*

## The inspiration: Colobot

The idea comes from [Colobot](https://en.wikipedia.org/wiki/Colobot), released in 2001 by the Swiss studio Epsitec. It is a real-time strategy game in which you colonize planets with robots, and you can program those robots yourself, in a language called CBOT that is syntactically close to C++ and Java: a script can send a bot to find titanium ore and bring it back to a converter, or make it defend the base on its own. Epsitec released the source code under the GPL in 2012, and the community keeps it alive as [Colobot: Gold Edition](https://github.com/colobot/colobot).

Colobot is mostly a single-player, educational game. What I find more exciting is the competitive side, where two programs face each other. That genre exists: [Screeps](https://screeps.com/) is an MMO where your JavaScript runs on the server every tick and controls your units against other players (I spent a few weeks on it, see my [Screeps AI](/blog/screeps-ai)), and [CodinGame](https://www.codingame.com/)'s bot programming arenas match your AI against other players' bots and rank you through leagues from Wood to Legend. Both rely on existing general-purpose languages. I want a game closer to Colobot, with robots in a 3D world, but built around player-versus-player fights, with its own language designed for that job.

## Why a custom language

Using Lua, Python or C# would be the pragmatic choice. A dedicated language has advantages for a game, though: I decide exactly what a script can do, what it can access, and how much it costs to run, which matters when two players' programs share a simulation and neither should be able to freeze or exploit it. It is also a project I wanted to do for its own sake: writing a language, from the tokenizer to the tooling, is one of those classic programming exercises I had never done end to end.

## The language, from the samples

The first thing I committed, before any code, was a set of sample scripts with their expected output. They are the specification. Rosil borrows its block structure from Python: a colon opens a block and indentation defines it, with no braces and no semicolons. But it keeps the static types and the class vocabulary of C# and C++, which is what I use every day as a game developer.

```
bool CountDown(int x):
    while x > 0:
        Print("{--x}")
    return true

main():
    Print("Hello world!")
    bool x = CountDown(3)
```

Strings support interpolation with `{}`, directly inspired by C#'s `$"..."` but without the prefix. The class sample shows the rest of the design: enums, private fields with a leading underscore, a static constant dictionary written as an indented block, C#-style properties with `get` and `set`, `public` methods, and single inheritance with `Super`:

```
enum CardinalDirection:
    None
    North
    South
    East
    West

class DirClass:
    CardinalDirection _direction
    float _speed

    public CardinalDirection direction:
        get: _direction
        set value:
            if value != _direction
                _direction = value
                OnUpdate()

    public string ToString()
        return "Direction: {direction}, Speed: {speed}"

class EastChild(DirClass):
    public Init()
        Super(CardinalDirection.East)
```

Members are private unless marked `public`, and `Init` acts as the constructor. Properties were important to me for a robot API: reading `robot.position` or setting `turret.angle` should feel like plain fields while the game runs logic behind them, exactly like the `direction` setter above triggers `OnUpdate`.

## The tokenizer

The core is a C++ library, `RosilCore`, compiled as a DLL. The only stage written so far is the tokenizer, which turns the script into a flat list of tokens. Each token has a code from a single enum, `TokenCode`, which covers literals, arithmetic and boolean operators, assignments, separators, control keywords, types and access modifiers. Recognizing a token is a cascade of lookups, from the longest match to the most generic:

```cpp
// Check for a 2 char token (&&, ==, ...)
const std::string nextTwoChar(charCursor, 2);
const auto twoCharIt = twoCharTokenTable.find(nextTwoChar);
if (twoCharIt != twoCharTokenTable.end())
{
    _tokens.emplace_back(twoCharIt->second, nextTwoChar, _lineIndex);
    charCursor += 2;
    return;
}
```

After two-character operators come single characters (`+`, `:`, `(`), then string literals, then numbers (an integer becomes a float when it contains a dot, and a second dot is an error), and finally labels. A label is matched against a keyword table, so `while`, `return` or `class` get their own token code and everything else stays an identifier. Keywords also have friendly aliases: `and`, `or` and `xor` produce the same tokens as `&&`, `||` and `^`, and `str` is accepted for `string`.

The interesting part is indentation. A parser for a brace language sees `{` and `}`; Rosil has no closing symbol, so the tokenizer has to create one. This is the same trick Python's tokenizer uses with its INDENT and DEDENT tokens. At the start of each line, `CountIndent` counts tabs or groups of four spaces, and the difference with the previous line decides what happens:

```cpp
int indentChange = currentIndentCount - lastIndentCount;
if (indentChange > 1 || indentChange == 1 && _lastLineOpenedContext != true)
    _errors.emplace_back(0, "Indent error.", _lineIndex);
while (indentChange++ < 0)
    _tokens.emplace_back(TokenCode::CloseContext, "", _lineIndex);
```

The `:` token is the `OpenContext`, and the tokenizer remembers that the previous line opened one. Indenting by one level is only legal right after a colon, and every level removed emits one `CloseContext` token. Empty and commented lines are skipped so they don't close blocks by accident. With that, the parser that comes next can treat Rosil blocks exactly like brace-delimited ones. Errors don't stop the run: they are collected with their line number, so an editor can show all of them at once.

## Tooling first: C++/CLI, a language server and VS Code

A programming game lives or dies by its editor. Players will spend more time writing code than watching robots. Today the standard answer is the [Language Server Protocol](https://microsoft.github.io/language-server-protocol/): the language logic runs in a separate process, and any editor that speaks the protocol gets highlighting, errors and completion from it. If Rosil has a language server, the same brain can serve VS Code now and the in-game editor later. That is why I built the tooling this early, right after the tokenizer, rather than after the interpreter: it forces the core to be usable as a library from the start, and it gives me a real editor to write test scripts in.

The language server is written in C# on .NET 6 with the [OmniSharp LanguageServer](https://github.com/OmniSharp/csharp-language-server-protocol) library. To call the C++ tokenizer from C#, I added a small C++/CLI project, `RosilClrWrapper`, which exposes managed `Token` and `Error` types and marshals the script from a .NET `String` to a `std::string`:

```cpp
marshal_context^ context = gcnew marshal_context();
std::string stdScript = context->marshal_as<std::string>(script);
const bool tokenizerSuccess = _nativeTokenizer->Run(stdScript);
```

The server registers three handlers for `*.ros` files. The document sync handler keeps an in-memory copy of each open document, including unsaved edits, and restores the saved version if a file is closed without saving. The semantic tokens handler runs the native tokenizer on that copy, and a completion handler is registered but still empty:

```csharp
public Task<SemanticTokens> Handle(SemanticTokensParams request, CancellationToken cancellationToken)
{
    _tokenizer.Run(_documentCache.Get(request.TextDocument.Uri.ToString()));
    foreach (Token token in _tokenizer.Tokens)
    {
        // TODO build semantic data array to fill SemanticTokens
    }
    ...
}
```

The VS Code extension declares the `rosil` language for `.ros` files and launches the server through `dotnet`. It also ships a TextMate grammar for basic highlighting of strings and control keywords, and a language configuration with `//` comments, bracket auto-closing, and an indentation rule that indents the next line after a trailing `:`, which is exactly the behavior the tokenizer expects.

## Where it stands

After about two weeks, Rosil is a language on paper plus its first stage: the samples define the syntax, the tokenizer handles it with indentation-based blocks and error reporting, and the whole chain from VS Code to the C++ core is wired up. The last commit connects the tokenizer to the language server. Plenty is still marked TODO: token positions within a line are not filled yet, so the semantic highlighting can't be sent to the editor; string interpolation is only tokenized as plain text; incremental document sync and completion are stubs.

The next steps are clear:

- **A parser** that turns the tokens into an abstract syntax tree. The server already has a note to cache the AST per document instead of the raw text, which will unlock real error display and completion.
- **Execution**, through an interpreter or a compiler. Whatever the choice, it has to let the game limit how much work each robot does per tick, so a slow or infinite loop only hurts its owner.
- **The robot API**, the set of classes and properties a script uses to move, sense and shoot, and the sandbox around it, so a script can only touch its own robot.
- **The game itself**: an arena where two players upload their code and watch their robots fight.

## Links

- [Rosil source code on GitHub](https://github.com/florian-noirbent/Rosil)
- [Colobot on Wikipedia](https://en.wikipedia.org/wiki/Colobot) and [Colobot: Gold Edition](https://github.com/colobot/colobot)
- [Screeps](https://screeps.com/) and [CodinGame bot programming](https://www.codingame.com/multiplayer/bot-programming)
- [Language Server Protocol](https://microsoft.github.io/language-server-protocol/) and the [OmniSharp C# implementation](https://github.com/OmniSharp/csharp-language-server-protocol)
