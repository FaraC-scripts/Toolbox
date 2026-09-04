# 🧰 Toolbox 🧰

__Toolbox__ is a context management system and robust set of scripted tools for AI Dungeon scenarios. 

This document covers both playing with Toolbox and installing it into your own scenarios.

If you'd like to create a custom adventure and play it with Toolbox, check out the __Universal Generator__ scenario:

[https://play.aidungeon.com/scenario/Kj-pypp8vkwc/universal-generator?share=true&published=true](https://play.aidungeon.com/scenario/Kj-pypp8vkwc/universal-generator?share=true&published=true)

__📕 User Guide 📕__
- [🛠️ Tools](#Tools)
- [👁️‍🗨️ Tool Visibility](#Tool-Visibility)
- [🧩 Compound Requests](#Compound-Requests)
- [🔎 Detailed Tool List](#Detailed-Tool-List)
- [🗂️ Context Management](#Context-Management)
- [⚙️ Toolbox Settings](#Toolbox-Settings)
- [📋️ Prompt Sequence](#Prompt-Sequence)
- [📅 Tool Scheduling and Automation](#Tool-Scheduling-and-Automation)

__📥 Installation Guide 📥__
- [⚡ Installing through AI Dungeon](#Installing-through-AI-Dungeon)
- [⬇️ Manual Installation](#Manual-Installation)
- [⚙️ Changing Default Settings](#Changing-Default-Settings)
- [💬 Universal Generator Placeholders](#Universal-Generator-Placeholders)
- [🎉 Use and Acknowledgments](#Use-and-Acknowledgments)

# 📕 User Guide 📕

<h2 id="Tools"><strong>🛠️ Tools 🛠️</strong></h2>

__Tools__ are special scripted functions that offer a wide range of utility.

Tools can be activated by entering slash commands into Do or Say while playing a __Toolbox__ scenario.
> /card

You can also include a __request__ when entering your command.
> /card Deepwater Station

Requests are sent to the AI alongside instructions for the tool itself, and given high priority. Typically, requests should be the character, subject, or topic you want the tool to focus on. However, they are very flexible and can be used in creative ways, depending on the specifics of the tool. In __Detailed Tool List__ below, additional uses for requests are noted on a per-tool basis.

When you use a tool, _most_ tools will create a specialized input that is used by the script to execute the tool.
>📷 Tool: Snapshot - Request: the scene as a whole

Your request __can be edited here__, but the rest of the input should not be modified.

For a brief overview of each tool command and what it does, enter _/list_ inside of a Toolbox scenario. For a more detailed look at tools, go to the [Detailed Tool List](#Detailed-Tool-List) below.

<h2 id="Tool-Visibility"><strong>👁️‍🗨️ Tool Visibility 👁️‍🗨️</strong></h2>

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

<h2 id="Compound-Requests"><strong>🧩 Compound Requests 🧩</strong></h2>
The __Update__, __Motive__, and __Reflect__ tools accept __compound requests__.

__Compound requests__ have two parts, an __identifier__ and __instructions__, separated by a semicolon.

The identifier is always required. The instructions are always optional.

> /update James's Background; include what he shared about his childhood

In this case, the __identifier__, _James's Background_, determines the card to update.

The __instructions__, _include what he shared..._, determine what sort of updates to make. 

<h2 id="Detailed-Tool-List"><strong>🔎 Detailed Tool List 🔎</strong></h2>

[🔱 CYOA 🔱](#-CYOA-) - [📷 Snapshot 📷](#-Snapshot-) - [💭 Mindview 💭](#-Mindview-) - [🗺️ Map 🗺️](#-Map-) - [⏩ Fast Forward ⏩](#-Fast-Forward-) - [👤 Protagonist 👤](#-Protagonist-) - [🎬 Direct 🎬](#-Direct-) - [🎴 Card 🎴](#-Card-) - [🔄 Update 🔄](#-Update-) - [🎭 Motive 🎭](#-Motive-) - [💡 Reflect 💡](#-Reflect-) - [💥 Use 💥](#-Use-) - [🌐 Relationships 🌐](#-Relationships-) 

### 🔱 __CYOA__ 🔱

Get four story progression options to choose between. Once you get those options, you will then have to enter _/a_, _/b_, _/c_, or _d_ into Do or Say to select an option.

__Slash Commands:__ /cyoa or /a

__Output Visibility:__ The set of options default to __not seen__ by the AI. The selected option is __always seen__ by the AI. 

__Request Type:__ the type of options you want

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

__Request Type:__ what you want a picture of

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

__Request Type:__ the character you want to see inside

__Default Request:__  _the protagonist_

__Examples__
> /m
>
> /m Karim
>
> /m Karim puzzling out the cryptic message
>
> /m your shock when you realize your sister is the Bloody Balloon Killer

### 🗺️ __Map__ 🗺️

Get a description of an area's layout, connections, and points of interest.

__Slash Commands:__ /map or /w

__Output Visibility:__ Defaults to __seen__ by the AI.

__Request Type:__ the location to map

__Default Request:__ _the protagonist's_ current location

__Examples__
> /w
>
> /w Red Willow Tavern
>
> /w The Blighted Marches
>
> /w The Shattered Realms

### ⏩ __Fast Forward__ ⏩

Move the story forward quickly, then resume after a summary of intervening events.

__Slash Commands:__ /fastforward or /f

__Output Visibility:__ Defaults to __seen__ by the AI.

__Request Type:__ the destination

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

__Request Type:__ the character to switch to

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

__Request Type:__ the scene instructions

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

If you __edit__ the text below and leave it in place (don't undo or retry), that card will be updated to match on your next action (__Do__, __Say__, __Continue__, etc.).

__Slash Commands:__ /card or /c

__Output Visibility:__ Defaults to __not seen__ by the AI. To clarify, this means the on-screen output won't be a part of context. The card it generates, however, __will__ be __seen__ by the AI, in the same way a prompt card or story card would normally be seen.

__Request Type:__ the card topic

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

If you want to __edit__ the update, change the output text and take a forward action (__Do__, __Say__, __Continue__, etc.). The card will be updated with the edited text.

If you want to __restore__ the original card, change U to R on the __Update or Restore?__ line in the output and take a forward action.

__Slash Commands:__ /update or /u

__Output Visibility:__ Defaults to __not seen__ by the AI.

__Request Type:__ the name of the card to update

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

> ### 🧍 Edward - Character (Loyal Hero)
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

If you __edit__ the motive text and take a forward action (__Do__, __Say__, __Continue__, etc.). The motive will be updated. 

___NOTE:___ Only the text of the motive can be changed, not the name or the character card it is applied to. If you change the name, nothing will happen.

The behavior of __motives__ over time is governed by several options in your __Tool Settings__. 

Your __Motive Cap__ determines how many motives you can have per character. If you add a new one over the cap, the oldest motive is deleted.

Your __Motive Fade__ determines how many outputs motives persist for, after which they will be automatically removed from their respective cards. This can be set to 0 for motives that do not fade.

__Slash Commands:__ /motive or /v

__Output Visibility:__ Produces a partial output that is __not seen__ by the AI in the normal flow of context, but which gets included in a character's Prompt Card or Story Card (and is __seen__ there).

__Request Type:__ a character name

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

If you __edit__ the reflection text and take a forward action (__Do__, __Say__, __Continue__, etc.). The reflection will be updated. 

___NOTE:___ Only the text of the reflection can be changed, not the name or the character card it is applied to. If you change the name, nothing will happen.

The behavior of __reflections__ over time is governed by several options in your __Tool Settings__. 

Your __Reflect Cap__ determines how many reflections you can have per character. If you add a new one over the cap, the oldest reflection is deleted.

Your __Reflect Fade__ determines how many outputs reflections persist for, after which they will be automatically removed from their respective cards. This can be set to 0 for reflections that do not fade.

__Slash Commands:__ /reflect or /x

__Output Visibility:__ Produces a partial output that is __not seen__ by the AI in the normal flow of context, but which gets included in a character's Prompt Card or Story Card (and is __seen__ there).

__Request Type:__ a character name

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

Use an ability, item, or recipe and record the changes.

This tool will attempt to generate and record __costs__ and __gains__ as the result of the requested action, as well as provide a textual description of the outcome of the action.

__Costs__ and __gains__ will only be included and can only be recorded if the _protagonist_ has _resources_ and/or _inventory_ prompt cards. If your protagonist is named Anise, the script will look for prompt cards or story cards with the following titles (the emojis aren't required):
> 🪙 Anise's Resources
> 
> 💼 Anise's Inventory

If one or both of these cards are found, __costs__ will be deducted from them and __gains__ will be added to them.

If you __Undo__, the cost and gain changes will remain.

If you __Retry__, the cost and gain changes will be updated.

If you __edit__ the costs and gains and take a forward action (__Do__, __Say__, __Continue__, etc.), the changes will be updated. 

__Slash Commands:__ /use or /e

__Output Visibility:__ Produces a modified output with some lines that are __not seen__ by the AI.

__Request Type:__ what is being used

__Default Request:__ the ability or item best suited to the situation

__Examples__
> /u
>
> /u Magic Missile
>
> /u Lesser Healing Potion
>
> /u Recipe: Lesser Healing Potion
>
> /u loot the dead goblins

### 🌐 Relationships 🌐

See how story cards and prompt cards connect.

This tool uses the relationships built by Generate (if that option is kept on) between cards that mention one-another. As a very simple example if you have _Ashen Veil - World_ and _The Verdant Marrow - Region_, and The Verdant Marrow has the field _Within: Ashen Veil_, the _Ashen Veil_ component will get the following field: _Regions: The Verdant Marrow_. Then, when you use __Relationships__, it will output the following:

> 🌎 Ashen Veil (World)
> 
> \> Regions: The Verdant Marrow

Some of the components that can have their relationships mapped with _/r_, in the hierarchical order in which they are mapped: _World_, _Region_, _Location_, _Faction_, _Event_, _Species_, _Character_,  _Item_

__Slash Commands:__ /relationships or /r

__Output Visibility:__ Defaults to __not seen__ by the AI.

__Request Type:__ none

__Default Request:__ none

__Examples__
> /r

<h2 id="Context-Management"><strong>🗂️ Context Management 🗂️</strong></h2>

Toolbox adds a number of elements to the context sent to the AI every action. Each element can be turned on or off in the __Context Settings__ story card. The number of tokens they use are also listed there, as well as in _/help_

- __Default Instructions:__ a large set of generic writing guidelines
- __Prompt Cards:__ the contents of story cards with the "Prompt" type
- __Basic Personification:__ instructions encouraging complex characters
- __Advanced Personification:__ more extensive instructions added after the story card or prompt card for each character
- __Echo Ban:__ a strong instruction aimed at preventing repetitive outputs
- __Imperative:__ a very strong instruction to move the story forward
- __Boundary Markers:__ small notations that help separate context elements

<h2 id="Toolbox-Settings"><strong>⚙️ Toolbox Settings ⚙️</strong></h2>

[Tool Settings](#Tool-Settings) - [Context Settings](#Context-Settings) - [Misc Settings](#Misc-Settings)

- Settings for Toolbox can be found and edited in your Story Cards, near the bottom
- Settings are broken up into three Settings cards
  - __Tool Settings:__ manages how tools function, with both general and tool-specific settings
  - __Context Settings:__ manages the various elements Toolbox adds to context every turn
  - __Misc Settings:__ manages warning messages and output processing
    
### Tool Settings
__General__
- Set Tool Output Size (Default: 150): changes the word count target for each full tool output.
  - Does not affect Motive or Reflect, and only sets a maximum size for CYOA 
  - This should be about 75% of your Response Length, but can be adjusted up or down to preference.
  - If your Response Length is 400, this should be set to 300.
- Enable Reminder Text (Default: true): if true, non-essential text reminders about how tools work are included when certain tools are used.
  - These reminders are on lines starting with "//"

__Visibility__
- Default to Snapshot Visible (Default: false): if true, Snapshot outputs default to being visible to the AI.
- Default to Mindview Visible (Default: false): if true, Mindview outputs default to being visible to the AI.

__CYOA__
- Set CYOA Choice Size (Default: 25): changes the word count target for each of the four options CYOA presents

__Direct__
- Set Scene Instruction Fade (Default: 4): The number of outputs scene instructions created by Direct will remain visible for.
  - Afterwards, they will be hidden from the AI
  - If set to 0 or -1, scene instructions won't get hidden automatically after a set time

__Card__
- Default to Prompt Cards (Default: true): If true, prompt cards without triggers are created.
  - If false, traditional story cards with triggers are created.
  - Prompt cards always appear in context by default
  - Prompts are configurable in Context Settings and Prompt Sequence
- Use Full-Title Triggers (Default: true): If true, the entire card title will be used as its trigger.
  - If false, each word in the card title except for small words like "and" will be used as separate triggers.
  - Only matters if creating a traditional story card, not a prompt card

__Motive__
- Set Motive Size (Default: 25): changes the word count target for motives.
- Set Motive Cap (Default: 1): The number of motives that are saved for each character.
  - The most recent motive for each character will always be their "Current Motive"
  - If this is above 1, older motives will be converted to "Prior Motive"
  - If a new motive is added past the cap, the oldest will be deleted.
- Set Motive Fade (Default: 5): The number of outputs a motive will persist for, after which it will be deleted.
  - If set to 0 or -1, motives won't get deleted automatically after a set time

__Reflect__
- Set Reflect Size (Default: 35): changes the word count target for reflections.
- Set Reflect Cap (Default: 3): The number of reflections that are saved for each character.
  - The most recent reflection for each character will always be their "Current Thoughts"
  - If this is above 1, older reflections will be converted to "Prior Thoughts"
  - If a new reflection is added past the cap, the oldest will be deleted.
- Set Reflect Fade (Default: 10): The number of outputs a reflection will persist for, after which it will be deleted.
  - If set to 0 or -1, reflections won't get deleted automatically after a set time

### Context Settings
__Context Positioning__
- Set Prompt Depth (Default: 16): How many paragraphs of context behind which various context elements are inserted
  - These elements include Default Instructions, Prompt Cards, Basic Personification, and Echo Ban
- Include Instructions Behind Prompt Cards (Default: true): If true, Default Instructions (if enabled) will be inserted into context just behind prompt cards.
  - If false, Default Instructions will be inserted just in front of prompt cards.

__Context Elements__
  - For each of the following, if set to true, that element will be included in context.
  - If set to false, that element will be omitted.
- Enable Default Instructions (Default: true): A large set of generic writing guidelines.
- Enable Prompt Cards (Default: true): The contents of story cards with the "Prompt" type.
- Enable Basic Personification (Default: true): instructions encouraging complex characters.
- Enable Advanced Personification (Default: false): More extensive instructions added just after each character card.
  - Works with both prompt cards and traditional story cards
  - Applies to any card with "- Character" in the title line
  - Only applies to traditional story cards when they are triggered
- Enable Echo Ban (Default: true): A strong instruction aimed at preventing repetitive outputs.
- Enable Imperative (Default: true): A very strong instruction to move the story forward.
- Enable Boundary Markers (Default: true): Small notations that help separate context elements

### Misc Settings
__Warnings__
- Enable Context Size Warning (Default: true): If true, shows a warning when your Tokens in Context exceeds your Context Length
  - Tokens in Context includes the following elements, in the order they get trimmed:
  - Older Story, Story Cards, Plot Essentials, Instructions, Prompt Cards, Recent Story
  - To save some context, you can disable components in the Context Settings story card.
  - Prompt cards can be individually disabled in the Prompt Sequence story card.
- Set Context Warning Frequency (Default: 10): The number of outputs before another context size warning can be shown.
  - Context warnings after the first are presented in a more compact format.

__Output Processing__
- Enable Output Trimming (Default: true): If true, outputs will be trimmed to the nearest sentence ending.
  - This is functionally very similar to having Raw Model Output set to Off.
- Add Paragraph Breaks (Default: true): If true, the final paragraph of an output will have a linebreak added to it if it has more than a certain number of sentences.
- Set Paragraph Break Length (Default: 3): The number of sentences required for an automatic line break.
  - This setting only functions if Add Paragraph Breaks is set to true

<h2 id="Prompt-Sequence"><strong>📋️ Prompt Sequence 📋️</strong></h2>

Your __Prompt Sequence__ can be found and edited in your Story Cards, in the __Settings__ category.

It will look something like this:

> Y - 🌐 Scenario
> 
> Y - 🌎 Ashen Veil - World
> 
> Y - 🗺️ The Verdant Marrow - Region

Each of your prompt cards should be on its own line, in the order the AI sees them. You can change the order here. You can also hide individual prompt cards here by changing Y/N next to the card name.

<h2 id="Tool-Scheduling-and-Automation"><strong>📅 Tool Scheduling and Automation 📅</strong></h2>

Tools can be __scheduled__ to happen automatically, repeating every __#__ turns

To do this, include the _-s#_ option in your input after a slash command and before the request
> /card -s20 a new character

The number after the "-s" determines how often the tool activates. If no number is included, it defaults to 10. The tool also activates on the turn you schedule it.

Scheduling a command creates a 📅 Tool Schedule story card or adds a new line if one already exists. You can adjust or remove automated tools here.
> ### 📅 Tool Schedule
> 
> Scheduled Commands - Sorted by Upcoming
> 
> Tool: Card - Timer: 19 - Rate: 20 - Start: 4 - Request: a new character

Each line in the schedule controls a command, and has the following parts:
- __Tool:__ the name of the tool being activated
- __Timer:__ how many turns before this tool activates again
- __Rate:__ how often this tool activates
- __Start:__ the turn this tool was created, used to calculate when it should activate again
- __Request:__ the request provided for the tool. If none is included when scheduling the command, this will be the tool's default request.

___Note:___ Tools can only activate on turns when you aren't activating another tool. If a tool is scheduled for activation and you input a tool command, it will wait for the next opportunity. If two tools are scheduled for activation on the same turn, the one higher in the list in the Tool Schedule card will activate, and the next tool will wait for the next opportunity to activate.

# 📥 Installation Guide 📥

<h2 id="Installing-through-AI-Dungeon"><strong>⚡ Installing through AI Dungeon ⚡</strong></h2>

Go to the __🧰 Toolbox 🧰__ script page:

[https://play.aidungeon.com/script/2U2w89VS3-Zq/toolbox?share=true](https://play.aidungeon.com/script/2U2w89VS3-Zq/toolbox?share=true)

Click the __Save__ button.

When creating your own scenario, go to the __Details__ tab, then scroll down to the __Scripting__ section and ensure the toggle there is set to __Scripts Enabled__.

Near the bottom of __Details__, in the __Scripts__ section, there is an __+Add Scripts__ button. Click that. Then, under your __Saved Scripts__ should be  __🧰 Toolbox 🧰__.

Click Add. Make sure the toggle is on. And that's it, you're done.

___NOTE:___ This method is quick, but has one __serious limitation__: The script does not actually load the code into your script browser, so you cannot modify __Default Settings__ (and thus also cannot use a __Dynamic Opening__, which defaults to off). If you want to be able to change these settings, you need to do a __manual installation__. 

<h2 id="Manual-Installation"><strong>⬇️ Manual Installation ⬇️</strong></h2>
Go to the __Details__ tab of your scenario, then scroll down to the __Scripting__ section and ensure the toggle there is set to __Scripts Enabled__. 

Click Edit Scripts to open the scenario's script editor.

Open the Scripts folder above or click the link below.

[https://github.com/FaraC-scripts/Toolbox/tree/main/Scripts](https://github.com/FaraC-scripts/Toolbox/tree/main/Scripts)

For each file (Library, Input, Context, Output), copy the script and paste it into the corresponding tab of your script editor.

When all four scripts are pasted in, make sure to click __Save__. 

<h2 id="Changing-Default-Settings"><strong>⚙️ Changing Default Settings ⚙️</strong></h2>

###__Default Settings can only be changed if using manual installation.__

You can configure the default Toolbox settings your scenarios will start with by editing the DEFAULT_SETTINGS object at the top of the Library section of your scenario's scripts, just inside of the Toolbox main function. Do not change any of the text in quotation marks. Only change numbers and true|false values.

Of particular note are the __Hidden > Dynamic Opening__ and __Context > Default Instructions__ settings. These are the settings that differ from the version of __Toolbox__ implemented in __Universal Generator__.

__Dynamic Opening__ is a __hidden setting__ that can only be altered in the script editor. If set to __true__ will replace the standard opening for your scenario with one that changes based on various __Prompt Cards__, either ones that are already-present, or provided at playtime through placeholders. For more information on how dynamic openings work, go here:

[https://github.com/FaraC-scripts/Universal-Generator-Scenario-Publishing/blob/main/README.md#dynamic-openings](https://github.com/FaraC-scripts/Universal-Generator-Scenario-Publishing/blob/main/README.md#dynamic-openings)

The __Default Instructions__ setting provides a fairly large set of writing instructions, but they can be overbearing if you are trying to produce a specific or unique writing style, so by default it is __disabled__. This setting can also be changed in-adventure, in the __Context Settings__ story card.

___NOTE___: If you enable Toolbox's __Default Instructions__, you need to create a blank AI Instructions component in your scenario __and press enter to create an empty line__. If you don't create a blank AI Instructions component (with an empty line), AI Dungeon will include its own default instructions __in addition to the one Toolbox provides__.

<h2 id="Universal-Generator-Placeholders"><strong>💬 Universal Generator Placeholders 💬</strong></h2>

Toolbox scenarios can be configured to accept Universal Generator final outputs (prompts) from your players as placeholders. 

The three placeholders you can create are the __main placeholder__, __protagonist placeholder__ and the __background placeholder__.

The __main placeholder__ accepts any valid Universal Generator prompt and converts its components into __prompt cards__.

To enable the protagonist placeholder, create a story card with the custom type "Placeholder" and the name "Placeholder - Main". The story card's entry needs to only include a normal AI Dungeon placeholder to allow the player somewhere to paste their prompt, e.g.,

> ### Type
>
> Custom
>
> Placeholder
>
> ### Name
>
> Placeholder - Main
>
> ### Entry
> 
> ${🌌 Paste a Universal Generator prompt here}

The __protagonist placeholder__ accepts a prompt from the player and filters it to find a Character component with "Character (Protagonist)" in its name. Failing that, it will find the first Character component. It will also find any other Character-type components associated with the protagonist, such as Appearance or Equipment. It takes these components and uses them to __replace any already-existing "Character (Protagonist)" prompt card__. It will also remove Appearance, Personality, and Speech cards associated with the old protagonist. Other components from the player-provided protagonist like Equipment and Abilities will override old components of the same type.

To enable the protagonist placeholder, create a story card as above, but with "Placeholder - Protagonist" as its name.

The __background placeholder__ works like the __main prompt__, except all of the prompt cards it creates will be placed __behind__ any prompts from the __main placeholder__. 

To enable the protagonist placeholder, create a story card as above, but with "Placeholder - Background" as its name.

<h2 id="Use-and-Acknowledgments"><strong>🎉 Use and Acknowledgments 🎉</strong></h2>
You may use, modify and redistribute my work freely. Have fun.

__However__, I ask that if you __use Toolbox in a published scenario__, you include a link back to this page:

https://github.com/FaraC-scripts/Toolbox

If you would like, you can also include one of these stickers in your scenario image. To download the full-resolution version of a sticker, click it to go to its Github page and download it from there.

<img src=https://github.com/FaraC-scripts/Toolbox/blob/main/Stickers/Toolbox%20Sticker.png width=15% height=15% />
<img src=https://github.com/FaraC-scripts/Toolbox/blob/main/Stickers/With%20Toolbox%20Sticker.png width=17.5% height=17.5% />
<img src=https://github.com/FaraC-scripts/Toolbox/blob/main/Stickers/Universal%20Generator%20Sticker.png width=12.5% height=12.5% />
