# 🧰 Toolbox 🧰

__Toolbox__ is a context management system and robust set of scripted tools for AI Dungeon scenarios. 

This document covers both playing with Toolbox and installing it into your own scenarios.

If you'd like to create a custom adventure and play it with Toolbox, check out the __Universal Generator__ scenario:

${Universal Generator}

If you'd like try out Toolbox in an exampled scenario, check out the __After the End__ scenario:

${After the End}

__User Guide__
- [Tools](#Using-Tools)
- [Tool List (Detailed)](#Tool-List)
- [Context Management](#Context-Management)
- [Critical Components](#Critical-Components)
- [Toolbox Settings](#Toolbox-Settings)
- [Prompt Sequence](#Prompt-Sequence)
- [Tool Scheduling and Automation](#Tool-Scheduling-and-Automation)

__Installation Guide__
- [Installing through AI Dungeon](#Installing-through-AI-Dungeon)
- [Manual Installation](#Manual-Installation)
- [Changing Default Settings](#Changing-Default-Settings)
- [Universal Generator Prompts](#Universal-Generator-Prompts)
- [Use-and-Acknowledgments](#Use-and-Acknowledgments)

# User Guide


## Tools

__Tools__ are special scripted functions that offer a wide range of utility.

Tools can be activated by entering slash commands into Do or Say while playing a __Toolbox__ scenario.
> /card

You can also include a __request__ when entering your command.
> /card Deepwater Station

Requests are sent to the AI alongside instructions for the tool itself, and given high priority. Typically, requests should be the character, subject, or topic you want the tool to focus on. However, they are very flexible and can be used in creative ways, depending on the specifics of the tool. In __Tool List__ below, additional uses for requests are noted on a per-tool basis.

When you use a tool, _most_ tools will create a specialized input that is used by the script to execute the tool.
>📷 Tool: Snapshot - Request: the scene as a whole

Your request __can be edited here__, but the rest of the input should not be modified.

Many tools create an output that is __not visible to the AI by default__. You can always tell by the following line at the top of a tool output:

> 👁️‍🗨️ Visible to AI? (Y/N): N

If you want that output to be __part of the context__ and visible to the AI, change the __N__ to a __Y__.

__Visible tool outputs will be treated as an aside__, modifying it so that the AI sees something like this:

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

"A snapshot of the scene as a whole" will differ from tool to tool. The _output text_ is whatever the bulk of what the AI outputs.

If you have a story card or prompt card with _Character (Protagonist)_ in the title, their name will be used instead of the more generic _the protagonist_. The perspective and tense requested will pull from your __Style__ prompt card or default to generics.

The final line, the directive to continue the story, will only be added to context for 1-2 outputs after the tool output. 

For a brief overview of each tool command and what it does, enter "/list" inside of a Toolbox scenario. For a more detailed look at tools, go to the __Tool List__ below.

## Tool List

### 🔱 __CYOA__ 🔱

Get four story progression options to choose between. Once you get those options, you will then have to enter _/a_, _/b_, _/c_, or _d_ into Do or Say to select an option.

__Slash Commands:__ /cyoa or /a

__Output Visibility:__ The set of options default to __not seen__ by the AI. The selected option is __always seen__ by the AI. 

__Default Request:__ _the protagonist_'s next action

__Examples__
> /y
> 
> /y search for traps
>
> /y a plot twist

### 📷 __Snapshot__ 📷

Get a detailed picture of what the scene, the environment, a character, or anything else looks like.

__Slash Commands:__ /snapshot or /s

__Output Visibility:__ Defaults to __not seen__ by the AI. The default visibility of this tool can be changed in __Tool Settings__.

__Default Request:__ the scene as a whole

__Examples__
> /s
>
> /s Cori
>
> /s a close-up of your face
>
> /s Cori as she hits a home run
> 
> /s a top-down view of the baseball field

### 💭 __Mindview__ 💭

Get a detailed view of what a character is thinking, in the form of a first-person inner monologue. 

__Slash Commands:__ /mindview or /m

__Output Visibility:__ Defaults to __not seen__ by the AI. The default visibility of this tool can be changed in __Tool Settings__.

__Default Request:__  _the protagonist_

__Examples__
> /m
>
> /m Karim
>
> /m Karim puzzling out the cryptic message
>
> /m your shock when you realize your sister is the Bloody Balloon Killer

### ⏩ __Fast Forward__ ⏩

Move the story forward quickly, then resume after a summary of intervening events.

__Slash Commands:__ /fastforward or /f

__Output Visibility:__ Defaults to __seen__ by the AI.

__Default Request:__ the next scene

__Examples__
> /f
> 
> /f the wedding
>
> /f three weeks later
>
> /f when you wake up the next morning
> 
> /f Tav arriving late to the royal wedding


### 👤 __Protagonist__ 👤

Change the character you play as. This command will also alter the titles of __prompt cards__ and __story cards__. If a card currently has the _(Protagonist)_ role, that text will be changed to _(Supporting Character)_. If the new protagonist has a card with their name and " - Character" in the title, that card will be given the _(Protagonist)_ role. This role is used to help keep the AI on track in a few different ways. See [Critical Components](#Critical-Components)

__Slash Commands:__ /protagonist or /p

__Output Visibility:__ Defaults to __seen__ by the AI.

__Default Request:__ a random named character other than _the protagonist_

__Examples__
> /p
> 
> /p James
>
> /p James Kerrington

### 🎬 __Direct__ 🎬

Give instructions to the AI on how the scene should progress. This command creates a specialized input as such:

> \[Scene instructions: _request_.]

These special _scene instructions_ are subject to a configurable __fade distance__ set in __Tool Settings__. Scene instructions further back in context than the fade distance (in terms of output count) are hidden from the AI.

__Slash Commands:__ /direct or /d

__Output Visibility:__ Does not produce an output; instead, it modifies an input or adds to an existing output and is always __seen__ by the AI until past its __fade distance__.

__Default Request:__ slow the pace of narration and pay attention to detail

__Examples__
> /t
> 
> /t focus on writing dialogue
>
> /t you eat the Multi-Berry NutriCube. It's terrible.
> 
> /t Lucia tries to pilot the Mule into position, but a thruster misfires

### 🎴 __Card__ 🎴

Make a story card or prompt card based on a requested topic.

By default, a __prompt card__ is created. Prompt cards don't use triggers, and by default always appear in context behind a certain number of paragraphs. They are configurable in __Context Settings__ and __Prompt Sequence__.

In the card tool's output, just below the visibility line, there will be this:

> 🎴 Story Card or Prompt Card? (S/P): P

The "P" can be changed to "S" to create a traditional story card. Its triggers will be auto-generated, and you should probably review them in the story card itself to make sure they are suitable. 

__Slash Commands:__ /card or /c

__Output Visibility:__ Defaults to __not seen__ by the AI. To clarify, this means the on-screen output won't be a part of context. The card it generates, however, __will__ be __seen__ by the AI, in the same way a prompt card or story card would normally be seen.

__Default Request:__

__Examples__
>
>
>
>
>

### 🔄 __Update__ 🔄

Update a story card or prompt card

__Slash Commands:__ /update or /u

__Output Visibility:__ Defaults to __not seen__ by the AI.

__Default Request:__

__Examples__
>
>
>
>
>

### 🎭 __Motive__ 🎭

Record a character's motivations

__Slash Commands:__ /motive or /v

__Output Visibility:__ Produces a partial output that is __not seen__ by the AI in the normal flow of context, but which gets included in a character's Prompt Card or Story Card (and is __seen__ there).

__Default Request:__

__Examples__
>
>
>
>
>

### 💡 __Reflect__ 💡

Record a snippet of a character's thoughts

__Output Visibility:__ Produces a partial output that is __not seen__ by the AI in the normal flow of context, but which gets included in a character's Prompt Card or Story Card (and is __seen__ there).

__Slash Commands:__ /reflect or /x

__Default Request:__

__Examples__
>
>
>
>
>

### 💥 __Use__ 💥

Use an ability, item, or recipe and record the changes

__Slash Commands:__ /use or /e

__Output Visibility:__ Produces a modified output with some lines that are __not seen__ by the AI.

__Default Request:__

__Examples__
>
>
>
>
>

### 🗺️ __Map__ 🗺️

See how story cards and prompt cards connect

__Slash Commands:__ /map or /w

__Output Visibility:__ Defaults to __not seen__ by the AI.

__Default Request:__

__Examples__
>
>
>
>
>

## Context Management

## Critical Components

## Toolbox Settings

## Prompt Sequence

## Tool Scheduling and Automation

# Installation Guide

## Installing through AI Dungeon

## Manual Installation

## Changing Default Settings

## Universal Generator Prompts

## Use and Acknowledgments
