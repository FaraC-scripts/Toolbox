# 🧰 Toolbox 🧰

__Toolbox__ is a context management system and robust set of scripted tools for AI Dungeon scenarios. 

This document covers both playing with Toolbox and installing it into your own scenarios.

If you'd like to create a custom adventure and play it with Toolbox, check out the __Universal Generator__ scenario:

${Universal Generator}

If you'd like try out Toolbox in an exampled scenario, check out the __After the End__ scenario:

${After the End}

__User Guide__
- [Tools](#Tools)
- [Detailed Tool List](#Detailed-Tool-List)
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

Requests are sent to the AI alongside instructions for the tool itself, and given high priority. Typically, requests should be the character, subject, or topic you want the tool to focus on. However, they are very flexible and can be used in creative ways, depending on the specifics of the tool. In __Detailed Tool List__ below, additional uses for requests are noted on a per-tool basis.

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

For a brief overview of each tool command and what it does, enter "/list" inside of a Toolbox scenario. For a more detailed look at tools, go to the __Detailed Tool List__ below.

## Detailed Tool List
[🔱 CYOA 🔱](#-CYOA-) - [📷 Snapshot 📷](#-Snapshot-) - [💭 Mindview 💭](#-Mindview-) - [⏩ Fast Forward ⏩](#-Fast-Forward-) - [👤 Protagonist 👤](#-Protagonist-) - [🎬 Direct 🎬](#-Direct-) - [🎴 Card 🎴](#-Card-) - [🔄 Update 🔄](#-Update-) - [🎭 Motive 🎭](#-Motive-) - [💡 Reflect 💡](#-Reflect-) - [💥 Use 💥](#-Use-) - [🗺️ Map 🗺️](#-Map-)

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

The "P" can be changed to "S" to create a traditional story card. Its triggers will be auto-generated, and are not always going to trigger when and where you might like. You should probably review them in the story card itself to make sure they are suitable.

Whether __Card__ defaults to prompt cards or story cards can be changed in __Tool Settings__.

When you use __Card__, a prompt card or story card will be created from the text generated in the output. That text should have a __Title__ and __Type__ line for proper card creation.

If you __undo__ after using __Card__, the generated card will remain in your Story Cards.

If you __retry__ after using __Card__, the generated card will be deleted and a new card will be added to your Story Cards based on the text in retry output.

If you __edit__ the text below and leave it in place (don't undo or retry), that card will be updated to match on your next action (Do, Say, Continue, any tool command, etc.).

__Slash Commands:__ /card or /c

__Output Visibility:__ Defaults to __not seen__ by the AI. To clarify, this means the on-screen output won't be a part of context. The card it generates, however, __will__ be __seen__ by the AI, in the same way a prompt card or story card would normally be seen.

__Default Request:__ the person, place, faction, object, or event most relevant to the scene

__Examples__
> /c
>
> /c Aureth Leafshadow
>
> /c The Shadewood
>
> /c The Burning of the Shadewood

### 🔄 __Update__ 🔄

Update a story card or prompt card.

This command uses a __compound request__. The first part of the request must be the __card name__. The name can be just part of the card's title, and the script will find the nearest-matching card, but for best results use the entire card name. Then, you may optionally include a semicolon followed by _instructions_ on how to update the card.

> /u __The Ossuary Cabal__; _include the losses from their last battle_

If _instructions_ are not included, the update will default to updating the card with information from recent context.

When you receive an Update output, the matched card will already have been updated with the output text. Only fields present in the output text are modified. Other fields are left intact.

If you __Undo__, the updates will be saved.

If you __Retry__, new updates will be generated and applied.

If you want to __edit__ the update, change the output text and take a forward action (__Do__, __Say__, __Continue__, __Story__, __Guide__, or a tool command). The card will be updated with the edited text.

If you want to __restore__ the original card, change U to R on the __Update or Restore?__ line in the output and take a forward action.

__Slash Commands:__ /update or /u

__Output Visibility:__ Defaults to __not seen__ by the AI.

__Default Request:__ random

__Examples__
> /u
>
> /u The Ossuary Cabal
>
> /u Cabal
>
> /u Cabal; include the losses from their last battle

### 🎭 __Motive__ 🎭

Record a character's motivations.

This command uses a __compound request__. The first part of the request must be the __character identifier__. The identifier can be the character's name, or it can be descriptive, e.g., _the hero of the realm_. Then, you may optionally include a semicolon followed by _instructions_ on what the motive should be.

> /u __Edward__; _regarding the Queen's peril_

If _instructions_ are not included, the motive will just be whatever the AI thinks most appropriate given the context.

This is a __partial output tool__, meaning it consumes a small portion of your output, configurable in __Tool Settings__, then continues the story as normal. That small part is the __motive__ created at the top of the output.

> 🎭 Edward: I need to save the Queen from the dracolich before it's too late!

This motive will get recorded immediately at the bottom Edward's card's entry.

> ### Story Card
> Title: 🧍 Edward - Character (Loyal Hero)
> 
> Entry:
> 
> \> Background: a hero of the Queendom of Aval
> 
>  ...
> 
> \> Current Motive: I need to save the Queen from the dracolich before it's too late!

If Edward doesn't have a card, a new 🧠 Edward's Mind card will be created to store his motives and reflections.

If additional __motives__ are added (up to your __motive cap__) the _Current Motive_ will become a _Prior Motive_.

> \> Prior Motive: I need to save the Queen from the dracolich before it's too late!
> 
> \> Current Motive: I need to find the dracolich's phylactery egg to slay it!

If you __Undo__, the motive will remain.

If you __Retry__, the motive will be replaced.

If __edit__ the motive text and take a forward action (__Do__, __Say__, __Continue__, __Story__, __Guide__, or a tool command). The motive will be updated. 

___NOTE:___ Only the text of the motive can be changed, not the name or the character card it is applied to. If you change the name, nothing will happen.

The behavior of __motives__ over time is governed by several options in your __Tool Settings__. 

Your __Motive Cap__ determines how many motives you can have per character. If you add a new one over the cap, the oldest motive is deleted.

Your __Motive Fade__ determines how many outputs motives persist for, after which they will be automatically removed from their respective cards. This can be set to 0 for motives that do not fade.

__Slash Commands:__ /motive or /v

__Output Visibility:__ Produces a partial output that is __not seen__ by the AI in the normal flow of context, but which gets included in a character's Prompt Card or Story Card (and is __seen__ there).

__Default Request:__ the character with the strongest motivations in this scene who doesn't already have an up-to-date motive

__Examples__
> /v
>
> /v Edward
>
> /v the hero of the realm
>
> /v Edward; his plans for lunch

### 💡 __Reflect__ 💡

Record a snippet of a character's thoughts

This command uses a __compound request__. The first part of the request must be the __character identifier__. The identifier can be the character's name, or it can be descriptive, e.g., _the woman in the red dress_. Then, you may optionally include a semicolon followed by _instructions_ on what the reflection should be.

> /u __Sandra__; _how she feels about you asking her to dance_

If _instructions_ are not included, the reflection will just be whatever the AI thinks most appropriate given the context.

This is a __partial output tool__, meaning it consumes a small portion of your output, configurable in __Tool Settings__, then continues the story as normal. That small part is the __reflection__ created at the top of the output.

> 🎭 Sandra: I don't think I want to dance with this guy. He kinda seems like a creep.

This motive will get recorded immediately at the bottom Sandra's card's entry.

> ### Story Card
> Title: 🧍 Sandra - Character (Love Interest)
> 
> Entry:
> 
> \> Background: an accountant working in the suburbs of Toronto.
> 
>  ...
> 
> \> Current Thoughts: I don't think I want to dance with this guy. He kinda seems like a creep.

If Sandra doesn't have a card, a new 🧠 Sandra's Mind card will be created to store her motives and reflections.

If additional __reflections__ are added (up to your __reflect cap__) _Current Thoughts_ will become _Prior Thoughts_.

> \> Prior Thoughts: I don't think I want to dance with this guy. He kinda seems like a creep.
> 
> \> Current Thoughts: Maybe I was too harsh on Edward at first. He's just a little awkward. And he did save the Queen from a dracolich.

If you __Undo__, the reflection will remain.

If you __Retry__, the reflection will be replaced.

If __edit__ the reflection text and take a forward action (__Do__, __Say__, __Continue__, __Story__, __Guide__, or a tool command). The reflection will be updated. 

___NOTE:___ Only the text of the reflection can be changed, not the name or the character card it is applied to. If you change the name, nothing will happen.

The behavior of __reflections__ over time is governed by several options in your __Tool Settings__. 

Your __Reflect Cap__ determines how many reflections you can have per character. If you add a new one over the cap, the oldest reflection is deleted.

Your __Reflect Fade__ determines how many outputs reflections persist for, after which they will be automatically removed from their respective cards. This can be set to 0 for reflections that do not fade.

__Slash Commands:__ /reflect or /x

__Output Visibility:__ Produces a partial output that is __not seen__ by the AI in the normal flow of context, but which gets included in a character's Prompt Card or Story Card (and is __seen__ there).

__Default Request:__ the character with the most to think about right now

__Examples__
> /x
>
> /x Sandra
>
> /x the woman in the red dress
>
> /x Sandra; her favorite way to spend a Sunday afternoon

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
