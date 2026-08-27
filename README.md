# 🧰 Toolbox 🧰

__Toolbox__ is a context management system and robust set of scripted tools for AI Dungeon scenarios. 

This document covers both playing with Toolbox and installing it into your own scenarios.

__User Guide__
- [Tools](#Using-Tools)
- [Tool List (Detailed)](#Tool-List-(Detailed))
- [Context Management](#Context-Management)
- [Toolbox Settings](#Toolbox-Settings)
- [Prompt Sequence](#Prompt-Sequence)

__Installation Guide__
- [Installing through AI Dungeon](#Installing-through-AI-Dungeon)
- [Manual Installation](#Manual-Installation)
- [Changing Default Settings](#Changing-Default-Settings)
- [Universal Generator Prompts](#Universal-Generator-Prompts)
- [Acknowledgments](#Acknowledgments)

# User Guide


## Tools

__Tools__ are special scripted functions that offer a wide range of utility.

Tools can be activated by entering slash commands into Do or Say while playing a __Toolbox__ scenario.
> /card

You can also include a __request__ when entering your command.
> /card Deepwater Station

Requests are sent to the AI alongside instructions for the tool itself, and given high priority. Typically, requests should be the character, subject, or topic you want the tool to focus on. However, they are very flexible and can be used in creative ways, depending on the specifics of the tool. In __Tool List__ below, additional uses for requests are noted on a per-tool basis.

When you use a tool, _most_ tools will create a specialized input that is used by the script to execute the tool.
>🔱 Tool: CYOA - Request: The protagonist's next action

Your request __can be edited here__, but the rest of the input should not be modified.

Many tools create an output that is __not visible to the AI__. You can always tell by the following line at the bottom of a tool output:

> Will the AI see this output? (Y/N): N

If you want that output to be __part of the context__ and visible to the AI, change the N to a Y.

This will __treat the output as an aside__, modifying it so that the AI sees something like this:

> \---
> 
> [A brief aside:]
>
> A snapshot of the scene as a whole:
>
> _output text_
>
> \---
> 
> [Resume the story. Address _the protagonist_ in second-person. Continue writing in present tense.]

The above example uses the __Snapshot__ tool as an example. The line "A snapshot of the scene as a whole" will differ from tool to tool. The _output text_ is whatever the bulk of what the AI outputs; in this case it would be a description of what the scene looks like. If you have a story card or prompt card with _Character (Protagonist)_ in the title, their name will be used instead of the more generic _the protagonist_. The perspective and tense requested will check for a __Style__ prompt card, and use the perspective and tense listed there. If there isn't a Style card, it will default to a request to continue with the previous perspective and tense.

For a brief overview of each tool command and what it does, enter "/list" inside of a Toolbox scenario. For a more detailed look at tools, go to the __Tool List__ below.

## Tool List (Detailed)

### 🔱 __CYOA__ 🔱

Get four story progression options to choose between. Once you get those options, you will then have to enter _/a_, _/b_, _/c_, or _d_ into Do or Say to select an option.

__Slash Commands:__ /cyoa or /y

__Output Visibility:__ Defaults to __not seen__ by the AI. The selected option, however, is __seen__ by the AI. 

__Default Request:__ the protagonist's next action

__Examples__
> /cyoa
> 
> /y search for traps
>
> /y a plot twist

### 📷 __Snapshot__ 📷

Get a detailed picture of what the scene, the environment, a character, or anything else looks like.

__Slash Commands:__ /snapshot or /s

__Output Visibility:__ Defaults to __not seen__ by the AI.

__Default Request:__ the scene as a whole 

__Examples__
> /snapshot
>
> /s 

### 💭 __Mindview__ 💭

Get a detailed view of what a character is thinking

__Slash Commands:__ /mindview or /m

__Output Visibility:__ Defaults to __not seen__ by the AI.

__Default Request:__  

__Examples__

### ⏩ __Fast Forward__ ⏩

Move the story forward quickly

__Slash Commands:__ /fastforward or /f

__Output Visibility:__ Defaults to __seen__ by the AI.

__Default Request:__

__Examples__

### 👤 __Protagonist__ 👤

Change the character you play as

__Slash Commands:__ /protagonist or /p

__Output Visibility:__ Defaults to __seen__ by the AI.

__Default Request:__

__Examples__

### 🎬 __Direct__ 🎬

Give instructions on how the scene should progress

__Slash Commands:__ /direct or /t

__Output Visibility:__ Does not produce an output; instead, it modifies an input or adds to an existing output and is always __seen__ by the AI until it has reached its __fade distance__.

__Default Request:__

__Examples__

### 🎴 __Card__ 🎴

Make a story card or prompt card

__Slash Commands:__ /card or /r

__Output Visibility:__ Defaults to __not seen__ by the AI.

__Default Request:__

__Examples__

### 🔄 __Update__ 🔄

Update a story card or prompt card

__Slash Commands:__ /update or /u

__Output Visibility:__ Defaults to __not seen__ by the AI.

__Default Request:__

__Examples__

### 🎭 __Motive__ 🎭

Record a character's motivations

__Slash Commands:__ /motive or /v

__Output Visibility:__ Produces a partial output that is __not seen__ by the AI in the normal flow of context, but which gets included in a character's Prompt Card or Story Card (and is __seen__ there).

__Default Request:__

__Examples__

### 💡 __Reflect__ 💡

Record a snippet of a character's thoughts

__Output Visibility:__ Produces a partial output that is __not seen__ by the AI in the normal flow of context, but which gets included in a character's Prompt Card or Story Card (and is __seen__ there).

__Slash Commands:__ /reflect or /x

__Default Request:__

__Examples__

### 💥 __Use__ 💥

Use an ability, item, or recipe and record the changes

__Slash Commands:__ /use or /e

__Output Visibility:__ Produces a modified output with some lines that are __not seen__ by the AI.

__Default Request:__

__Examples__

### 🗺️ __Map__ 🗺️

See how story cards and prompt cards connect

__Slash Commands:__ /map or /w

__Output Visibility:__ Defaults to __not seen__ by the AI.

__Default Request:__

__Examples__

## Context Management

## Toolbox Settings

## Prompt Sequence

# Installation Guide

## Installing through AI Dungeon

## Manual Installation

## Changing Default Settings

## Universal Generator Prompts

## Acknowledgments
