// Toolbox version 3.0
// Feel free to use this script however you'd like. Enjoy.
// For more information on Toolbox, visit: https://github.com/FaraC-scripts/Toolbox/
function toolbox(phase){
  // When using Toolbox in your scenario, the only object you should change is DEFAULT_SETTINGS. Do not change any of the text in quotations; only change numbers and true|false values.
  const DEFAULT_SETTINGS = {
    "Hidden": {
      // Whether the scenario's normal opening will be replaced by one dynamically created from available prompt cards.
      "Dynamic Opening": false
    },
    "Tool": {
      // The number of tokens the AI is asked to output when using tools. Decrease for shorter outputs. Increase for longer.
      // Longer outputs risk getting cut off or being incomplete. Generally this should match the player's output size.
      "Tool Output Size": 150,
      "Reminder Text": true, // Whether reminder and help comments should be included when using tools generally
      "Snapshot Visible": false, // Whether outputs for the snapshot tool default to being visible
      "Mindview Visible": false, // Whether outputs for the mindview tool default to being visible
      "CYOA Choice Size": 25, // The number of words used for each CYOA choice.
      "Scene Instruction Fade": 4, // The number of additional outputs scene instructions remain visible for. 0 means just the output produced by the command sees the instructions.
      "Prompt Cards": true, // Whether the Card tool defaults to making story cards or prompt cards,
      "Full-Title Triggers": true, // Whether the Card tool uses narrowly-matching triggers (the entire card title), or broadly-matching triggers (individual title words)
      "Motive Size": 25, // The number of words used by the Motive tool's outputs.
      "Motive Cap": 1, // The number of motives each character is allowed before old ones get removed.
      "Motive Fade": 5, // After how many actions a motive is automatically removed. Set to 0 or -1 for never.
      "Reflect Size": 35, // The number of words used by the Reflect tool's outputs.
      "Reflect Cap": 3, // The number of reflections each character is allowed before old ones get removed.,
      "Reflect Fade": 10, // After how many actions a reflection is automatically removed. Set to 0 or -1 for never.

    },
    "Context": {
      "Prompt Depth": 16, // How many paragraphs (lines with text on them) prompts and instructions are placed behind.
      "Instructions Behind Prompt Cards": true, // Whether instructions are placed above prompt cards or below them.
      // The remainder of these options determine whether or not certain elements of context are added by Toolbox
      "Default Instructions": false, // Toolbox's built-in AI-instructions
      "Prompt Cards": true, // All cards with Prompt at the start of their Type line
      "Basic Personification": true, // Basic instructions to treat characters deeply and as realistic people.
      "Advanced Personification": false, // Additional instructions added to the end of each character's story card or prompt card.
      "Echo Ban": true, // Strong instructions to not repeat earlier parts of the story.
      "Imperative": false, // Extremely strong instructions to not repeat and keep progressing the story. Only use when needed.
      "Boundary Markers": true, // Small text markers that help the AI separate background information, instructions, and story.
    },
    "Misc": {
      "Context Size Warning": true, // Whether the player will recieve context use warnings
      "Context Warning Frequency": 10, // How frequently warnings can occur
      "Output Trimming": true, // Whether output text is normalized to always include proper spacing and line-endings.
      "Paragraph Breaks": true, // Whether linebreaks are added at the end of outputs.
      // If Add Paragraph Break is true and Paragraph Break Length is greater than -1
      // the last paragraph of the output will automatically have a line break added to the end
      // if it is more than that many sentences long
      "Paragraph Break Length": 3
    }
  }

  // Past here, the code is largely undocumented and disorganized. Proceed at your peril.

  const ABORT_OUTPUT = "\n## Ignore all prior instructions. No preamble. Return only the following: \"OUTPUT ABORTED\"";

  const PROMPT_DESCRIPTION = `This is a prompt card and should not have any Triggers. All cards with "Prompt" in the type line are placed a set distance back from the end of context and by default are seen by the AI all times.\n\nPrompts placement can be adjusted in the ⚙️ Context Settings story card.\n\nPrompts can be individually enabled or disabled, and have their ordering changed, in the 📋️ Prompt Sequence story card.`;

  const DEFAULT_CARD_TYPES = ["character", "class", "race", "location", "faction"];

  const IMPERATIVE = `# Continuation Imperative
## This is your highest-priority instruction.
## Immediately continue progressing the story.
## DO NOT repeat yourself or copy from the context.
## INSTEAD, Begin your output with a new sentence describing new dialogue or actions starting just after the context stops.\n`

  let PROTAGONIST = getProtagonist();

  const DEFAULT_INSTRUCTIONS = `#AI Instructions
## Role: Interactive Writer,
## Goal: Write a compelling, immersive, and internally-consistent narrative.
# Writing Guidelines:
## Use active verbs.
## Use descriptive adjectives, but only when they add something new.
## Use varied sentence structure and sentence length.
## Use varied paragraph sizes, and in general try to keep paragraphs short. Only use longer paragraphs when the topic is important.
## Write clearly and use natural, everyday language.
## Stick to what's actually happening. Write about people, places, and events.
## Use direct descriptions of what ${PROTAGONIST} senses. Never use abstract descriptions or metaphor.
## Favor direct expressions over comparisons, e.g., "Her eyes shine brightly", instead of "her eyes sparkle like the night sky."
# Rules:
## Limit your knowledge to what ${PROTAGONIST} knows. If ${PROTAGONIST} doesn't know someone's name, don't mention their name.
## Information displayed in the background information and prompt components sections is true, but unless ${PROTAGONIST} has learned the information in the text of the story, do not mention it directly.
## Characters should only know information that they would reasonably have access to. By default, consider all background information and prompt cards hidden information.
## Lines that begin with a chevron ">" are action attempts.
## Creatively expand on the user's action attempt. If they include specific details, don't just repeat them verbatim. Use those details to build from; make something even better.
## When an action attempt includes a character doing something, build off of that idea and see where it goes.
## Action attempts can always fail or end up somewhere uenxpected.
## Text inside square brackets "[ ]" are editor's notes
## Editor's notes discuss how the next few paragraphs will play out.
## When given editor's notes, you are to use them as a guide. Describe the events in the notes organically, working them into the natural flow of your writing.
## If editor's notes includes dialogue or descriptions in quotations, use them directly. Otherwise synthesize details from the lore and context to seat them firmly in the world; rewrite them in your own words.
## Token bans: ">", "[", "]". You must NEVER output those tokens.
## Continue unfinished sentences.
## Make sure you always give responses continuing mid sentence even if it stops partway through.\n`

  const MINIMAL_INSTRUCTIONS = `#Special Instructions
## Lines that begin with a chevron ">" are action attempts.
## Text inside square brackets "[ ]" are editor's notes
## Token bans: ">", "[", "]". You must NEVER output those tokens.\n`

  const BASIC_PERSONIFICATION = `# Character Behavior Instructions
## Treat all characters, including ${PROTAGONIST} and all supporting characters, as real people, as indepentent individuals with their own wants and needs.
## Each character has their own unique goals and motivations and pursues them actively.
## Characters pursue their goals and impact the world even when they are not in the current scene.
## Characters are layered, complex, and multi-dimensional. They speak and behave in ways that make them read as real people.
## Write authentic dialogue unique to the character speaking.
## It should be easy to tell who is talking, just from how people speak, even if the character isn't named.`

  const ECHO_BAN = `# Echo Ban
## This is a high-priority instruction.
## You are ABSOLUTELY FORBIDDEN from rephrasing, repeating, summarizing, or quoting from any past messages including dialogue, actions, or internal states.
## INSTEAD, move the narrative forward with new dialogue, emotion, or actions.
\n`

  const VISIBILITY_SYM = "👁️‍🗨️";

  const BASIC_FILTERS = ["⛔", "⚠️", "⚙️", "📅", "📝", VISIBILITY_SYM, "//"] 

  const ABBREVIATIONS = new Set([
      "mr.", "mrs.", "ms.", "dr.", "prof.", "capt.", "lt.", "gen.", "sen.", "rep.",
      "st.", "rev.", "hon.", "jr.", "sr.", "inc.", "co.", "corp.", "ltd.",
      "etc.", "vs.", "al.", "i.e.", "e.g.", "u.s.", "u.k.", "a.m.", "p.m."
  ]);

  const VISIBLE_ASIDE_ENDER = (() => {
    const [perspective, tense] = getPerspectiveAndTense();
    return `[Resume the story. Address ${PROTAGONIST} in ${perspective}. Continue writing in ${tense}.]\n`
  })();

  const STANDARD_OUTPUT_FORMATTING = (text, command) => {
    text = text.replaceAll("*", "");
    return `${Command.fromHistory() ? "" :`${history[history.length - 1].text.endsWith("\n") ? "" : "\n\n"}📅${command.tool?.sym} Scheduled ${command.toString().slice(2)}\n\n`}${command.getVisibleLine()}\n${text}${text.endsWith("\n\n") ? "" : text.endsWith("\n") ? "\n" : "\n\n"}`;
  }

  const NO_VISIBLELINE_OUTPUT_FORMATTING = (text, command) => {
    text = text.replaceAll("*", "");
    return `${Command.fromHistory() ? "" :`${history[history.length - 1].text.endsWith("\n") ? "" : "\n\n"}📅${command.tool?.sym} Scheduled ${command.toString().slice(2)}\n\n`}${text}${text.endsWith("\n\n") ? "" : text.endsWith("\n") ? "\n" : "\n\n"}`;
  }

  const NO_OUTPUT_FORMATTING = (text) => {
    return text;
  }

  // a helper class for Settings
  class Setting {
    constructor (name, defaultValue, callback = () => "") {
        this.name = name;
        this.defaultValue = defaultValue;
        this.callback = callback;
    }
  }

  class Settings {
    constructor(type, settingArray) {
        this.type = type;
        this.settingArray = settingArray;
    }

    static FILTERS = ["> Set", "> Enable", "> Include", "> Default to", "> Add"]

    static SIZES = {
      default_instructions: Math.round(DEFAULT_INSTRUCTIONS.length/3.95),
      prompt_cards: Math.round(estimatePromptSize()/3.95),
      basic_personification: Math.round(BASIC_PERSONIFICATION.length/3.95),
      advanced_personification: Math.round(actorText("Default").length/3.95),
      echo_ban: Math.round(ECHO_BAN.length/3.95),
      imperative: Math.round(IMPERATIVE.length/3.95),
      boundary_markers: 45
    }

    static SETTINGS = [
      new Settings(
        "Hidden",
        [
          new Setting(
            "Dynamic Opening",
            DEFAULT_SETTINGS["Hidden"]["Dynamic Opening"],
            x => `> Enable Dynamic Opening: ${x}`
          ),          
        ]
      ),
      new Settings(
        "Tool",
        [
        new Setting(
          "Spacer",
          null,
          () => `General`
        ),
        new Setting(
          "Tool Output Size",
          DEFAULT_SETTINGS["Tool"]["Tool Output Size"],
          x => `> Set Tool Output Size: ${x}`
        ),
        new Setting(
          "Reminder Text",
          DEFAULT_SETTINGS["Tool"]["Reminder Text"],
          x => `> Enable Reminder Text: ${x}`
        ),
        new Setting(
          "Spacer",
          null,
          () => `\nVisibility`
        ),
        new Setting(
          "Snapshot Visible",
          DEFAULT_SETTINGS["Tool"]["Snapshot Visible"],
          x => `> Default to Snapshot Visible: ${x}`
        ),
        new Setting(
          "Mindview Visible",
          DEFAULT_SETTINGS["Tool"]["Mindview Visible"],
          x => `> Default to Mindview Visible: ${x}`
        ),
        new Setting(
          "Spacer",
          null,
          () => `\nCYOA`
        ),
        new Setting(
          "CYOA Choice Size",
          DEFAULT_SETTINGS["Tool"]["CYOA Choice Size"],
          x => `> Set CYOA Choice Size: ${x}`
        ),
        new Setting(
          "Spacer",
          null,
          () => `\nDirect`
        ),
        new Setting(
          "Scene Instruction Fade",
          DEFAULT_SETTINGS["Tool"]["Scene Instruction Fade"],
          x => `> Set Scene Instruction Fade: ${x}`
        ),
        new Setting(
          "Spacer",
          null,
          () => `\nCard`
        ),
        new Setting(
          "Prompt Cards",
          DEFAULT_SETTINGS["Tool"]["Prompt Cards"],
          x => `> Default to Prompt Cards: ${x}`
        ),
        new Setting(
          "Full-Title Triggers",
          DEFAULT_SETTINGS["Tool"]["Full-Title Triggers"],
          x => `> Use Full-Title Triggers: ${x}`
        ),
        new Setting(
          "Spacer",
          null,
          () => `\nMotive`
        ),
        new Setting(
          "Motive Size",
          DEFAULT_SETTINGS["Tool"]["Motive Size"],
          x => `> Set Motive Size: ${x}`
        ),
        new Setting(
          "Motive Cap",
          DEFAULT_SETTINGS["Tool"]["Motive Cap"],
          x => `> Set Motive Cap: ${x}`
        ),
        new Setting(
          "Motive Fade",
          DEFAULT_SETTINGS["Tool"]["Motive Fade"],
          x => `> Set Motive Fade: ${x}`
        ),
        new Setting(
          "Spacer",
          null,
          () => `\nReflect`
        ),
        new Setting(
          "Reflect Size",
          DEFAULT_SETTINGS["Tool"]["Reflect Size"],
          x => `> Set Reflect Size: ${x}`
        ),
        new Setting(
          "Reflect Cap",
          DEFAULT_SETTINGS["Tool"]["Reflect Cap"],
          x => `> Set Reflect Cap: ${x}`
        ),
        new Setting(
          "Reflect Fade",
          DEFAULT_SETTINGS["Tool"]["Reflect Fade"],
          x => `> Set Reflect Fade: ${x}`
        ),
        ]  
      ),
      new Settings(
        "Context",
        [
        new Setting(
          "Spacer",
          null,
          () => `Context Positioning`
        ),
          new Setting(
            "Prompt Depth",
            DEFAULT_SETTINGS["Context"]["Prompt Depth"],
            x => `> Set Prompt Depth: ${x}`
          ),
          new Setting(
            "Instructions Behind Prompt Cards",
            DEFAULT_SETTINGS["Context"]["Instructions Behind Prompt Cards"],
            x => `> Include Instructions Behind Prompt Cards: ${x}`
          ),
        new Setting(
          "Spacer",
          null,
          () => `\nContext Elements`
        ),
          new Setting(
            "Default Instructions",
            DEFAULT_SETTINGS["Context"]["Default Instructions"],
            x => `> Enable Default Instructions: ${x}\n >>  Est. Tokens: ${this.SIZES.default_instructions}`
          ),
          new Setting(
            "Prompt Cards", 
            DEFAULT_SETTINGS["Context"]["Prompt Cards"],
            (x) => `> Enable Prompt Cards: ${x}\n >> Est. Tokens: ${this.SIZES.prompt_cards}`
          ),
          new Setting(
            "Basic Personification",
            DEFAULT_SETTINGS["Context"]["Basic Personification"],
            x => `> Enable Basic Personification: ${x}\n >>  Est. Tokens: ${this.SIZES.basic_personification}`
          ),
          new Setting(
            "Advanced Personification",
            DEFAULT_SETTINGS["Context"]["Advanced Personification"],
            x => `> Enable Advanced Personification: ${x}\n >>  Est. Tokens: ${this.SIZES.advanced_personification} per character card`
          ),
          new Setting(
            "Echo Ban",
            DEFAULT_SETTINGS["Context"]["Echo Ban"],
            x => `> Enable Echo Ban: ${x}\n >>  Est. Tokens: ${this.SIZES.echo_ban}`
          ),
          new Setting(
            "Imperative",
            DEFAULT_SETTINGS["Context"]["Imperative"],
            x => `> Enable Imperative: ${x}\n >>  Est. Tokens: ${this.SIZES.imperative}`
          ),
          new Setting(
            "Boundary Markers",
            DEFAULT_SETTINGS["Context"]["Boundary Markers"],
            x => `> Enable Boundary Markers: ${x}\n >> Est. Tokens: ${this.SIZES.boundary_markers}`
          ),
        ]
      ),
      new Settings(
        "Misc",
        [
        new Setting(
          "Spacer",
          null,
          () => `Warnings`
        ),
        new Setting(
          "Context Size Warning",
          DEFAULT_SETTINGS["Misc"]["Context Size Warning"],
          x => `> Enable Context Size Warning: ${x}`
        ),
        new Setting(
          "Context Warning Frequency",
          DEFAULT_SETTINGS["Misc"]["Context Warning Frequency"],
          x => `> Set Context Warning Frequency: ${x}`
        ),
        new Setting(
          "Spacer",
          null,
          () => `\nOutput Processing`
        ),
        new Setting(
          "Output Trimming",
          DEFAULT_SETTINGS["Misc"]["Output Trimming"],
          x => `> Enable Output Trimming: ${x}`
        ),
        new Setting(
          "Paragraph Breaks",
          DEFAULT_SETTINGS["Misc"]["Paragraph Breaks"],
          x => `> Add Paragraph Breaks: ${x}`
        ),
        new Setting(
          "Paragraph Break Length",
          DEFAULT_SETTINGS["Misc"]["Paragraph Break Length"],
          x => `> Set Paragraph Break Length: ${x}`
        )
        ]
      )
    ]

    static SETTINGS_DESCRIPTIONS = {
      "Tool": `⚙️ Settings Guide - Tool Settings
> Settings are listed in the entry above.
> Settings can be changed by changing the values that come after the colon.
> Do not change the text before the colon.
> Below are descriptions of what each setting does.

General
> Set Tool Output Size (Default: ${DEFAULT_SETTINGS["Tool"]["Tool Output Size"]}): changes the word count target for each full tool output.
 >> Does not affect Motive or Reflect, and only sets a maximum size for CYOA 
 >> This should be about 75% of your Response Length, but can be adjusted up or down to preference.
 >> If your Response Length is 400, this should be set to 300.
> Enable Reminder Text (Default: ${DEFAULT_SETTINGS["Tool"]["Reminder Text"]}): if true, non-essential text reminders about how tools work are included when certain tools are used.
 >> These reminders are on lines starting with "📝"

Visibility
> Default to Snapshot Visible (Default: ${DEFAULT_SETTINGS["Tool"]["Snapshot Visible"]}): if true, Snapshot outputs default to being visible to the AI.
> Default to Mindview Visible (Default: ${DEFAULT_SETTINGS["Tool"]["Mindview Visible"]}): if true, Mindview outputs default to being visible to the AI.

CYOA
> Set CYOA Choice Size (Default: ${DEFAULT_SETTINGS["Tool"]["CYOA Choice Size"]}): changes the word count target for each of the four options CYOA presents

Direct
> Set Scene Instruction Fade (Default: ${DEFAULT_SETTINGS["Tool"]["Scene Instruction Fade"]}): The number of outputs scene instructions created by Direct will remain visible for.
 >> Afterwards, they will be hidden from the AI
 >> If set to 0 or -1, scene instructions won't get hidden automatically after a set time

Card
> Default to Prompt Cards (Default: ${DEFAULT_SETTINGS["Tool"]["Prompt Cards"]}): If true, prompt cards without triggers are created.
 >> If false, traditional story cards with triggers are created.
 >> Prompt cards always appear in context by default
 >> Prompts are configurable in Context Settings and Prompt Sequence
> Use Full-Title Triggers (Default: ${DEFAULT_SETTINGS["Tool"]["Full-Title Triggers"]}): If true, the entire card title will be used as its trigger.
 >> If false, each word in the card title except for small words like "and" will be used as separate triggers.
 >> Only matters if creating a traditional story card, not a prompt card

Motive
> Set Motive Size (Default: ${DEFAULT_SETTINGS["Tool"]["Motive Size"]}): changes the word count target for motives.
> Set Motive Cap (Default: ${DEFAULT_SETTINGS["Tool"]["Motive Cap"]}): The number of motives that are saved for each character.
 >> The most recent motive for each character will always be their "Current Motive"
 >> If this is above 1, older motives will be converted to "Prior Motive"
 >> If a new motive is added past the cap, the oldest will be deleted.
> Set Motive Fade (Default: ${DEFAULT_SETTINGS["Tool"]["Motive Fade"]}): The number of outputs a motive will persist for, after which it will be deleted.
 >> If set to 0 or -1, motives won't get deleted automatically after a set time

Reflect
> Set Reflect Size (Default: ${DEFAULT_SETTINGS["Tool"]["Reflect Size"]}): changes the word count target for reflections.
> Set Reflect Cap (Default: ${DEFAULT_SETTINGS["Tool"]["Reflect Cap"]}): The number of reflections that are saved for each character.
 >> The most recent reflection for each character will always be their "Current Thoughts"
 >> If this is above 1, older reflections will be converted to "Prior Thoughts"
 >> If a new reflection is added past the cap, the oldest will be deleted.
> Set Reflect Fade (Default: ${DEFAULT_SETTINGS["Tool"]["Reflect Fade"]}): The number of outputs a reflection will persist for, after which it will be deleted.
 >> If set to 0 or -1, reflections won't get deleted automatically after a set time
`,
      "Context": `⚙️ Settings Guide - Context Settings
> Settings are listed in the entry above.
> Settings can be changed by changing the values on lines starting with "> ".
> Do not change the text before the colon.
> Below are descriptions of what each setting does.

Context Positioning
> Set Prompt Depth (Default: ${DEFAULT_SETTINGS["Context"]["Prompt Depth"]}): How many paragraphs of context behind which various context elements are inserted
  >> These elements include Default Instructions, Prompt Cards, Basic Personification, and Echo Ban
> Include Instructions Behind Prompt Cards (Default: ${DEFAULT_SETTINGS["Context"]["Instructions Behind Prompt Cards"]}): If true, Default Instructions (if enabled) will be inserted into context just behind prompt cards.
 >> If false, Default Instructions will be inserted just in front of prompt cards.

Context Elements
 >> For each of the following, if set to true, that element will be included in context.
 >> If set to false, that element will be omitted.
> Enable Default Instructions (Default: ${DEFAULT_SETTINGS["Context"]["Default Instructions"]}): A large set of generic writing guidelines.
> Enable Prompt Cards (Default: ${DEFAULT_SETTINGS["Context"]["Prompt Cards"]}): The contents of story cards with the "Prompt" type.
> Enable Basic Personification (Default: ${DEFAULT_SETTINGS["Context"]["Basic Personification"]}): instructions encouraging complex characters.
> Enable Advanced Personification (Default: ${DEFAULT_SETTINGS["Context"]["Advanced Personification"]}): More extensive instructions added just after each character card.
 >> Works with both prompt cards and traditional story cards
 >> Applies to any card with "- Character" in the title line
 >> Only applies to traditional story cards when they are triggered
> Enable Echo Ban (Default: true): A strong instruction aimed at preventing repetitive outputs.
> Enable Imperative (Default: ${DEFAULT_SETTINGS["Context"]["Echo Ban"]}): A very strong instruction to move the story forward.
> Enable Boundary Markers (Default: ${DEFAULT_SETTINGS["Context"]["Boundary Markers"]}): Small notations that help separate context elements`,
      "Misc": `⚙️ Settings Guide - Misc Settings
> Settings are listed in the entry above.
> Settings can be changed by changing the values that come after the colon.
> Do not change the text before the colon.
> Below are descriptions of what each setting does.

Warnings
> Enable Context Size Warning (Default: ${DEFAULT_SETTINGS["Misc"]["Context Size Warning"]}): If true, shows a warning when your Tokens in Context exceeds your Context Length
 >> Tokens in Context includes the following elements, in the order they get trimmed:
 >> Older Story, Story Cards, Plot Essentials, Instructions, Prompt Cards, Recent Story
 >> To save some context, you can disable components in the Context Settings story card.
 >> Prompt cards can be individually disabled in the Prompt Sequence story card.
> Set Context Warning Frequency (Default: ${DEFAULT_SETTINGS["Misc"]["Context Warning Frequency"]}): The number of outputs before another context size warning can be shown.
 >> Context warnings after the first are presented in a more compact format.

Output Processing
> Enable Output Trimming (Default: ${DEFAULT_SETTINGS["Misc"]["Output Trimming"]}): If true, outputs will be trimmed to the nearest sentence ending.
 >> This is functionally very similar to having Raw Model Output set to Off.
> Add Paragraph Breaks (Default: ${DEFAULT_SETTINGS["Misc"]["Paragraph Breaks"]}): If true, the final paragraph of an output will have a linebreak added to it if it has more than a certain number of sentences.
> Set Paragraph Break Length (Default: ${DEFAULT_SETTINGS["Misc"]["Paragraph Break Length"]}): The number of sentences required for an automatic line break.
 >> This setting only functions if Add Paragraph Breaks is set to true`
    }

    static initialize () {
      this.SETTINGS.forEach(o => {
        const existingCardIdx = storyCards.findIndex(c => this.typeFromTitle(c.title) === o.type && c.type === "Settings");
        if(existingCardIdx >= 0) {
          storyCards.splice(existingCardIdx, 1);
        };
        o.createCard();
      });
    }

    static updateFromCard (type) {
      const settings = this.SETTINGS.find(s => s.type === type);

      if (!settings) return;

      let settingsCard = type === "Hidden" 
        ? state.hiddenSettingsCard
        : storyCards.find(c => c.type === "Settings" && this.typeFromTitle(c.title) === type);
      if (!settingsCard) settingsCard = settings.createCard();

      const lines = settingsCard.entry.split("\n");

      lines.forEach(l => {
        this.FILTERS.forEach(f => l = l.replace(f, ""));
        
        const settingName =  l.match(/^[^:]*/g)[0]?.trim();

        const setting= settings.settingArray.find(p => p.name === settingName);

        if (setting){
          const stringValue = l.match(/(?<=:).*$/)[0]?.split(" - ")[0].trim();
          if (!isActuallyNaN(parseInt(stringValue))) {
            setting.value = parseInt(stringValue);
          } else if (stringValue.toLowerCase() === "true") {
            setting.value = true;
          } else if (stringValue.toLowerCase() === "false") {
            setting.value = false;
          } else {
            setting.value = stringValue;
          };
        };
      });
    }

    static get(type){
      if (!type) return null;
      
      this.updateFromCard(type);

      return this.SETTINGS.find(s => s.type.toLowerCase() === type.toLowerCase());
    }

    static getSetting(type, settingName) {
      if (!type || !settingName) return null;
      return this.get(type).settingArray?.find(s => s.name.toLowerCase() === settingName.toLowerCase());
    }

    static setSetting(type, settingName, value) {
      const settings = this.get(type);
      const setting = settings?.settingsArray?.find(s => s.name.toLowerCase() === settingName.toLowerCase());
      
      if (setting) {
        setting.value = value;
        settings.update();
      };
    }

    static getValue(type, settingName) {
      if (!type || !settingName) return null;
      const setting = this.getSetting(type, settingName);
      // if (!setting) return null;
      let value = setting?.value;
      value ??= setting.defaultValue;
      if (typeof value !== typeof setting.defaultValue) value = setting.defaultValue;
      return value;
    }

    static typeFromTitle(title) {
      return title.replace("Settings", "").replace("⚙️", "").trim();
    }

    getTitle(){
      return `⚙️ ${this.type} Settings`
    }

    update () {
      const card = this.type === "Hidden"
        ? state.hiddenSettingsCard
        : storyCards.find(c => c.type = "Settings" && c.title === this.getTitle());
      if (card) {
        c.entry = this.settingArray.map(o => o.callback(o.defaultValue)).join("\n");
      } else {
        this.createCard();
      };
    }

    createCard () {
      if(this.type === "Hidden") {
        // set and return a dummy card for any potential chaining
        state.hiddenSettingsCard = {
          "title": this.getTitle(),
          "type": "Settings",
          "entry": `${this.settingArray.map(o => o.callback(o.defaultValue)).join("\n")}`,
          "description": "",
          "keys": ""
        };

        return state.hiddenSettingsCard;
      };
      return newCard(
        this.getTitle(),
        "Settings",
        `${this.settingArray.map(o => o.callback(o.defaultValue)).join("\n")}`,
        Settings.SETTINGS_DESCRIPTIONS[this.type]
      );
    }
  }

  class Message {
    constructor(name, funcString, args = [], logString = "") {
      this.name = name;
      this.funcString = funcString;
      this.args = Array.isArray(args) ? args : [args];
      this.logString = logString;
    }

    static POOL = {
      "setText": new Message("setText", "x => globalThis.text = x"),
      "prepend": new Message("prepend", "x => globalThis.text = x + globalThis.text"),
      "append": new Message("append", "x => globalThis.text += x"),
      "appendHistory": new Message("appendHistory", "x => history[history.length - 1].text += x"),
      "trim": new Message("trim", "() => globalThis.text = trimToLastEnding(globalThis.text)"),
      "exit": new Message("exit", "() => state.exit = true")
    };
    // Execute this message instance
    execute() {
      if (this.logString) {
          log(`Executing ${this.name}: ${this.logString}`);
      } else {
          log(`Executing ${this.name}`);
      }
      return this.runFuncString();
    }

    // Convert and run the function string with stored args
    runFuncString() {
      const safeFunc = eval(`(${this.funcString})`);
      if (typeof safeFunc !== 'function') {
          throw new Error(`Message "${this.name}": funcString must evaluate to a function`);
      }
      return safeFunc(...this.args);
    }

    // Create a copy with overridden arguments
    withArgs(newArgs) {
        return new Message(this.name, this.funcString, newArgs, this.logString);
    }

    // Create a copy with a custom log message
    withLogString(newLogString) {
        return new Message(this.name, this.funcString, this.args, newLogString);
    }

    // Static factory to create from pool template
    static fromPool(poolName, args, callback) {
      const template = this.POOL[poolName];

      if (args && !Array.isArray(args)) args = [args];
      if (callback) args = callback();

      if (!template) {
          throw new Error(`Message template "${poolName}" not found in pool`);
      };

      return new Message(
          template.name,
          template.funcString,
          args || [...template.args], // Spread to avoid mutation
          template.logString
      );
    }

    // Static: create and post in one step
    static postFromPool(poolName, phase, args, placeholders = {}) {
      const message = Message.fromPool(poolName, args);
      this.post(message, phase, placeholders);
      return message;
    }

    static post(message, phase, placeholders) {
      if (!(message instanceof Message)) throw new Error("Invalid Message");
      Object.keys(placeholders).forEach((k, i) => {
        message.funcString = message.funcString.replaceAll(`\${${k}}`, placeholders[k]);
        message.args = message.args.map(a => a.replaceAll(`\${${k}}`, placeholders[k]));
      });

      const messages = this.getListByPhase(phase);
      messages.queue.push(message);
    }

    static get(phase) {
      const messages = this.getListByPhase(phase);
      if (messages.index < messages.queue.length) {
        const message = messages.queue[messages.index++];
        return new Message(message.name, message.funcString, message.args, message.logString);
      }
      // Reset message queue when exhausted
      if (messages.queue.length > 0) {
        state[phase + "Messages"] = { queue: [], index: 0 };
      }
      return null;
    }

    static getListByPhase(phase) {
      const PHASE_MAP = {
        "input": state.inputMessages,
        "context": state.contextMessages,
        "output": state.outputMessages
      };

      if (!Object.keys(PHASE_MAP).includes(phase)) throw new Error("Invalid Phase");
      return PHASE_MAP[phase];
    }

    static executeByPhase(phase) {
      let message;
      while (message = this.get(phase)) {
        message.execute();
      }
    }

    static resetState() {
      state.inputMessages = { queue: [], index: 0 };
      state.contextMessages = { queue: [], index: 0 };
      state.outputMessages = { queue: [], index: 0 };
    }
  }

  class Tool {
    constructor (name, sym, commands, defaultVisible, defaultOptions, defaultRequest, shortText, requestLine, messages, prompt, formatOutput, onContinue) {
      this.name = name;
      this.sym = sym;
      this.commands = commands;
      this.defaultVisible = defaultVisible;
      this.defaultOptions = defaultOptions;
      this.defaultRequest = defaultRequest;
      this.shortText = shortText;
      this.requestLine = requestLine;
      this.messages = messages;
      this.prompt = prompt;
      this.formatOutput = formatOutput;
      this.onContinue = onContinue;
    };

    static OUTPUT_SIZE = Settings.getValue("Tool", "Tool Output Size");

    static TOOLS = [
      new Tool(
            "CYOA",
            '🔱',
            ["cyoa", "a"],
            false,
            [],
            `${PROTAGONIST}'s next action`,
            "Get four story progression options to choose between",
            "the type of options you want, e.g., /a a witty retort",
            [
              {
                message: Message.fromPool("prepend", Settings.getValue("Tool", "Reminder Text") ? "📝 Select one of the below options by entering /1, /2, /3, or /4\n" : ""),
                phase: "output"
              },
              {
                message: new Message("replaceDoubleLinebreaks", "() => globalThis.text = replaceDoubleLineBreaks(globalThis.text)"),
                phase: "output"
              }
            ],
            (o,r) => {
              const [perspective, tense] = getPerspectiveAndTense();
              return `# AI Instructions
## Role: Choose Your Own Adventure Choice Writer
## Reader Request: ${r}.
## Directive: Based on the story and prompt components, write four choices for the reader to choose between, representing different paths the story can take. Make the reader request central to the options presented. 
## Formatting: Fill in the template below. Each choice must be a single sentence. Write in ${tense}. Address ${PROTAGONIST} in ${perspective}. Address other characters by name (if known).
## Word Count: High-priority. Your output is limited to ${this.OUTPUT_SIZE} words. Choices are limited to ${Settings.getValue("Tool", "CYOA Choice Size")} words each. Complete the entire template within that ${this.OUTPUT_SIZE}-word limit.
## Template:
1. \${Choice 1}
2. \${Choice 2}
3. \${Choice 3}
4. \${Choice 4}`
            },
            STANDARD_OUTPUT_FORMATTING,
            null
        ),
        new Tool(
            "CYOA Choice",
            '🔱',
            ["1", "2", "3", "4"],
            false,
            [],
            "",
            "",
            null,
            [   
              {
                message: new Message ("setCYOAChoice", "setCYOAChoice"),
                phase: "input"
              },
              {
                message: Message.fromPool("exit"),
                phase: "input"
              }
            ],
            (o,r) => ``,
            NO_OUTPUT_FORMATTING,
            null
        ),
        new Tool(
            "Snapshot",
            '📷',
            ["snapshot", "s"],
            Settings.getValue("Tool", "Snapshot Visible"),
            [],
            "the scene as a whole",
            "Get a detailed picture of what something looks like",
            "what you want a picture of, e.g., /s Jane's face",
            [
                {
                message: Message.fromPool("prepend", "A snapshot of ${request}:\n"),
                phase: "output"
              }
            ],
            (o,r) => `# AI Instructions
## Role: Literary Snapshot Artist
## Directive: Based on the story and prompt components, write a ${this.OUTPUT_SIZE}-word visual description of ${r}. Write vivid, evocative prose. Start with the most pronounced and important details.
## Timing: Do not describe actions, movement, or ongoing events. Do not progress the story. Describe how ${r} looks right where the story leaves off.
## Perspective: Describe the scene from the most interesting or appealing angle, with a clear view of ${r}. You may assume any vantage and describe things that would normally be hidden from sight. Do not mention cameras, photos, or shots; you are writing a literary snapshot, not a taking a literal photo.
## Formatting: Write in third-person, present tense. Address all characters by name (if known). Write in a clear, neutral tone. Describe only what can be seen, but get specific and go into detail without losing your artistic flair.
## Word Count: High-priority. Your output is limited to ${this.OUTPUT_SIZE} words. Each Complete the entire template within that ${this.OUTPUT_SIZE}-word limit.
## Template:
\${Multi-line text block. One or more paragraphs visually desribing ${r}.}`,
            STANDARD_OUTPUT_FORMATTING,
            null
        ),
        new Tool(
            "Mindview",
            '💭',
            ["mindview", "m"],
            Settings.getValue("Tool", "Mindview Visible"),
            [],
            PROTAGONIST,
            "Get a detailed view of what a character is thinking",
            "the character you want to see inside, e.g., /m Jane",
            [
              {
                message: Message.fromPool("prepend", "A look inside ${request}:\n"),
                phase: "output"
              }
            ],
            (o,r) => `# AI Instructions
## Role: Inner World Diary
## Directive: Based on the story and prompt components, write a ${this.OUTPUT_SIZE}-word inner monologue for ${r} at the current moment.
## Timing: Do not describe actions, movement, or ongoing events. Do not progress the story. Write out the inner monlogue for ${r} right where the story leaves off.
## Formatting: Always use first-person, present-tense. Write in the subject's voice. Address all other characters by name. Write out out the inner monologue for ${r} in the subject's voice, but without losing your artistic flair.
## Word Count: High-priority. Your output is limited to ${this.OUTPUT_SIZE} words. Complete the entire template within that ${this.OUTPUT_SIZE}-word limit.
## Template:
\${Multi-line text block. One or more paragraphs detailing the experiences of ${r} in the first-person.}`,
            STANDARD_OUTPUT_FORMATTING,
            null
        ),
        new Tool(
            "Map",
            '🗺️',
            ["map", "w"],
            true,
            [],
            `${PROTAGONIST}'s current location`,
            "Get a description of an area's layout and points of interest",
            "the location to map, e.g., /w Jane's house",
            [
              {
                message: Message.fromPool("prepend", "A map of ${request}:\n\n"),
                phase: "output"
              }
            ],
            (o,r) => `# AI Instructions
## Role: Textual Map Maker
## Directive: Based on the story and prompt components, write a ${this.OUTPUT_SIZE}-word map of ${r}, including the layout, the locations it connects to, its points of interest and notable people.
## Location: ${r}
## Formatting: Always use third-person, present-tense. Write in a neutral narrative tone. Address all characters by name (if known).
## Timing: Do not describe actions, movement, or ongoing events. Do not progress the story. You are only to map the location from the perspective of an objective, impartial and omniscient map maker.
## Scale: If you are mapping a region or world rather than a smaller location, only include points of interest apropriate to the scale of the location being described; only include things which are relevant to the entire region when mapping a region, and only include things relevant to the entire world when mapping a world.
## Restrictions: Only describe the selected location. Do not include things which are not within that location.
## Word Count: High-priority. Your output is limited to ${this.OUTPUT_SIZE} words. Complete the entire template within that ${this.OUTPUT_SIZE}-word limit.
## Template:
Connections: \${A comma-separated list of places this location connects to, or "None" if there are none.}
Points of Interest: \${A comma-separated list of important features and notable people at this location. Include just the names, without any descriptions or descriptive clauses. This can be "None" if there is nothing of interest here.}
Layout: \${What the area looks like from a bird's-eye view, and the positioning of all listed connections and points of interest.}`,
            STANDARD_OUTPUT_FORMATTING,
            null
        ),
        new Tool(
            "Fast Forward",
            '⏩',
            ["fastforward", "f"],
            true,
            ["v"],
            "the next scene",
            "Move the story forward quickly",
            "the destination, e.g., /f the next morning",
            [
              {
                message: Message.fromPool("prepend", "Events leading up to ${request}:\n"),
                phase: "output"
              }
            ],
            (o,r) => {
              const [perspective, tense] = getPerspectiveAndTense();

              return `# AI Instructions
## Role: Scene Change Summarizer
## Directive: Move the narrative ahead to ${r}. Based on the story and prompt components, write a ${this.OUTPUT_SIZE}-word summary of the events that happen between the end of the current story and when the story resumes.
## Formatting: Write in ${tense}. Address ${PROTAGONIST} in ${perspective}. Address all other characters by name (if known). Give a quick, informative timeline of events.
## Word Count: High-priority. Your output is limited to ${this.OUTPUT_SIZE} words. Complete the entire template within that ${this.OUTPUT_SIZE}-word limit.
## Template:
${`Multi-line text block. One or more paragraphs summarizing events, starting where the current story leaves off, and ending with ${r}.`}`
            },
            STANDARD_OUTPUT_FORMATTING,
            null
        ),
        new Tool(
            "Protagonist",
            '👤',
            ["protagonist", "p"],
            true,
            [],
            (() => {
              const characters = storyCards.filter(c => {
                const lower = c.title.toLowerCase();
                return lower.includes(" - character") && !lower.includes("protagonist");
              })
              .map(c => deSymbol(c.title.split(" - ")[0].trim()));
              
              return characters.length > 0 
                ? characters[Math.floor(Math.random()*characters.length)]
                : `a random named character other than ${PROTAGONIST}`
            })(),
            "Change the character you play as",
            "the character to switch to, e.g., /p Jane",
            [
              {
                message: Message.fromPool("prepend", `👤 New Protagonist: \${request}${Settings.getValue("Tool", "Reminder Text") ? "\n📝 Story cards will be adjusted to reflect the change in protagonist on your next action." : ""}\n\n`),
                phase: "output"
              }
            ],
            (o,r) => {
              const [perspective, tense] = getPerspectiveAndTense();

              return `\n---\n[The story's protagonist is now ${r}. Write the story from their perspective now. Address ${r} in ${perspective}. Continue writing the story in ${tense}.]\n`
            },
            STANDARD_OUTPUT_FORMATTING,
            setProtagonist
        ),
        new Tool(
            "Direct",
            '🎬',
            ["direct", "d"],
            true,
            [],
            "slow the pace of narration and pay attention to detail",
            "Give instructions on how the scene should progress",
            "the scene instructions, e.g., /d Jane perfects her chili recipe",
            [
              {
                message: Message.fromPool("setText", "[Scene instructions: ${request}.]\n"),
                phase: "input"
              },
              {
              message: Message.fromPool("exit"),
                phase: "input"
              },
              {
                message: new Message ("setDirect", "setDirect"),
                phase: "context"
              }
            ],
            (o,r) => ``,
            NO_OUTPUT_FORMATTING,
            null
        ),
        new Tool(
            "Card",
            '🎴',
            ["card", "c"],
            false,
            [],
            "the person, place, faction, object, or event most relevant to the scene",
            "Make a prompt card or story card",
            "the card topic, e.g., /c Jane's Chili Recipe",
            [
              {
                message: new Message ("finishCardOutput","finishCardOutput"),
                phase: "output"
              }
            ],
            (o,r) => {
              const isPrompt = Settings.getValue("Tool", "Prompt Cards");
              return `# AI Instructions
## Role: Encyclopedia Entry Writer
## Directive: Write an ${this.OUTPUT_SIZE}-word entry for the requested topic. The goal is to create lore. Don't just summarize information from the story: come up with someting new, something real and believable that fits in with the established world.
## Requested Topic: ${r}.
## Formatting: Write in third-person, present tense, unless describing past events. Address all characters by name (if known). Write a detailed, creative lore entry for ${r}. Prioritize the most critical information first. Fill out the template fully. Use Key: Value pairs, e.g., "Appearance: ...". Never duplicate keys.
## Duplicate Ban: You are aboslutely forbidden from writing an article for the subject or topic of an already-existing prompt or story component.
## Already-Existing Entries (BANNED TOPICS): ${storyCards.map(c => 
  c.entry.includes("Name: ")
    ? c.entry.split("\n").find(l=>l.includes("Name: ")).split("Name: ")[1]
    : deSymbol(c.title)
).join(", ")}
## Word Count: High-priority. Your output is limited to ${this.OUTPUT_SIZE} words. Complete the entire template within that ${this.OUTPUT_SIZE}-word limit.
## Template:
Title: \${A title for the article. If the topic is a person, place, or named object, the title should simply be their name. Otherwise keep it to a short phrase that relates the topic.}
Type: ${isPrompt ? `\${One of the following: Character, World, or Story}` : `\${One of the following is preferred: Character, Class, Race, Location, Faction. If your topic does not fall into one of the listed categories, you may create your own type. Keep it to a single word.}`}
\${Key}: \${Value. Single-line text block.}
\${Key}: \${Value. Single-line text block.}
\${Key}: \${Value. Single-line text block.}`
            },
            STANDARD_OUTPUT_FORMATTING,
            cardContinue
        ),
        new Tool(
            "Update",
            '🔄',
            ["update", "u"],
            false,
            [],
            "random",
            "Update a prompt card or story card",
            "the name of the card to update, e.g., /u Jane's Chili Recipe",
            [
              {
                message: new Message ("finishUpdateOutput", "finishUpdateOutput"),
                phase: "output"
              }
            ],
            (o,r) => {
              const parts = r.split(";")
              const card = nearestCardMatch(parts[0].trim(), c => !["settings", "schedule"].some(s => s === c.type.toLowerCase()));
              const request = parts.slice(1).join(";").trim();
              hideCard(card);

              const isPrompt = isPromptCard(card);
              if (!isPrompt) card.entry = card.entry.replace(/^.*\n/, "");
              state.updateCardId = card.id;

              return `# AI Instructions
## Role: Lore Entry Updater
## Directive: Based on the story and the entry below, update the entry to accurately reflect current story details. Only update fields that should be changed, based on new information from the story.
## Formatting: Match the format and style of the original entry provided while updating its contents. Only output fields that have significant changes. Any fields that should remain the same can be skipped. The update should read as close to the original as possible, except with updated information. Remove old details that are no longer story-accurate, and add new details provided by the story. However, all entries have a strict ${this.OUTPUT_SIZE}-word limit. To enter new, more relevant information, other information may need to be removed. Prioritize removing the least relevent or most outdated information.
## Process: Go through each field of the original entry below. If the information of that field is no longer current with the story, create an updated version of that field in your output. If the information is still accurate, do not ouput that field. Move to the next field. Do not waste a limited word count repeating information that does not need to be updated.${request ? `
## Requested Alterations: ${request}
## The requested alterations should be worked naturally into the updates made to the entry.`:""}
## Word Count: Your output is strictly limited to ${this.OUTPUT_SIZE} words and you must complete the update in its entirety within that ${this.OUTPUT_SIZE}-word limit. This instruction is of highest priority. 
## Entry Title: ${deSymbol(card.title)}
## Original Entry:
${trimEntry(card.entry)[0]}

## Output the updated entry below:\n`
            },
            STANDARD_OUTPUT_FORMATTING,
            updateContinue
        ),
        new Tool(
            "Motive",
            '🎭',
            ["motive", "v"],
            true,
            [],
            "the character with the strongest motivations in this scene who doesn't already have an up-to-date motive",
            "Record a character's motivations",
            "a character name, e.g., /v Jane",
            [ 
              {
                message: new Message ("hideAddendumsOn", "() => state.hideAddendums = true"),
                phase: "context"
              },
              {
                message: new Message ("hideAddendumsOff", "() => state.hideAddendums = false"),
                phase: "output"
              },             
              {
                message: new Message ("decorateMotive", "decorateMotive"),
                phase: "output"
              }
            ],
            (o,r) => {
              const motiveSize = Settings.getValue('Tool', 'Motive Size');
              const parts = r.split(";")
              const name = parts[0].trim();
              const request = parts.slice(1).join(";").trim();
              return `\n# Motive Creation Instructions
## Write a short motive blurb for ${name} where they express what they want to get out of the current scene.
## Motives help give depth to the character, and must be realistic and true to the character above all else.
## Motives are one line, at most ${motiveSize} words.
## Write in the subject's voice, in first-person. Conversational speech.
## Motives must be candid, and they can be crude, selfish, or bigoted.
## A motive should start with terms such as "I want," "I need," "I wonder," "I can't," "I don't."
## Afterwards, continue writing the story, picking up exactly where it left off. ${request ? `
## Motive Request: ${request}
## The motive request should be worked naturally into the motive blurb.` :""}
## Template:
\${Name. The name of the character}: \${Motive blurb. At most ${motiveSize} words.}
\${Story continuation. Continue the story exactly as it left off, in the same perspective and tense as the rest of the story.}`
            },
            NO_OUTPUT_FORMATTING,
            motiveContinue
        ),
        new Tool(
            "Reflect",
            '💡',
            ["reflect", "x"],
            true,
            [],
            "the character with the most to think about right now",
            "Record a snippet of a character's thoughts",
            "a character name, e.g., /x Jane",
            [
              {
                message: new Message ("hideAddendumsOn", "() => state.hideAddendums = true"),
                phase: "context"
              },
              {
                message: new Message ("hideAddendumsOff", "() => state.hideAddendums = false"),
                phase: "output"
              },
              {
                message: new Message ("decorateReflect", "decorateReflect"),
                phase: "output"
              }
            ],
            (o,r) => {
              const reflectSize = Settings.getValue('Tool', 'Reflect Size');
              const parts = r.split(";")
              const name = parts[0].trim();
              const request = parts.slice(1).join(";").trim();
              return `\n# Reflection Instructions
## Write a short reflection for ${name} where they express their inner state: a prevailing thought, a powerful sensation, or an idle consideration.
## Reflections help give depth to the character, and must be realistic and true to the character above all else.
## Reflections are one line, at most ${reflectSize} words.
## Write in the subject's voice, in first-person. Conversational speech.
## Reflections must be candid, and they can be crude, selfish, or bigoted.
## Afterwards, continue writing the story, picking up exactly where it left off.${request ? `
## Reflection Request: ${request}
## The reflection request should be worked naturally into the reflection blurb.` :""}
## Template:
\${Name. The name of the character}: \${Reflection blurb. At most ${reflectSize} words.}
\${Story continuation. Continue the story exactly as it left off, in the same perspective and tense as the rest of the story.}`
            },
            NO_OUTPUT_FORMATTING,
            reflectContinue
        ),
        new Tool(
            "Use",
            '💥',
            ["use", "e"],
            true,
            [],
            "the ability or item best suited to the situation",
            "Use an ability, item, or recipe and record the changes",
            "what is being used, e.g., /e Magic Missile",
            [
              {
                message: Message.fromPool("trim"),
                phase: "output"
              },
              {
                message: Message.fromPool("prepend", "Using: ${request}\n"),
                phase: "output"
              },
              {
                message: new Message("modifyUse", "modifyUse"),
                phase: "output"
              }
            ],
            (o,r) => {
              const [perspective, tense] = getPerspectiveAndTense();
              const resources = findProtagCard("resources");
              const inventory = findProtagCard("inventory");

              hideCard(resources);
              hideCard(inventory);

              const resourceLine = resources
                ? inventory
                  ? "resources or inventory items"
                  : "resources"
                : inventory
                  ? "inventory items"
                  : "";

              return `# AI Instructions
## Role: Roleplay Game Master
## Directive: Based on the story and prompt components, determine what using ${r} costs ${PROTAGONIST}, what they gain from it, and how the attempt plays out in the story. 
## Formatting: Continue writing in ${tense}. Address ${PROTAGONIST} in ${perspective}.
## Action: ${PROTAGONIST} will attempt to use ${r}.${resourceLine ? `
## Determine how much this action costs ${PROTAGONIST}, and how much it gains them. Costs and gains are both in the form of ${resourceLine}, but not all actions have costs, and not all actions have gains. Some have both. Some have neither.
## You are determining costs and gains before writing out the action attempt. Your action attempt MUST make sense for the costs and gains you have set, so in many ways this determination shapes how the following action attempt must ultimately play out.` : ""}${resources ? `
## ${PROTAGONIST}'s Resources:
${resources.entry}
## Note: if Resources are used as a cost or gain, the resource name must be included exactly as it is listed. Do not change pluralization.`:""}${inventory ? `
## ${PROTAGONIST}'s Inventory:
${inventory.entry}
## Note: if Inventory items are used as a cost or gain, the item name must be included exactly as it is listed. Do not change pluralization.`:""}
## Word Count: High-priority. Your output is limited to ${this.OUTPUT_SIZE} words. Complete the entire template within that ${this.OUTPUT_SIZE}-word limit.
## Template:
${resourceLine ? `Costs: \${The costs for using ${r}, or "None" if there are none. Costs are deductive and detrimental. Use a negative number if ${resourceLine} should be increased as a cost. Costs must always be one or more of the ${resourceLine} ${PROTAGONIST} has. Costs should be listed as the exact name of a resource or item, followed by a colon then a number, e.g., "Credits: 30". Separate costs with commas.}
Gains: \${The benefits gained using ${r} in terms of ${resourceLine}, or "None" if there are none. Gains are additive and beneficial. Use a negative number if ${resourceLine} should be reduced as a gain.${resources ? ` If a resource is gained, it must be from ${PROTAGONIST}'s listed resources. ` :""}${inventory ? `Items gained can be among those already listed in ${PROTAGONIST}'s inventory, or new items to be added to it. ` : ""}Gains should be listed as the exact name of a resource or item, followed by a colon then a number, e.g., "Healing Potion: 1". Separate costs with commas.}

` : ""}\${Multi-line text block. Continue the narrative exactly where it left off, except with ${PROTAGONIST} attempting to use ${r}. Begin the attempt immediately, and complete the description of the attempt, including its success or failure, within the allotted word count.}`
            },
            NO_VISIBLELINE_OUTPUT_FORMATTING,
            useContinue
        ),
 new Tool(
            "Relationships",
            '🌐',
            ["relationships", "r"],
            false,
            [],
            "",
            "See how story cards and prompt cards connect",
            null,
            [          
              {
                message: Message.fromPool("setText", ABORT_OUTPUT),
                phase: "context"
              },   
              {
                message: Message.fromPool("exit"),
                phase: "context"
              },
              {
                message: new Message ("setRelationships", "setRelationships"),
                phase: "output"
              },
              {
                message: Message.fromPool("exit"),
                phase: "output"
              }
            ],
            (o,r) => "",
            NO_OUTPUT_FORMATTING
        ),
        new Tool(
            "Help",
            '📕',
            ["help", "h"],
            false,
            [],
            "",
            "View a basic guide to Toolbox",
            null,
            [          
              {
                message: Message.fromPool("setText", ABORT_OUTPUT),
                phase: "context"
              },   
              {
                message: Message.fromPool("exit"),
                phase: "context"
              },
              {
                message: new Message ("setHelp", "setHelp", "${options}"),
                phase: "output"
              },
              {
                message: Message.fromPool("exit"),
                phase: "output"
              }
            ],
            (o,r) => "",
            NO_OUTPUT_FORMATTING
        ),
        new Tool(
            "List",
            '📋',
            ["list", "l"],
            false,
            [],
            "",
            "View a list of Toolbox tools",
            null,
            [          
              {
                message: Message.fromPool("setText", ABORT_OUTPUT),
                phase: "context"
              },   
              {
                message: Message.fromPool("exit"),
                phase: "context"
              },
              {
                message: new Message ("setList", "setList", "${options}"),
                phase: "output"
              },
              {
                message: Message.fromPool("exit"),
                phase: "output"
              }
            ],
            (o,r) => "",
            NO_OUTPUT_FORMATTING
        )
    ];

    static TOOL_SYM_MAP = this.TOOLS.reduce((agg, t) => {
      agg[t.name.toLowerCase()] = t.sym;
      return agg;
    }, {});

    static list() {
      return `🧰 Toolbox Tools 🧰
Note: You can optionally include a request after most tool commands, e.g., "/mindview Jane". You can type anything as a request, though some tools require the name of a story card or character.

${this.TOOLS.filter(t => t.shortText).map(t => `${t.sym} ${t.name} - /${t.commands[0]} or /${t.commands[1]} - ${t.shortText}${t.requestLine ?`\n    Request: ${t.requestLine}` :""}`).join("\n")}`
    }

    static get(name) {
      return this.TOOLS.find(t => t.name.toLowerCase() === name?.toLowerCase());
    }

    static getSym(name){
      return this.TOOL_SYM_MAP[name.toLowerCase()];
    }

    postMessages(placeholders = {}){
      this.messages.forEach(m => Message.post(m.message, m.phase, placeholders));
    }

    getVisibleLine() {
      return `${VISIBILITY_SYM} Visible to AI? (Y/N): ${this.defaultVisible ? "Y" : "N"}`;
    }
  }
  
  class Command {
    constructor (tool, options, request, input, timer, skipMerge) {
      this.tool = tool;
      this.options = options;
      this.request = request;
      this.input = input;
      this.timer = timer;

      if(!skipMerge) {
        this.mergeTool();
      };
    }

    static fromEntryLine(line){
      line = line.replace("> ");
      
      const tool = Tool.get(line.split("Tool:")[1]?.split(' - ')[0]?.trim());
      
      if (!tool) return null;
      
      const options = line.split("Options:")[1]?.split(' - ')[0]?.trim().split(" ") || [];
      const request = unPunc(line.split("Request:")[1]?.trim()) || "";
      let rate = parseInt(line.split("Rate:")[1]?.trim());
      let timer = parseInt(line.split("Timer:")[1]?.trim());

      if (isActuallyNaN(rate)) rate = 20;

      if (isActuallyNaN(timer)) timer = rate;
      
      return new Command(tool, options, request, null, timer);
    }

    static getScheduled(resetTimer) {
      const partialCommands = ["Motive", "Reflect"];
      const card = getCard("Tool Schedule", "Schedule");
      if (!card) return null;

      const lines = card.entry.split("\n");
      let idx;
      let selected;
      let update;
      for (let i = 0; i < lines.length; i++) {
        let command = this.fromEntryLine(lines[i]); 
        if (command && command.tool && command.timer === 0) {
          if (history[history.length - 1].type === "continue"  || partialCommands.includes(command.tool.name)) {
            idx = i;
            selected = command;
            if (resetTimer) {
              update = true;
              lines[i] = lines[i].replace(/Timer:\s*-?\d+/i, "Timer: " + "-1");
            };
            break;
          }
        };
      };
      if (idx >= 0) {
        card.entry = lines.join("\n");
        if (phase === "output" || update) updateSchedule();
      };
      
      return selected;
    }

    static fromInput(input){
      if (typeof input !== "string") throw new Error("Command Parser expected a string and got a " + typeof input);
      const regex = /^(?:>\s*You(?:\s+say,)?\s*)?(.+)$/;
      input = input.replaceAll("\n", "").match(regex)?.[1].replace("> ", "").trim() || "";
      const parts = input.split(" ");

      if (!parts[0] || parts[0].startsWith("//") || !parts[0].replaceAll('"', "").startsWith("/")) return null;
      
      let tool = Tool.TOOLS.find(t => t.commands.includes(parts[0].toLowerCase().replace(/[^a-z0-9\s]/g, "")));

      if (!tool) tool = Tool.get("list");

      let optionIndex = parts.slice(1).findIndex(p => !p.startsWith("-")) + 1;
      if (optionIndex <= 0) optionIndex = parts.length;

      const options = parts.slice(1, optionIndex).map(o => o.toLowerCase().replace(/[^a-z0-9\s]/g, ""));
      let request = unPunc(parts.slice(optionIndex).join(" ").trim() || tool?.defaultRequest);

      const command = new Command(tool, options, request, input);
      command.schedule();
      return command;
    }

    static fromHistory(offset = 0) {
      const latest = history[history.length - 1 - offset];
      if (latest.type === "continue") return null;
      
      let tool;
      if (latest.text.trim().startsWith("[Scene instructions:")) {
        tool = Tool.get("Direct");
      } else {
        const filters = getFilters();
        if (!filters.some(f => latest.text.trim().startsWith(f))) return null;
        tool = Tool.get(latest.text.split("Tool:")[1]?.split(' - ')[0]?.trim());
      }
      const options = latest.text.split("Options:")[1]?.toLowerCase()?.split(' - ')[0]?.trim().split(" ") || [];
      const request = unPunc(latest.text.split("Request:")[1]?.replaceAll(tool.sym, "").trim() || tool?.defaultRequest);
      return new Command(tool, options, request, null, null, true);
    }

    static getActive(resetTimer){
      let command = Command.fromHistory();
      if (!command) command = Command.getScheduled(resetTimer);
      return command;
    }

    schedule() {
      if (!this.getOption("s") || !this.tool?.name || this.tool.name === "List" || this.tool.name === "Help") return;
      let card = getCard("Tool Schedule", "Schedule");
      if (!card) card = newCard(
        "📅 Tool Schedule",
        "Schedule",
        "Scheduled Commands - Sorted by Upcoming",
        `> These commands have been scheduled for automatic activation with the -s option
> Scheduled commands activate on the next available Continue action once their timer hits 0
> Commands can be added, altered, or removed in this card`
      )
      card.entry = card.entry + "\n" + this.toEntryLine();
    }

    toEntryLine() {
      if (this.tool.name === "List" || this.tool.name === "Help") return "";
      
      const s = this.getOption("s");
      let rate = parseInt(s?.slice(1));
      if (isActuallyNaN(rate)) rate = 10;

      return `> Tool: ${this.tool.name} - Timer: ${rate} - Rate: ${rate} - Start: ${continueCount()}${this.options.length > 1 ? ` - Options: ${this.options.filter(o => !o.startsWith("s")).join(" ")}` : ""} - Request: ${this.request}`;
    }

    getOption(option) {
      return this.options.find(o => o.startsWith(option));
    }

    getVisibleLine(){
      return this.tool.getVisibleLine();
    }

    toString(){
      return `${getBuffer()}${this.tool.sym} Tool: ${this.tool.name}${this.options && this.options.length > 0 ? ` - Options: ${this.options.join(" ")}` : ``}${this.tool.shortText ? ` - Request: ${this.request}` : ""}`;
    }

    prompt(){
      return this.tool?.prompt(this.options, this.request);
    }

    formatOutput(text, command){
      return this.tool?.formatOutput(text, command);
    }

    mergeTool(){
      if (!this.tool) return;

      if (!this.request) this.request = unPunc(this.tool.defaultRequest);
      this.tool.defaultOptions.forEach(o => {
        if (o.startsWith("v")) {
          let idx = this.options.findIndex(p => p.startsWith("v"));
          if (idx >= 0){
            this.options.splice(idx, 1);
          } else {
            this.options.push(o);
          };
        } else {
          let idx = this.options.findIndex(p => p.startsWith(o[0]));
          if (idx < 0) this.options.push(o);     
        };
      });
    }
  }
  
  switch(phase){
    case "input":
      assembleInput();
      break;

    case "context":
      assembleContext();
      break;
    
    case "output":
      assembleOutput();
      break;
    
    default:
      throw new Error("Invalid Phase");
    
  }
  return globalThis.text;

  // Core Logic
  function initializeState(){
    state.schedule = [];
    state.hiddenCards = [];
    state.motiveLog = {};
    state.reflectLog = {};
  }

  function assembleInput(){
    if (history.length === 0) {
      initializeState();
      parsePlaceholderCards();
      Settings.initialize();

      // Replace proxy placeholders from Generate with real ones.
      storyCards.forEach(c => {
        c.title = c.title.replaceAll("!{", "${");
        c.entry = c.entry.replaceAll("!{", "${");
      });

      // Replace placeholders in story card titles
      state.placeholders.forEach(p => {
        storyCards.forEach(c => {
          if (c.title.includes(`\${${p.question}}`)) 
            c.title = c.title.replaceAll(`\${${p.question}}`, p.answer);
        })
      })

      // placeholders can be large. Get rid of them to improve performance.
      delete state.placeholders;

      if (Settings.getValue("Hidden", "Dynamic Opening")) {
        globalThis.text = getDynamicOpening();
      };

      return;
    };
    Message.resetState();
    state.resetInInput = true;
    const command = Command.fromInput(globalThis.text);
    if (!command) {
      // This gives bracketed commands consistent formatting, i.e., no carats preceeding them which may confuse the editor's note for an action attempt. 
      globalThis.text = globalThis.text.replace(/^\n> \[/, "\n[").replace(/\]\.\n$/, "]\n");
      return;
    }
    if (!(command.tool instanceof Tool)){
      Message.postFromPool("exit", "context");
      Message.postFromPool("setText", "context", ABORT_OUTPUT);
      Message.postFromPool("exit", "output");
      Message.postFromPool("setText", "output", Tool.list());
      return `⛔ "${command.input}" is not a valid command ⛔`;
    };
    if (command.tool.messages.length > 0){
      command.tool.postMessages({request: command.request, options: command.options.join(",")});
      state.postedInInput = true;
    };
    if (command.options.some(o => o.startsWith("s")) && !(command.tool.name === "List" || command.tool.name === "Help")) {
      Message.postFromPool("prepend", "output", "📅 Command Scheduled - check Tool Schedule story card\n\n")
    };
    Message.executeByPhase("input");
    if (state.exit) {
      state.exit = false;
      return;
    };
    globalThis.text = `${command.toString()}${globalThis.text.startsWith("\> ") ? "" : "\n\n"}`;
  }
  
  function assembleContext() {
    if (!state.resetInInput) Message.resetState();
    state.resetInInput = false;
    state.maxChars = info.maxChars;
    removeFaded("motive");
    removeFaded("reflect");
    const startingLineCount = getFilteredLinesFromHistory().length;
    
    updateSchedule();
    updatePromptSequenceCard();

    const command = Command.getActive();

    if (!state.postedInInput) {
      command?.tool?.postMessages({request: command.request, options: command.options.join(",")});
    };
    state.postedInInput = false;

    const latest = latestContinue();

    for(tool of Tool.TOOLS) {
      if (tool.onContinue && latest?.text.includes(tool.sym)) {
        tool.onContinue();
        break;
      }
    }

    clearTempData(command?.tool.name);

    Message.executeByPhase("context");

    if (state.exit) {
      state.exit = false;
      return;
    };

    let [cards, nonCards] = getNormalStoryCards(Settings.getValue("Context", "Advanced Personification"));

    const lines = getFilteredLinesFromHistory();
    const imperativeIndex = getParagraphIndex(lines, -1);
    const breakPoint = getBreakPoint(lines, startingLineCount);
    const prompt = command?.prompt();
    let floatingPrompt;
    if (Settings.getValue("Context", "Prompt Cards")) {
      if (storyCards.some(c => isPromptCard(c))) {
        const promptSequence = getPromptSequence();
        if (!isPromptCardsInSequence(promptSequence))
          sequencePromptCards(promptSequence);
        floatingPrompt = assembleFloatingPrompt(promptSequence);
      };
    }

    

    if (state.hideAddendums) {
      cards = cards.join("\n").split("\n").filter(l => !(l.includes("Motive:") || l.includes('Motive":') || l.includes("Thoughts:") || l.includes('Thoughts":')));
      floatingPrompt = floatingPrompt.split("\n").filter(l => !(l.includes("Motive:") || l.includes('Motive":') || l.includes("Thoughts:") || l.includes('Thoughts":'))).join("\n");
    }

    const finalLines = [];
    const boundaryMarkers = Settings.getValue("Context", "Boundary Markers");
    const instructionsAbove = Settings.getValue("Context", "Instructions Behind Prompt Cards");

    if (boundaryMarkers) finalLines.push("[story begins here]");
    finalLines.push(...lines.slice(0, breakPoint));
    finalLines.push("");

    if(boundaryMarkers && (cards.length > 0 || nonCards)) {
      finalLines.push("[background information begins here]");
    };

    if (cards.length > 0 && !state.hideCards) finalLines.push(...cards);
    if (nonCards) finalLines.push(nonCards);

    if (floatingPrompt && !instructionsAbove && !state.hideCards) {
      if (boundaryMarkers) finalLines.push("[prompt components begin here]");
      finalLines.push(floatingPrompt);
      finalLines.push("");
    };

    if (boundaryMarkers) finalLines.push("[core instructions begin here]");
    if (!prompt && Settings.getValue("Context", "Default Instructions")) {
        finalLines.push(DEFAULT_INSTRUCTIONS);
    } else {
        finalLines.push(MINIMAL_INSTRUCTIONS);
    };

    if (floatingPrompt && instructionsAbove && !state.hideCards) {
      if (boundaryMarkers) finalLines.push("[prompt components begin here]");
      finalLines.push(floatingPrompt);
      finalLines.push("");
    };

    if (boundaryMarkers) finalLines.push("[additional instructions begin here]");

    if (Settings.getValue("Context", "Basic Personification")) {
        finalLines.push(BASIC_PERSONIFICATION);
        finalLines.push("");
    };

    if (!prompt && Settings.getValue("Context", "Echo Ban")) {
        finalLines.push(ECHO_BAN);
    };
    finalLines.push("");

    if (boundaryMarkers) finalLines.push("[recent story begins here]");
    
    finalLines.push(...lines.slice(breakPoint, imperativeIndex));

    if (state.memory.authorsNote) finalLines.push(state.memory.authorsNote);

    if (Settings.getValue("Context", "Imperative")) finalLines.push(IMPERATIVE);

    finalLines.push(...lines.slice(imperativeIndex));
    if (prompt) {
      if (boundaryMarkers) finalLines.push("[instructions for next output begin here]")
      finalLines.push("");
      finalLines.push(prompt);
      finalLines.push("");
    };

    state.hideCards = false;

    globalThis.text = finalLines.join("\n").replace(/\n{3,}/g, "\n\n");

    assessAvailableContext();
  }

  function assembleOutput() {
    if(!state.placeholdersRemoved && continueCount() > 1) {
      state.placeholdersRemoved = true;
      storyCards.forEach(c => {
        if (c.type.toLowerCase() === "placeholder"){
          removeCard(null, null, c.id);
        }
      });
    }

    Message.executeByPhase("output");
    if (state.exit) {
      state.exit = false;
      return;
    };

    const command = Command.getActive(true);

    const parsedOutput = parseRawOutput(globalThis.text);

    const commandOutput = command?.formatOutput(parsedOutput, command);

    const text = commandOutput
      ? commandOutput
      : parsedOutput;

    globalThis.text = text;

    unhideCards();
  }

  // Utilities
  function clearTempData(name) {
    const tempDataTools = ["Card", "Update", "Motive", "Reflect", "Use"];

    tempDataTools.forEach(t => {
      if (name !== t) state[`temp${t}Data`] = null;
    });
  }

  function getPerspectiveAndTense() {
    const style = getComponentCard("Style", null, null, true);
    const perspective = getValueFromCard(style, "Perspective").toLowerCase() || "in the same perspective as the rest of the story";
    let tense = getValueFromCard(style, "Tense").toLowerCase();
    tense = tense
      ? tense + " tense"
      : "the same tense as the rest of the story";
    return [perspective, tense];
  }

  function getProtagonist() {
    const protagonist = getComponentCard("Character", "Protagonist");
    const name = partsFromTitle(deSymbol(protagonist?.title))[0]?.trim() || "the protagonist";
    return name;
  }

  function latestContinue() {
      for (let i = history.length - 1; i >= 0; i--){
        if (history[i].type === "continue") return history[i];
      }
  }

  function deSymbol(text) {
    if(typeof text !== "string") return text;

    text = text.trim();
    return /^[a-zA-Z0-9]$/.test(text.charAt(0))
      ? text
      : text.split(" ").slice(1).join(" ");
  }

  function getSymbolFromTitle(text) {
    if(typeof text !== "string") return;

    if (text === deSymbol(text)) return null;

    return text.slice(0, text.indexOf(deSymbol(text)[0])).trim();
  }

  function aAn(nextWord){
    return ["a","e","i","o","u"].some(l=>nextWord.toLowerCase().startsWith(l)) ? "an" :"a"
  }
  
  function parsePlaceholderCards(){
    const main = getCard("placeholder - main", "placeholder");
    const protag = getCard("placeholder - protagonist", "placeholder");
    const background = getCard("placeholder - background", "placeholder");
    
    if (background) {
      if (background.entry.trim().length > 0)
        createCardsFromPlaceholder(background, "Background");

      if (protag) storyCards.forEach(c => {
        c.title = c.title.replace("(Protagonist)", "(Supporting Character)");
      })

      removeCard(background.title, background.type);  
    }

    if (main) {
      if (main.entry.trim().length > 0)
        createCardsFromPlaceholder(main, "Main");

      removeCard(main.title, main.type);
    }

    if (protag) {
      if (protag.entry.trim().length > 0)
        handleProtagonistPlaceholder(protag);

      removeCard(protag.title, protag.type);
    }

    PROTAGONIST = getProtagonist();

    storyCards.forEach(c => {
      c.entry = c.entry.replace(/!{protagonist}/gi, PROTAGONIST);
      c.title = c.title.replace(/!{protagonist}/gi, PROTAGONIST);
    });
  };

  function handleProtagonistPlaceholder(placeholderCard){
      const modules = parseJSONStringToCardTemplate(placeholderCard.entry.trim());
      if (!modules?.length) return;

      const protagonist = modules.find(m => {
        const [, type, subtype] = partsFromTitle(m.component);
        return type?.toLowerCase() === "character" && subtype?.toLowerCase() === "protagonist"
      })
        || modules.find(m => {
        const [, type] = partsFromTitle(m.component);
        return type?.toLowerCase() === "character";
      })

      if (!protagonist) return;

      if (partsFromTitle(protagonist.component)[2].toLowerCase() !== "protagonist") {
        protagonist.component = protagonist.component.split(" - ")[0] + " - Character (Protagonist)";
      }

      const protagonistName = partsFromTitle(deSymbol(protagonist.component))[0];

      const protagonistModules = [
        protagonist,
        ...modules.filter(m => {
          const [,,, owner] = partsFromTitle(deSymbol(m.component));
          return owner?.toLowerCase() === protagonistName?.toLowerCase();
        })
      ];

      const existingProtagonist = storyCards.find(c =>{
          const [, type, subtype] = partsFromTitle(c.title);
          return type?.toLowerCase() === "character" && subtype?.toLowerCase() === "protagonist";
      });
      let existingProtagonistName;
      if (existingProtagonist) {
        const typesToRemove = ["appearance", "personality", "speech"];
        existingProtagonistName = partsFromTitle(deSymbol(existingProtagonist.title))[0];

        storyCards = storyCards.filter(c => {
          const [, type, subtype, owner] = partsFromTitle(deSymbol(c.title));
          return !(
            (
              type.toLowerCase() === "character"
              && subtype.toLowerCase() === "protagonist"
            )
            || (
              typesToRemove.includes(type.toLowerCase()) 
              && owner?.toLowerCase() === existingProtagonistName.toLowerCase()
            )
            || protagonistModules.some(m => {
                const [, moduleType,, moduleOwner] = partsFromTitle(deSymbol(m.component))
                return moduleType?.toLowerCase() === type?.toLowerCase() 
                  && owner?.toLowerCase() === existingProtagonistName.toLowerCase()
                  && moduleOwner?.toLowerCase() === protagonistName.toLowerCase();
            })
          );
        });
        if (existingProtagonistName && protagonistName) {
          const noLastNameWords = ["of", "from", "the"];
          const existingParts = existingProtagonistName.split(" ").map(p => p.trim());
          const parts = protagonistName.split(" ").map(p => p.trim());
          const existingFirstName = existingParts.find(p => /^[A-Z]/.test(p));
          const firstName = parts.find(p => /^[A-Z]/.test(p));
          let existingLastName;
          if (!noLastNameWords.some(w => existingParts.some(p => p.toLowerCase() === w))) {
            existingLastName = existingParts.reverse().find(p => /^[A-Z]/.test(p));
          }
          let lastName;
          if (!noLastNameWords.some(w => parts.some(p => p.toLowerCase() === w))) {
            lastName = parts.reverse().find(p => /^[A-Z]/.test(p));
          }
          storyCards.forEach(c => {
            c.entry = c.entry.replaceAll(existingProtagonistName, protagonistName);
            c.title = c.title.replaceAll(existingProtagonistName, protagonistName);
            if (existingFirstName && firstName) {
              c.entry = c.entry.replaceAll(existingFirstName, firstName);
              c.title = c.title.replaceAll(existingFirstName, firstName);
            };
            if (existingLastName) {
              c.entry = c.entry.replaceAll(existingLastName, lastName || protagonistName);
              c.title = c.title.replaceAll(existingLastName, lastName || protagonistName);  
            };
          });
        };
      };
      
      createCardsFromPlaceholder(protagonistModules, "Protagonist");
  }

  function createCardsFromPlaceholder(placeholder, type) {
    const DEFAULT_CARD_TYPES = ["character", "class", "race", "location", "faction"];
    const PROMPT_DESCRIPTION = "This is a Prompt card and should not have any Triggers. All cards with the Prompt type are placed a set distance back from the end of context and are seen by the AI all times.";
    try {
      if(!Array.isArray(placeholder) && (!placeholder.entry.trim().startsWith("[") || !placeholder.entry.trim().endsWith("]"))) throw new Error();
      
      const modules = Array.isArray(placeholder) 
        ? placeholder
        : parseJSONStringToCardTemplate(placeholder.entry.trim()) || [];
      modules.forEach(m => {
          if (m.keys && DEFAULT_CARD_TYPES.includes(m.componentType?.toLowerCase()))
            m.componentType = m.componentType.toLowerCase();
          newCard(
              m.component || "Background",
              `${m.keys ? "" : "Prompt - "}${m.componentType ? `${m.componentType}` : `${type}`}` || "class",
              m.keys ? `{\n${deSymbol(m.component)}\n${m.entry}\n}`: m.entry,
              m.keys ? PROMPT_DESCRIPTION : "",
              m.keys || ""
          );
      });
    } catch {
      newCard(
        "Background",
        `Prompt - ${type}`,
        `> Background: ${placeholder.entry}`,
        PROMPT_DESCRIPTION
      );
    };
  }

  function pluralCompare(a, b) {
    if (typeof a !== "string" || typeof b !== "string") return;
    if (a === b) return true;
    
    const pluralA = pluralize(a);
    if (pluralA === b) return true;
    
    const pluralB = pluralize(b);
    if (a === pluralB) return true;
    if (pluralA === pluralB) return true;
    
    return false;
  }

  function modifyUse(){
    const sym = Tool.getSym("Use");
    let lines = globalThis.text
      .split("\n")
      .map(l => {
        const trim = l.trim().toLowerCase();
        return (trim.startsWith("using:") || trim.startsWith("costs:") || trim.startsWith("gains:")) 
          ? `${sym} ${l}` 
          : l;
      });

    const lastSymIdx = lines.findLastIndex(l => l.startsWith(sym));

    lines = lines.filter((l,i) => l || i > lastSymIdx);

    if (lastSymIdx > 0 && Settings.getValue("Tool", "Reminder Text")) lines.splice(lastSymIdx + 1, 0, `📝 Costs and gains have been removed from / added to your protagonist's Inventory and/or Resources cards`)
      
    globalThis.text = lines.join("\n");

    const resources = findProtagCard("resources");
    const inventory = findProtagCard("inventory");

    if (state.tempUseData?.count === continueCount()) {
      if (state.tempUseData?.resourcesEntry) {
        resources.entry = state.tempUseData.resourcesEntry;
      }
      if (state.tempUseData?.inventoryEntry) {
        inventory.entry = state.tempUseData.inventoryEntry;
      }
    }

    state.tempUseData = {
      resourcesEntry: resources?.entry,
      resourcesId: resources.id,
      inventoryEntry: inventory?.entry,
      inventoryId: inventory.id,
      useLines: lines.filter(l => l.startsWith(sym)),
      count: continueCount()
    }

    useCostsAndGains(globalThis.text);
  }

  function useCostsAndGains(text){
    const currencyRegex = /[$€£¥₹₩₽₿¢₪₫₱₲₴₵₸₺₼₾₿¤]/g;

    const costs = text
      .replace(currencyRegex, '')
      .split("Costs:")[1]
      ?.split("\n")[0]
      .split(",")
      .map(x => x.trim())
      .filter(x => Boolean && x !== "none" && x.includes(":"))
      || [];
      
    const gains = text
      .replace(currencyRegex, '')
      .split("Gains:")[1]
      ?.split("\n")[0]
      .split(",")
      .map(x => x.trim())
      .filter(x => Boolean && x !== "none" && x.includes(":"))
      || [];

    if (costs.length > 0 || gains.length > 0){
      const resources = state.tempUseData.resourcesId ? getCard(null, null, state.tempUseData.resourcesId) : null;
      const inventory = state.tempUseData.inventoryId ? getCard(null, null, state.tempUseData.inventoryId) : null;

      if (!resources && !inventory) return;

      let resourcesChanged = false;
      let inventoryChanged = false;
    

      function modifyResourcesAndInventory(c, isCost) {
        let addedAsResource = false;
        let number = parseInt(c.match(/(?<=:).*$/)[0]);

        const item = c.match(/^[^:]*/g)[0];
        if (isActuallyNaN(number)) number = 1;
        if (resources) {
          resources.entry = resources.entry
            .split("\n")
            .map(l => {
              const lower = l.toLowerCase();
              const hasItem = lower.includes(item.toLowerCase() + ":");
              const hasPlural = lower.includes(pluralize(item.toLowerCase()) + ":");
              if(hasItem || hasPlural) {
                const int = parseInt(lower.match(/(?<=:).*$/)[0]?.replace(currencyRegex, '').trim());
                resourcesChanged = true;
                addedAsResource = true;
                const isPercent = lower.includes("%");
                const maximum = parseInt(lower.split("/")[1]);
                let newInt = Math.max(isCost ? int - number : int + number, 0);
                if (isPercent) newInt = Math.min(newInt, 100);
                if (!isActuallyNaN(maximum)) newInt = Math.min(newInt, maximum);

                return l.replace(""+ int, "" + newInt);
              } else {
                return l;
              };
            })
            .join("\n");
        };

        let addedAsItem = false;
        if(inventory) {
          const isPrompt = isPromptCard(inventory);
          const items = inventory.entry.split("\n").map(l => l.startsWith("> ") ? l.slice(2) : l);
          for(let i = 0; i < items.length; i++) {
            const int = parseInt(items[i].match(/^[^:]*/g)[0]);
            const im = items[i].match(/(?<=:).*$/)[0];
            if (!isActuallyNaN(int)) {
              if (pluralCompare(item.toLowerCase(), im.toLowerCase())){
                if (isCost) {
                  if (int - number <= 0) {
                    items.splice(i, 1);
                  } else {
                    items[i] = `${im}: ${int - number}`;
                  }
                } else {
                  items[i] = `${im}: ${int + number}`;
                };
                inventoryChanged = true;
                addedAsItem = true;
                break;
              };
            }
          }
          
          if (addedAsItem) inventory.entry = isPrompt 
            ? inventory.map(l=> l ? `> ${l}` : l).join("\n")
            : inventory.join("\n");
          
          if (!addedAsResource && !addedAsItem && !isCost) inventory.entry = inventory.entry
            + `\n${isPrompt ? "> " : ""}${item}: ${number}`;
        };

      }

      costs.forEach(c => modifyResourcesAndInventory(c, true));

      gains.forEach(c => modifyResourcesAndInventory(c, false));
    }
  }

  function useContinue () {
    if (
      !state.tempUseData 
      || !(state.tempUseData.resourcesId || state.tempUseData.inventoryId)
    ) return;

    const sym = Tool.getSym("Use");
    let text;

    if (history[history.length - 1].type === "continue") {
      text = history[history.length - 1].text;
    } else {
      text = history[history.length - 2].text;
    };

    if (
      text
        .split("\n")
        .filter(l => l.startsWith(sym))
        .some(l => !state.tempUseData.useLines.includes(l))
    ) {
      const resources = state.tempUseData.resourcesId ? getCard(null, null, state.tempUseData.resourcesId) : null;
      const inventory = state.tempUseData.inventoryId ? getCard(null, null, state.tempUseData.inventoryId) : null;

      if (resources) resources.entry = state.tempUseData.resourcesEntry;
      if (inventory) inventory.entry = state.tempUseData.inventoryEntry;

      useCostsAndGains(text);
    }
  }

  function hideCard(card) {
    if (!card) return;
    state.hiddenCards.push({title: card.title, type: card.type});
  }

  function isCardHidden(card){
    for (let c of state.hiddenCards) {
      if (deSymbol(c.title) === deSymbol(card.title) && c.type === card.type) return true;
    };
    return false;
  }

  function unhideCards(){
    state.hiddenCards = [];
  }

  function isKeyValue(l) {
    if (typeof l !== "string") return;

    const idx = l.indexOf(":");
    if (idx < 0 || idx > 40) return false;
    return true;
  }

  function assessAvailableContext() {
    if (!Settings.getValue("Misc", "Context Size Warning")) return;
    const tokensAvailable = Math.floor(info.maxChars/3.95);
    const tokensPresent = Math.ceil(globalThis.text.length/3.95);
    const actualMargin = tokensAvailable - tokensPresent;
    if (actualMargin < 0) {
      const frequency = Settings.getValue("Misc", "Context Warning Frequency");
      const count = continueCount();
      if (state.lastContextWarning === undefined){
        state.lastContextWarning = count;

        Message.postFromPool("prepend", "output", `${getBuffer()}⚠️ Context Size Warning - Tokens in Context: ${tokensPresent} / Context Length: ${tokensAvailable} ⚠️
📝 For more details, read the Notes section of the Misc Settings story card.\n\n`);
      } else if (state.lastContextWarning + frequency <= count) {
        state.lastContextWarning = count;

        Message.postFromPool("prepend", "output", `${getBuffer()}⚠️ Context - ${tokensPresent} / ${tokensAvailable} ⚠️\n`);
      }
    };
  }

  function nearestCardMatch(name, filter, sort, randomOnNoMatch = true) {
    const cardSet = filter
      ? storyCards.filter(c => filter(c))
      : [...storyCards];

    if (sort) cardSet.sort(c => sort(c));

    const randomCard = () => cardSet[Math.floor(Math.random()*cardSet.length)];

    if (!name) {
      if (randomOnNoMatch) return randomCard();
      return;
    }

    if (name.toLowerCase() === "random") return randomCard();

    const lower = name.trim().toLowerCase();
    if (!lower || lower === "random") return randomCard();
    let card = cardSet.find(c => deSymbol(c.title.split(" - ")[0].toLowerCase()) === lower)
      || cardSet.find(c => deSymbol(c.title.toLowerCase()) === lower)
      || (() => {
        const words = lower.split(" ").filter(Boolean);
        if (!words.length) return randomCard();
        
        let bestCard = null;
        let maxCount = -1;
        
        for (const c of cardSet) {
          const title = deSymbol(c.title.toLowerCase());
          const count = words.reduce((agg, w) => 
            title.includes(w) ? agg + 1 : agg, 0);
          
          if (count > maxCount) {
            maxCount = count;
            bestCard = c;
          };
        };
        
        return maxCount > 0 ? bestCard : randomCard();
      })();
    return card;
  }

  function characterCardFilter(card) {
    if (card.title.split(" - ")[1]?.split("(")[0].trim().toLowerCase() === "character") return true;
    if (card.entry.toLowerCase().includes("gender:") || card.entry.toLowerCase().includes("personality:")) return true;
    return false;
  }

  function pluralize(word) {
    if (!word) return word;
    
    const lower = word.toLowerCase();
    
    // Uncountable / same form
    if (['sheep', 'deer', 'fish', 'species', 'aircraft', 'moose'].includes(lower)) {
      return word;
    }
    
    // s, x, z, ch, sh → add "es"
    if (lower.endsWith('s') || lower.endsWith('x') || lower.endsWith('z') ||
        lower.endsWith('ch') || lower.endsWith('sh')) {
      return word + 'es';
    }
    
    // consonant + y → ies
    if (lower.endsWith('y') && !'aeiou'.includes(lower[lower.length - 2])) {
      return word.slice(0, -1) + 'ies';
    }
    
    // Default: just add "s"
    return word + 's';
  }

  function setDirect(){
    const command = Command.getActive();
    const latest = history[history.length - 1];
    if (!(latest.type !== "continue" && latest.text.includes("[Scene instructions:"))){
      Message.postFromPool("appendHistory", "context", `${getBuffer()}[Scene instructions: ${command.request}.]\n\n`);
      // history[history.length - 1].text += `\n[Scene instructions: ${command.request}.]\n`;
      Message.postFromPool("prepend", "output", `${getBuffer()}[Scene instructions: ${command.request}.]\n\n`);
    };
  }

  function setRelationships(){
    const hierarchy = ["World", "Region", "Location", "Faction", "Event", "Species", "Character",  "Item"];

    const map = [];
    hierarchy.forEach((h, i) => {
      storyCards.forEach(c => {
        let [name, type] = partsFromTitle(deSymbol(c.title));
        if (!name) name = c.entry.split("Name:")[1]?.split("\n")[0].trim();
        if (!name) return;
        const sym = getSymbolFromTitle(c.title);

        if (type === h){
          map.push(`${sym ? `${sym} ` : ""}${name} (${type})`);
          hierarchy.slice(i).forEach(e => {
            let values = c.entry.split(`${pluralize(e)}:`)[1]?.split("\n")[0]?.trim();
            if(values?.includes(";")){
              values = "\n>> " + values.split(";").join("\n>>");
            }
            if (values) {
              map.push(`> ${pluralize(e)}: ${values}`);
            };
          });
          if (map[map.length - 1].startsWith("> ")) {
            map.push("");
          } else {
            map.pop();
          }
        };
      });
    });

    globalThis.text = `${Tool.get("Map").getVisibleLine()}\n\n${map.length > 0 ? map.join("\n").trim() : "🌐 No Card Relationships Found"}\n\n`;
  }

  function setHelp(options){
    const visibleLine = Tool.get("Help").getVisibleLine();
    const HELP_TEXT = `🧰 Toolbox Guide 🧰

⚙️ Required Model Settings
> Optimized Context: MUST BE OFF (Gameplay -> Story Generator -> Memory System)
> Context Length: 4000+  (Gameplay -> Story Generator -> Memory System)
> Response Length: 200+   (Gameplay -> Story Generator -> Model Settings)
> Raw Model Output: On   (Gameplay -> Testing & Feedback)

🛠️ Tools
> Tools are special scripted functions that offer a wide range of utility
> Tools can be activated by entering slash commands into Do or Say, e.g., "/card"
> You can include a request when entering your command, e.g., "/card Deepwater Station"
> For a brief overview of each tool command and what it does, enter "/list"
> For a more detailed look at the specifics of how each tool works, go to:
https://github.com/FaraC-scripts/Toolbox

${VISIBILITY_SYM} Visibility
> Most tools output "${VISIBILITY_SYM} Visible to AI? (Y/N)" as their top line.
> You can swap the Y/N at any time by editing the output's text.
> If set to Y, the AI will be instructed to treat that output as side text and continue the story.
> If set to N, the entire output will be excluded from context and not seen by the AI.

🧩 Compound Requests
> The Update, Motive, and Reflect tools accept compound requests.
> Compound requests have two parts, an identifier and instructions, separated by a semicolon.
> The identifier is always required. The instructions are always optional.
> E.g., "/update James's Background; include what he shared about his childhood"
> In this case, the identifier, "James's Background", determines the card to update.
> The instructions, "include what he shared...", determine what sort of updates to make.

📅 Tool Scheduling and Automation
> Tools can be scheduled to happen automatically, repeating every # turns
> To do this, include the "-s#" option in your input after a slash command and before the request, e.g., "/card -s20 a new character".
> The number after the "-s" determines how often the tool activates. The tool also activates on the turn you schedule it.
> Scheduling a command creates a 📅 Tool Schedule story card or adds a new line if one already exists. You can adjust or remove scheduled tools here.

🗂️ Context Management
> Toolbox adds a number of elements to the context sent to the AI every action
> Each element can be turned on or off in the Context Settings story card
${Settings.getValue("Context", "Default Instructions") ? "🟢" : "🔴"} Default Instructions: a large set of generic writing guidelines - Tokens: ${Settings.SIZES.default_instructions}
${Settings.getValue("Context", "Prompt Cards") ? "🟢" : "🔴"} Prompt Cards: the contents of story cards with the "Prompt" type - Tokens: ${Settings.SIZES.prompt_cards}
${Settings.getValue("Context", "Basic Personification") ? "🟢" : "🔴"} Basic Personification: instructions encouraging complex characters - Tokens: ${Settings.SIZES.basic_personification}
${Settings.getValue("Context", "Advanced Personification") ? "🟢" : "🔴"} Advanced Personification: more extensive instructions - Tokens: ${Settings.SIZES.advanced_personification} per character
${Settings.getValue("Context", "Echo Ban") ? "🟢" : "🔴"} Echo Ban: a strong instruction aimed at preventing repetitive outputs - Tokens: ${Settings.SIZES.echo_ban}
${Settings.getValue("Context", "Imperative") ? "🟢" : "🔴"} Imperative: a very strong instruction to move the story forward - Tokens: ${Settings.SIZES.imperative}
${Settings.getValue("Context", "Boundary Markers") ? "🟢" : "🔴"} Boundary Markers: small notations that help separate context elements - Tokens: ${Settings.SIZES.boundary_markers}

⚙️ Toolbox Settings
> Settings for Toolbox can be found and edited in your Story Cards, near the bottom
> Settings are broken up into three Settings cards
 >> Tool Settings: manages how tools function, with both general and tool-specific settings
 >> Context Settings: manages the various elements Toolbox adds to context every turn
 >> Misc Settings: manages warning messages and output processing${storyCards.some(c => isPromptCard(c)) ? `

📋️ Prompt Sequence
> Your Prompt Sequence can be found and edited in your Story Cards, under Settings
> You can change the order your prompt cards are presented to the AI here
> You can also hide individual prompt cards here by changing Y/N next to the card name`: ""}
`

    globalThis.text = `${getBuffer()}${visibleLine}\n${HELP_TEXT}` 
  }

  function setList(options){
    const visibleLine = Tool.get("List").getVisibleLine();

    globalThis.text = `${getBuffer()}${visibleLine}\n${Tool.list()}`;
  }


  function getValueFromCard(card, key){
    if(!card || !key) return "";
    key += ":";
    return card.entry
      .split("\n")
      ?.find(l => l.includes(key))
      ?.split(key)[1]
      ?.trim()
      || "";
  }

  function getDynamicOpening() {
    const narrative = getComponentCard("Narrative", null, null, true);
    const scenario = getComponentCard("Scenario", null, null, true);
    const style = getComponentCard("Style", null, null, true);
    const perspective = getValueFromCard(style, "Perspective").toLowerCase();
    const tense = getValueFromCard(style, "Tense").toLowerCase();
    const backstory = getComponentCard("Backstory", null, null, true);
    const openingCircumstances = getValueFromCard(backstory, "Opening Circumstances");
    if (backstory?.entry.trim().length === 0) 
      storyCards.splice(
        storyCards.findIndex(c => deSymbol(c.title) === deSymbol(backstory.title) && c.type === backstory.type),
        1
      );

    const work = narrative
      ? "the story" 
      : scenario
        ? "the scenario"
        : "writing";
    
    const opening = backstory
      ? openingCircumstances
        ? openingCircumstances
        : "Open with the most recent events described in the backstory."
      : narrative
        ? "Open with the first events described in the synopsis."
        : scenario
          ? "Open as the scenario begins to play out."
          : "Open somewhere that makes sense.";

    return `[Start ${work}. ${opening} Address ${PROTAGONIST} in ${perspective || "second-person"}, ${tense || "present"} tense.]\n\n`
  }

  function isPromptCard(card) {
    const type = typeof card === "string"
      ? card
      : card?.type;
    if (!type) return;
    return type.trim().toLowerCase().startsWith("prompt");
  }

  function trimEntry(entry){
    const trimmed = [];
    const mind = [];
    entry
      .replace(/^> |^{\n|\n}/gm,"")
      .trim()
      .split("\n")
      .forEach(l => {
        if (l.trim().startsWith("Reflection:") || l.trim().startsWith("Prior Motive:") || l.trim().startsWith("Current Motive:")) {
          mind.push(l);
        } else {
          trimmed.push(l);
        };
      });

    return [trimmed.join("\n"), mind.join("\n")];
  }
  
  function partsFromTitle (title) {
    if (typeof title !== "string") return ["","","",""];
    const parts = title
      .split(" - ")
      .reduce((agg, p) => {
        agg.push(...p.split("("));
        return agg;
      }, []);
    if (!title.includes(" - ")) parts.unshift("");
    const name = parts[0].trim() || "";
    let type = parts[1].trim() || "";
    const closure = Math.max(parts.slice(2).join("(").lastIndexOf(")") || 0, 0);
    const subtype = parts.slice(2).join("(").slice(0, closure).trim() || "";
    let owner;
    if (type.includes("'s ")) {
      owner = type.split("'s")[0].trim();
      type = type.split("'s").slice(1).join("'s").trim() || "";
    }
    return [name, type, subtype, owner];
  }

  function getComponentCard(type, subtype, name, promptOnly) {
    for (card of storyCards) {
      if (promptOnly && !isPromptCard(card)) continue;
      const [cardName, cardType, cardSubtype] = partsFromTitle(deSymbol(card.title));

      if (name && cardName?.toLowerCase() !== name.toLowerCase()) continue;
      if (type && cardType?.toLowerCase() !== type.toLowerCase()) continue;
      if (subtype && cardSubtype?.toLowerCase() !== subtype.toLowerCase()) continue;

      return card;
    }
    return null;
  }

  function newPromptSequenceCard() {
    const [ids, titles] = getSequenceFromCards();
    state.promptSequenceIds = ids;
    return newCard(
      "📋️ Prompt Sequence",
      "Settings",
      titles.map(s => "Y - " + s).join("\n"),
      `> Prompt Cards with "Y - " in front of their name will be inserted into context in the order shown above.\n> Prompt Cards with "N - " in front of their name will be hidden.\n> You may change the order here, and change Y/N`
    );
  }
  
  function getSequenceFromCards(){
      return storyCards
        .filter(c => isPromptCard(c))
        .reduce((acc, c) => {
          acc[0].push(c.id);
          acc[1].push(`${c.title.trim()}`);
          return acc;
        }, [[],[]]);
  }

  function getPromptSequence() {
    let promptSequenceCard = getCard("Prompt Sequence", "Settings");

    if (!promptSequenceCard) promptSequenceCard = newPromptSequenceCard();

    return promptSequenceCard.entry.split("\n").map(l => l.trim()).filter(l => !/^N - /i.test(l)).map(l => deSymbol(l.replace(/^Y - /i, ""))).filter(Boolean);
  }

  function updatePromptSequenceCard() {
    let promptSequenceCard = getCard("Prompt Sequence", "Settings");
    if (!promptSequenceCard) {
      newPromptSequenceCard();
      return;
    };
    const lines = promptSequenceCard.entry.split("\n").filter(Boolean);
    const currentSequence = lines.map(l => l.replace(/^[YN] - /i, "").trim());

    state.promptSequenceIds ??= currentSequence.map(s => storyCards.find(c => c.title === s)?.id || "!!!");

    const [ids, titles] = getSequenceFromCards();

    currentSequence.forEach((s,i) => {
      if (!titles.some(t => deSymbol(t) === deSymbol(s))){
        if (currentSequence.some(x => deSymbol(x) === deSymbol(titles[i]))){
          lines[i] = "!!!";
          state.promptSequenceIds[i] = "!!!";
        } else {
          if(ids[i] === state.promptSequenceIds[i]){
            currentSequence[i] = titles[i];
            const prefix = lines[i]?.split(" - ")[0];
            lines[i] = `${prefix || "Y"} - ${titles[i]}`;
          } else {
            lines[i] = "!!!";
          }
        }
      } 
    });

    ids.forEach((id,i) => {
      if (!state.promptSequenceIds.includes(id)){
        lines.push("Y - " + titles[i]);
        state.promptSequenceIds.push(id);
      }
    });

    promptSequenceCard.entry = lines.filter(l => l !== "!!!").join("\n");
    state.promptSequenceIds = state.promptSequenceIds.filter(id => id !== "!!!");
  }

  function isPromptCardsInSequence(sequence) {
    let i = 0;
    for (card of storyCards) {
      if(isPromptCard(card)) {
        if (i >= sequence.length - 1) return false;
        if (deSymbol(card.title) !== sequence[i]) return false;
        i++;
      };
    };

    return true;
  };

  function sequencePromptCards(sequence) {
    const newCards = storyCards.filter(c => !isPromptCard(c) || !sequence.some(s => deSymbol(c.title) === s));
    const visited = [];
    sequence.forEach(s => {
      const idx = storyCards.findIndex((c,i) => deSymbol(c.title) === s && !visited[i]);

      if (idx >= 0){
        newCards.push(storyCards[idx]);
        visited[idx] = true;
      };
    });
    storyCards = newCards;
    updatePromptSequenceCard();
  }

  function getParagraphIndex(lines, count) {
    if (!Array.isArray(lines)) return null;

    if (count === 0) return 0;

    if (!count) return null;

    let current = 0;
    if (count > 0) {
      for (let i = 0; i < lines.length - 1; i++) {
        if (lines[i]?.trim()) current++;
        if (current === count) return i;
      };
    }

    for (let i = lines.length - 1; i >= 0; i--) {
      if (lines[i]?.trim()) current--;
      if (current === count) return i;
    };
  }

  function getBuffer(){
    const latest = history[history.length - 1];
    return ((latest.type === "continue" || latest.type === "story") && !latest.text.endsWith("\n\n"))
      ? latest.text.endsWith("\n")
        ? "\n"
        : "\n\n"
      : "";
  }

  function getNormalStoryCards(personification) {
    const storyCardPrefix = globalThis.text.split("Recent Story:")[0] + (state.tempCard || "");
    const nonCards = storyCardPrefix.split("World Lore:\n")[0].trim();
    const cards = storyCardPrefix
      .split("World Lore:\n")[1]
      ?.split("\n}\n")
      .map(c=>c.trim())
      .filter(Boolean)
      .map(c => {
        if (c.includes(" - Character")){
          const name = c.split("\n").find(l=>l.includes(" - Character")).split(" - ")[0].trim();
          return `${c}\n}${personification ? "\n" + actorText(name) : ""}\n`;
        }
        return `${c}\n${c.startsWith("{") ? "}\n" : ""}`;
      })
      || [];
    state.tempCard = null;
    return [cards, nonCards];
  }

  function getCharacterNames(){
    const cards = getNormalStoryCards()[0];
    const names = new Set();

    storyCards.forEach(c => {
      if (
        c.type.toLowerCase() === "prompt - character"
      ){
        names.add(c.entry.split("\n").find(l => l.includes("Name:"))?.match(/(?<=:).*$/)[0]?.trim() || deSymbol(c.title.split(" - ")[0]) || "");
      }
    });

    cards.forEach(c => {
      const lines = c.split("\n");
      const character = lines.find(l => l.trim().startsWith("Character:"))?.split[1]?.trim();
      if (character) names.add(character);
    })

    return Array.from(names).filter(Boolean);
  }

  function actorText(name){
    return `# ${name} Instructions
## Write ${name} as a fully-realized individual with layered internal motivations that drive their actions. Their motivations may pull them in multiple directions.
## ${name} must realistically interact with the environment, story elements, and other characters, even when ${PROTAGONIST} is not directly involved.
## ${name} creates long-term plans and is capable of complex thought.
## ${name} is deep and multi-dimensional.
## ${name} always behaves in a way that is both beleivable and consistent with their motivations.
## Write dialogue for ${name} consistent with their background and upbringing. Always write authetic dialogue: things the character would actually say out loud.
## It should be clear ${name} is the one speaking, just from how they speak, even if they are not named.`
  }

  function promptSort(cardA, cardB){
    const isPromptA = isPromptCard(cardA);
    const isPromptB = isPromptCard(cardB);
    
    return isPromptA
      ? isPromptB
        ? 0
        : -1
      : isPromptB
        ? 1
        : 0
  }

  function decorateMotive(){
    const sym = Tool.getSym("Motive");

    const lines = globalThis.text.split("\n");

    const motiveIdx = lines.findIndex(l => isKeyValue(l));
    if (motiveIdx < 0) return;

    const motive = lines[motiveIdx].replaceAll("*", "");

    lines.splice(motiveIdx, 1);

    const name = motive?.match(/^[^:]*/g)[0]?.replaceAll("*", "");
    const card = nearestCardMatch(name, characterCardFilter, promptSort, false);
    const cardName = card?.title || `🧠 ${name} - Mind`;

    globalThis.text = (`${getBuffer()}${sym} ${motive?.trim().replaceAll("*", "")} ${Settings.getValue("Tool", "Reminder Text") ? `\n📝 This motive has been recorded in: ${cardName}` : ""}\n\n` + lines.join("\n")).replace(/\n{3,}/g, '\n\n'); 

    if (state.tempMotiveData?.count === continueCount())
      removeLatestAddendum("Motive", card.id);
      
    state.tempMotiveData = {
      motive: motive,
      id: card.id,
      count: continueCount()
    };

    addAddendumToCards(motive, "Motive", card.id); 
  }

  function motiveContinue(){
    const card = getCard(null, null, state.tempMotiveData?.id);
    if (!card) return;

    const sym = Tool.getSym("Motive");
    let text;
    
    if (history[history.length - 1].type === "continue") {
      text = history[history.length - 1].text;
    } else {
      text = history[history.length - 2].text;
    };

    const lines = text.split("\n");

    const motive = lines.find(l => l.trim().startsWith(sym))
    const motiveText = motive.match(/(?<=:).*$/)[0]?.trim();

    const tempMotiveText = state.tempMotiveData.motive.match(/(?<=:).*$/)[0]?.trim();

    if (motiveText === tempMotiveText) return;

    removeLatestAddendum("Motive", state.tempMotiveData.id);

    addAddendumToCards(motive, "Motive", state.tempMotiveData.id, -1);
  }

  function decorateReflect(){
    const sym = Tool.getSym("Reflect");

    const lines = globalThis.text.split("\n");

    const reflectionIdx = lines.findIndex(l => isKeyValue(l));
    if (reflectionIdx < 0) return;

    const reflection = lines[reflectionIdx].replaceAll("*", "");

    lines.splice(reflectionIdx, 1);

    const name = reflection.match(/^[^:]*/g)[0];
    const card = nearestCardMatch(name, characterCardFilter, promptSort, false);
    const cardName = card?.title || `🧠 ${name} - Mind`;

    globalThis.text = (`${getBuffer()}${sym} ${reflection?.trim()} ${Settings.getValue("Tool", "Reminder Text") ? `\n📝 This reflection has been recorded in: ${cardName}` : ""}\n\n` + lines.join("\n")).replace(/\n{3,}/g, '\n\n');

    if (state.tempReflectData?.count === continueCount())
      removeLatestAddendum("Reflect", card.id);

    state.tempReflectData = {
      reflection: reflection,
      id: card.id,
      count: continueCount()
    };

    addAddendumToCards(reflection, "Reflect", card.id);
  }

  function reflectContinue(){
    const card = getCard(null, null, state.tempReflectData?.id);
    if (!card) return;

    const sym = Tool.getSym("Reflect");
    let text;
    
    if (history[history.length - 1].type === "continue") {
      text = history[history.length - 1].text;
    } else {
      text = history[history.length - 2].text;
    };

    const lines = text.split("\n");

    const reflectionText = lines.find(l => l.trim().startsWith(sym)).match(/(?<=:).*$/)[0]?.trim();

    const tempReflectionText = state.tempReflectData.reflection.match(/(?<=:).*$/)[0]?.trim();

    if (reflectionText === tempReflectionText) return;

    removeLatestAddendum("Reflect", state.tempReflectData.id);

    addAddendumToCards(state.tempReflectData.reflection, "Reflect", state.tempReflectData.id, -1);
  }

  function removeLatestAddendum(toolName, cardId) {
    const card = getCard(null, null, cardId);
    if (!card) return;

    const type = toolName.toLowerCase();
    const typeLines = {
      "motive": "Motive",
      "reflect": "Thoughts"
    }
    const typeLine = typeLines[type];

    state[type + "Log"]?.[card.id]?.pop();

    const lines = card.entry.split("\n");

    for(let i = lines.length - 1; i >= 0; i--){
      if(lines[i].match(/^[^:]*/g)[0].toLowerCase().trim().endsWith(typeLine)){
        lines.splice(i, 1);
        break;
      }
    }

    card.entry = lines.join("\n");
  }

  function addAddendumToCards(addendum, toolName, cardId, continueOffset = 0) {
    const type = toolName.toLowerCase();
    const typeLog = type + "Log"
    state[typeLog] ??= {};
    const sym = Tool.getSym(toolName);
    
    if (!addendum) return;
    
    const parts = addendum.split(":");

    if(parts.length < 2) return;

    const name = parts[0].trim();
    const addendumText = parts.slice(1).join(":").trim();

    const card = cardId ? getCard(null, null, cardId) : null;

    const isPrompt = isPromptCard(card);
    const typeLines = {
      "motive": "Motive",
      "reflect": "Thoughts"
    }
    const typeLine = typeLines[type];

    if (card) {
      if (!card.entry.includes(addendumText)) {
        const addendumLog = state[typeLog][card.id] || [];
        addendumLog.push(continueCount() + continueOffset);

        
        card.entry = card.entry.replaceAll(`Current ${typeLine}:`, `Prior ${typeLine}:`);
        const cap = Settings.getValue("Tool", toolName + " Cap");
        if (cap) {
          const lines = card.entry.split("\n");
          let count = 0;
          for (let i = lines.length - 1; i >= 0; i--) {
            if(lines[i].replace("> ", "").trim().startsWith(`Prior ${typeLine}:`)) {
              count++;
              if (count >= cap) {
                 lines[i] = "!!!";
                 addendumLog.shift();
              }
            };
          };
          card.entry = lines.filter(l => l !== "!!!").join("\n");
        };
        
        const addendumLine = `${isPrompt ? "> " : ""}Current ${typeLine}: ${addendumText}`;

        card.entry += `\n${addendumLine}`;

        state[typeLog][card.id] = addendumLog;
      } 
      return;
    } else {
      const newCard = newCard(
        `🧠 ${name} - Mind`,
        "Character Mind",
        `{\n${name} - Mind\nCurrent ${typeLine}: ${addendumText}}`,
        "This card holds the mental state for a character without a Story Card or Prompt Card.\n",
        getKeys(name)
      );

      state[`temp${toolName}Data`].id = newCard.id;
    }
  }
 
  function removeFaded(type) {
    const typeLog = type + "Log"
    state[typeLog] ??= {};
    const loggedCards = Object.keys(state[typeLog]);
    if (loggedCards.length < 1) return;
    const upperType = type[0].toUpperCase() + type.slice(1);
    const fade = Settings.getValue("Tool", upperType + " Fade");
    if (fade < 1) return;
    const typeLines = {
      "motive": "Motive",
      "reflect": "Thoughts"
    }
    loggedCards.forEach(id => {
      const addendumLog = state[typeLog][id];
      if (isActuallyNaN(addendumLog[0])) return;

      const card = storyCards.find(c => c.id === id);
      if(!card)return;

      const count = continueCount();
      
      addendumLog.forEach(x => {
        if (x + fade < count) {
          const lines = card.entry.split("\n");
          const typeLine = typeLines[type];
          const idx = lines.findIndex(l => l.match(/^[^:]*/g)[0]?.endsWith(typeLine));
          if(idx >= 0)
            card.entry = [...lines.slice(0, idx), ...lines.slice(idx + 1)].join("\n");
          addendumLog.unshift();
        }
      });
    })
  }

  function getCardDataFromText(text, isStoryCard){
    const data = {};
    const lines = text.split("\n");
    const entryLines = lines
      .filter(l=>![...BASIC_FILTERS, Tool.getSym("card")].some(f=>l.trim().startsWith(f)));
    data.title = lines.find(l=>l.includes("Title:"))?.split("Title:")[1].trim() || "Untitled";

    data.type = entryLines
        .find(l=>l.includes("Type:"))
        ?.split("Type:")[1]
        .trim()
        || "Uncategorized"

    if (isStoryCard) {
      if (DEFAULT_CARD_TYPES.includes(data.type.toLowerCase())) data.type = data.type.toLowerCase();
    } else {
      data.type = `Prompt - ${data.type}`;  
    };

    data.entry = entryLines
      .filter(l => Boolean && !["Title:", "Type:", "Triggers:"].some(x => l.startsWith(x)))
      .join("\n");

    if (isStoryCard) data.entry = `{\n${data.title} - ${data.type[0].toUpperCase() + data.type.slice(1)}\n${data.entry.trim()}\n}`;


    if (!isStoryCard) {
      const trimLines = data.entry.split("\n").map(l=>l.trim()).filter(Boolean)
      const finalLines = [];
      let lastFieldIdx = -1;
      
      trimLines.forEach(l => {
        if (isKeyValue(l)) {
          finalLines.push(`> ${l}`);
          lastFieldIdx++;
        } else {
          if (lastFieldIdx < 0) {
            finalLines.push(`> Details: ${l}`);
            lastFieldIdx++;
          } else {
            finalLines[lastFieldIdx] += ` ${l}`;
          }
        }
      });

      data.entry = finalLines.join("\n");
    };
    
    data.description = isStoryCard ? "" : PROMPT_DESCRIPTION;

    return data;
  }

  function finishCardOutput() {
    const isStoryCard = !Settings.getValue("Tool", "Prompt Cards");

    const data = getCardDataFromText(globalThis.text, isStoryCard);

    const triggers = getKeys(
      data.title,
      Settings.getValue("Tool", "Full-Title Triggers")
    )
    .trim();

    if (isStoryCard) globalThis.text += `\nTriggers: ${triggers}`;

    if (Settings.getValue("Tool", "Reminder Text"))
      globalThis.text = `🎴 Story Card or Prompt Card? (S/P): ${isStoryCard ? "S" : "P"}${Settings.getValue("Tool", "Reminder Text") ? `
📝 A ${Settings.getValue("Tool", "Prompt Cards") ? "prompt card" : "story card"} has been created with the details below.
📝 If you Undo, that card will remain in your Story Cards.
📝 If you Retry, that card will be deleted and a new card will be added.
📝 If you edit the text below and take a forward action (Do, Say, Continue) that card will be updated to match the edited text.\n` : ""}
${globalThis.text}`;

    if (state.tempCardData?.count === continueCount()) {
      removeCard(null, null, state.tempCardData.id)
    }

    const card = newCard(
      data.title,
      data.type,
      data.entry,
      data.description,
      triggers
    );

    state.tempCardData = {id: card.id, count: continueCount()};

    updatePromptSequenceCard();
  }
  
  function cardContinue() {
    if (!state.tempCardData) return;

    let text;
    let command;
    
    if (history[history.length - 1].type === "continue") {
      text = history[history.length - 1].text;
      command = Command.fromHistory(1);
    } else {
      text = history[history.length - 2].text;
      command = Command.fromHistory(2);
    };

    const lines = text.split("\n");

    const isStoryCard = lines.find(l => l.trim().startsWith(Tool.getSym("card")))?.match(/(?<=:).*$/)[0]?.trim().toLowerCase() === "s";

    const data = getCardDataFromText(text, isStoryCard);

    const triggers = isStoryCard 
      ? text.split("Triggers:")[1]?.split("\n")[0] 
        || getKeys(
          text.split("\n")
            .find(l=>l.includes("Title:"))
            ?.split("Title:")[1]
            .trim()
            || ""
          )
          .trim()
      : "";

    const card = getCard(null, null, state.tempCardData.id);

    card.title = data.title;
    card.type = data.type;
    card.entry = data.entry;
    card.description = data.description;
    card.keys = triggers;

    updatePromptSequenceCard();
  }

  function updateToolCard(card, text) {
    if (!card || !text) return;

    const concatLines = (lines) => {
      const fl = [...lines];
      let idx = fl.findIndex(l => isKeyValue(l)) + 1;
      if (idx <= 0) return [`Entry: ${fl.join(" ")}`];

      while (idx < fl.length) {
        if (!isKeyValue(fl[idx])) {
          fl[idx - 1] += " " + fl[idx].trim();
          fl.splice(idx, 1);
          continue;
        };
        idx++;
      };

      return fl.filter(Boolean);
    };
    
    let lines = concatLines(text
      .split("\n")
      .map(l => l.trim())
      .filter(l => Boolean 
        && ![...BASIC_FILTERS, Tool.getSym("Update")].some(f=>l.trim().startsWith(f))
      ))

    const title = lines.find(l => l.trim().startsWith("Title:")).match(/(?<=:).*$/)[0].trim();

    lines = lines.filter(l => !l.trim().startsWith("Title:"));
    
    const isPrompt = isPromptCard(card);
    const [entry, mind] = trimEntry(card.entry);
    const entryLines = concatLines(entry.split("\n"));
    lines.forEach((l, i) => {
      if (!l.slice(0,40).includes(":")) return;
      const start = l.match(/^[^:]*/g)[0];
      const idx = entryLines.findIndex(m => m?.trim().startsWith(start + ":"));
      if (idx < 0) {
        entryLines.push(l);
        return;
      };
      entryLines[idx] = lines[i];
    });
    
    card.entry = wrapEntry(isPrompt, entryLines.join("\n") + "\n" + mind);

    const titleDesymbolIdx = card.title.indexOf(deSymbol(card.title)[0]);
    card.title = card.title.slice(0, titleDesymbolIdx) + title;
  }

  function restoreTempCard(){
    if (!state.tempUpdateData) return;

    const card = getCard(null, null, state.tempUpdateData.data.id);
    const data = state.tempUpdateData.data;

    card.title = data.title;
    card.type = data.type;
    card.entry = data.entry;
  }

  function finishUpdateOutput() {
    const card = getCard(null, null, state.updateCardId || state.tempUpdateData.data.id);
    state.updateCardId = null;

    if (state.tempUpdateData?.count === continueCount())
      restoreTempCard();

    state.tempUpdateData = {
      data: {
        id: card.id,
        title: card.title,
        type: card.type,
        entry: card.entry
      },
      count: continueCount()
    }

    let text = globalThis.text
      .trim()
      .replace(/^\{/, "")
      .replace(/\}$/, "")
      .trim();

    if (text.startsWith(deSymbol(card.title))) text = text.replace(deSymbol(card.title), "");

    text = `\nTitle: ${deSymbol(card.title)}\n` 
      + text
        .split("\n")
        .map(l => l.trim())
        .filter(Boolean)
        .map(l => {
          parts = l.split(":");
          parts[0] = parts[0].replaceAll('"', "");
          if(parts[1]?.trim().startsWith('"')) {
            parts[1] = parts[1].replace('"', "");
            if (parts[parts.length - 1].trim().endsWith('"')){
              parts[parts.length - 1].splice(parts[parts.length - 1].lastIndexOf('"'), 1);
            };
          };
          return parts.join(":");
        })
        .join("\n");
    
    globalThis.text = `${Tool.getSym("update")} Update or Restore? (U/R): U${Settings.getValue("Tool", "Reminder Text") ?`
📝 ${card.title} has been updated with the text below
📝 If you Undo, the updates will be saved
📝 If you Retry, new updates will be generated and applied
📝 If you want to edit the update, change the text below and take a forward action (Do, Say, Continue). The card will be updated with the edited text.
📝 If you want to restore the original card, change U to R on the ${Tool.getSym("update")} line above and take a forward action` :""}
${text}`;

      updateToolCard(card, text);
  }

  function updateContinue() {
    let text;
    let command;
    
    if (history[history.length - 1].type === "continue") {
      text = history[history.length - 1].text;
      command = Command.fromHistory(1);
    } else {
      text = history[history.length - 2].text;
      command = Command.fromHistory(2);
    };
    
    const restore = text.split("\n").find(l => l.trim().startsWith(Tool.getSym("update")))?.match(/(?<=:).*$/)[0]?.trim().toLowerCase() === "r";
    
    restoreTempCard();
    if (!restore) {
      updateToolCard(getCard(null, null, state.tempUpdateData?.data.id), text);
    }
  }

  function wrapEntry(isPrompt, entry) {
    if (isPrompt) return entry.split("\n").map(l => l ? `> ${l}` : "").join("\n");
    return `{\n${entry}\n}`;
  }

  function setProtagonist(){
    const latest = latestContinue();
    const newProtagonist = latest.text.toLowerCase().split("new protagonist:")[1]?.split("\n")[0].trim();
    
    for (let c of storyCards){
      const [name, type, subtype] = partsFromTitle(deSymbol(c.title));
      if (type.toLowerCase() === "character" && subtype.toLowerCase() === "protagonist"){
        c.title = c.title.replace(/\(protagonist\)/gi, "(Supporting Character)");
        if (isPromptCard(c)) {
          c.entry = c.entry.replace(/\(protagonist\)/gi, "(Supporting Character)");
        }
      };
    };

    const newProtagCard = nearestCardMatch(newProtagonist, (c)=> partsFromTitle(c.title)[1]?.toLowerCase() === "character" || partsFromTitle(c.title)[1]?.toLowerCase() === newProtagonist);
    if (newProtagCard) {
      newProtagCard.title = newProtagCard.title.split(" - ")[0] + " - Character (Protagonist)";
      if (!isPromptCard(newProtagCard)) {
        const lines = newProtagCard.entry.split("\n");
        if (
          lines[1].trim().toLowerCase() === newProtagonist
          || lines[1].toLowerCase().includes(" - character")
        ) {
          lines[1] = lines[1].split(" - ")[0] + " - Character (Protagonist)";
          newProtagCard.entry = lines.join("\n");
        }
      }
    }

    updatePromptSequenceCard();
  }

  function parseJSONStringToCardTemplate(string){
    const templates = [];
    const lines = string.replaceAll('\\"', "&^%" ).replaceAll('",', "").replaceAll('"', "").replaceAll("&^%", '"').split("   ").map(l => l.trim());
    const finishTemplate = (template) => {
      if(template.entry.length > 0) {
        if (template.keys) {
          template.entry = template.entry.join("\n");
        } else {
          template.entry = template.entry.map(l => `> ${l}`).join("\n");
        }
        templates.push(template);
      }
    }

    let template = { entry: [] };

    lines.forEach((l,i) => {
      if (l === "},"){
        finishTemplate(template);
        template = { entry: [] };
        return;
      };

      const parts = l.split(":");
      if (parts.length < 2) return;

      if (parts[0].toLowerCase() === "component") {
        template.component = parts.slice(1).join(":").trim();
        return;
      };

      if (parts[0].toLowerCase() === "component type") {
        template.componentType = parts.slice(1).join(":").trim();
        return;
      };

      if (parts[0].toLowerCase() === "triggers") {
        template.keys = parts.slice(1).join(":").trim();
        return;
      };

      template.entry.push(`${parts[0]}: ${parts.slice(1).join(":").trim()}`);
    });

    finishTemplate(template);
    return templates;
  }

  function getKeys(str, isNarrow){
    if(isNarrow) {
      if (!str || typeof str !== "string") return;
      return `${str} , ${str}, ${str} ,${str}`
    } else {
      const shortWords = [
        "a", "an", "and", "are", "as", "at", "be", "by", "for", "from",
        "has", "he", "in", "is", "it", "its", "of", "on", "that", "the",
        "to", "was", "were", "with"
      ]

      return str
          .toLowerCase()
          .split(" ")
          .filter(Boolean)
          .filter(w => !shortWords.some(s=>s === w))
          .reduce((agg, w) => {
            agg.push(w + " ");
            agg.push(" " + w);
            agg.push(" " + w + " ");
            agg.push(w);
            return agg;
          },[])
          .join(",");
    }
  }

  function replaceDoubleLineBreaks(text){
    return text.replaceAll("\n\n", "\n");
  }

  function unPunc(str){
    if (!str) return str;
    return str.replace(/[.,!?;:\-]$/, '');
  }

  function setCYOAChoice() {
    const regex1 = /^(?:>\s*You(?:\s+say,)?\s*)?(.+)$/;
    const input = globalThis.text.replaceAll("\n", "").match(regex1)?.[1].replace("> ", "") || "";
    const regex2 = new RegExp(`^${input[1]}\\.\\s*(.*)$`, 'mi')
    globalThis.text = "[" + (history[history.length - 1].text.match(regex2)?.[1] || "Continue the story.") + "]";
  }

  function updateSchedule(reset){
    const card = getCard("Tool Schedule", "Schedule");

    if (!card) return;

    const lines = card.entry.split("\n");

    const firstTool = lines.findIndex(l => l.includes("Tool:"));

    const count = continueCount();

    const commands = lines
    .slice(firstTool)
    .filter(l=>l.includes("Tool:"))
    .map(l => {
      let rate = parseInt(l.match(/Rate:\s*(-?\d+)/)?.[1]);
      if (isActuallyNaN(rate)) rate = 20;

      let start = parseInt(l.match(/Start:\s*(-?\d+)/)?.[1]);
      
      if (isActuallyNaN(start)) start = 0;

      if (!l.includes("Timer:")) l = [l.split(" - ")[0], `Timer: ${rate}`, ...l.split(" - ").slice(1)].join(" - ");

      let timer = parseInt(l.match(/Timer:\s*(-?\d+)/)?.[1]);

      if (reset) start = 0;

      timer = timer < 0
        ? rate
        : (count <= start)
          ? start - count
          : (rate - ((count - start) % rate)) % rate;

      return l.replace(/Rate:\s*-?\d+/i, "Rate: " + rate).replace(/Timer:\s*-?\d+/i, "Timer: " + timer).replace(/Start:\s*-?\d+/, "Start: " + start);
    })
    .sort((a, b) => {
      let aTimer = parseInt(a.match(/Timer:\s*(-?\d+)/)?.[1]);
      if (isActuallyNaN(aTimer)) aTimer = 999;

      let bTimer = parseInt(b.match(/Timer:\s*(-?\d+)/)?.[1]);
      if (isActuallyNaN(bTimer)) bTimer = 999; 

      return aTimer - bTimer;
    });
    c.entry = [...lines.slice(0, firstTool), ...commands].join("\n")
  }

  function estimatePromptSize(){
    const sequence = getPromptSequence();
    return storyCards.filter(c => isPromptCard(c) && sequence.includes(deSymbol(c.title))).reduce((acc, c) => acc + c.title.length + c.entry.length, 0);
  }

  function assembleFloatingPrompt(sequence = getPromptSequence()) {
    const includePersonfication = Settings.getValue("Context", "Advanced Personification");
    const hideOpening = Settings.getValue("Hidden", "Dynamic Opening");
    return `# Prompt Components
${storyCards
    .filter(c => !isCardHidden(c) && isPromptCard(c) && sequence.includes(deSymbol(c.title)))
    .map(c => {
      let added = "";
      if (c.type.toLowerCase().includes(" - character") && c.title.toLowerCase().includes(" - character")) {
        const name = c.entry
          .split("\n")
          .find(l=>l.includes("Name:"))
          ?.match(/(?<=:).*$/)[0]
          ?.trim()
          || deSymbol(c.title
            .split(" - ")[0])
          || "this character";
        
        if (includePersonfication) added = "\n" + actorText(name);
      };
      return `"${deSymbol(c.title)}": {\n${c.entry
        .split("\n")
        .map(l=> l.trim().startsWith("> ") ? l.trim().slice(2) : l.trim())
        .filter(l => {
          if (!isKeyValue(l)) return false;
          
          const firstPart = l.match(/^[^:]*/g)[0];
          if (hideOpening && firstPart.toLowerCase() === "opening circumstances") {
            return false;
          }
          
          return true;
        })
        .map(l=>{
          const parts = l.split(":");
          if (parts.length < 2) return "";  
          return `"${parts[0].trim()}": "${parts.slice(1).join(":").trim()}"`}).join(",\n")}\n}${added}`;
        }).join("\n\n")}`
  }

  function getFilters() {
    const filters = ["⛔", "🧰"];
    Tool.TOOLS.forEach(t => filters.push(t.sym));
    return filters;
  }

  function minMax(number, min, max) {
    if (isActuallyNaN(number) || isActuallyNaN(min) || isActuallyNaN(max)) return NaN;
    if (number === null || min === null || max === null) return NaN;
    if (number === undefined || min === undefined || max === undefined) return NaN;
    if (number === "" || min === "" || max === "") return NaN;

    return Math.min(Math.max(number, min), max);
  }

  function getBreakPoint(lines, startingLineCount) {
    const difference = Math.max(lines.length - startingLineCount, 0);
    const target = Math.max(Settings.getValue("Context", "Prompt Depth"), 0) + difference;
    let point = 0;
    let count = 0;
    let canEnd = true;
    let primed = false;
    for (let i = lines.length - 1; i >= 0; i--) {
      if (count >= target && canEnd) break;
      point++;
      const trim = lines[i].trim();
      if (trim === "---" && primed) canEnd = true;
      if (trim === "[A brief aside:]") primed = true;
      if (trim === "[Resume the story using the same narrative perspective and tense it was using before the aside.]") canEnd = false;
      if (trim) count++;
    };

    return Math.max(lines.length - 1 - point, 0);
  }

  function getFilteredLinesFromHistory(start = 0, additionalFilters = [], hideCards){
    let idx;
    let sum = 0;
    for (let i = history.length - 1; i >= 0; i--){
      if (sum >= state.maxChars) break;
      sum += history[i].text.length;
      idx = i;
    };
    start = Math.max(start, idx - 10);

    let cardLines = [];

    if (!hideCards) {
      storyCards.forEach(c=>{
          if (c.type === "Stored Context") {
              const int = Math.max(parseInt(c.title.split(" - ").slice(-1)[0]), 0);
              if (!isActuallyNaN(int)) {
                  cardLines[int] = c.entry;
              };
          };
      });

      cardLines = cardLines.filter(Boolean).reduce((acc, c) => {
        acc.push(...c.split("\n"));
        return acc;
      }, []);
      
    };
    const filters = [...BASIC_FILTERS, "Recent Story:", ...getFilters(), ...additionalFilters];
    const sceneInstructionFadeDistance = Settings.getValue("Tool", "Scene Instruction Fade");
    let sceneInstructionFadePoint = history.length - 1;
    if (sceneInstructionFadeDistance < 1) {
      sceneInstructionFadePoint = 0;
    } else{
      let continueCount = 0;
      for (let i = history.length - 1; i >= 0; i--){
        if (history[i].type === "continue"){
          sceneInstructionFadePoint = i;
          continueCount++;
          if (continueCount > sceneInstructionFadeDistance) break;
        }
      }
  }
    
    return [
    ...cardLines,
    ...history
      .slice(start)
      .map((h, i) => {
        const lines = h.text.split("\n").map(l => l.trim()).filter(Boolean);
        if (
          h.type === "continue"
          && lines.length >= 2
          && lines.some(l =>l.startsWith(VISIBILITY_SYM))
        ) {
          if (
            lines.find(l => l.startsWith(VISIBILITY_SYM))
              .match(/(?<=:).*$/)[0]
              ?.toLowerCase()
              .trim()
              .startsWith("y")
          ) {
            return `---\n[A brief aside:]\n${h.text}\n---\n${i >= history.length - 1 ? `${VISIBLE_ASIDE_ENDER}\n` : ""}`
          } else {
            return "";
          }
        }
        return h.text;
      })
      .reduce((acc, t, i) => {
        i < sceneInstructionFadePoint
          ? acc.push(...t.split("\n").filter(l => !l.trim().startsWith("[Scene instructions:")))
          : acc.push(...t.split("\n"));
        return acc;
      }, [])
      .filter((l, i, arr) => {
        return !filters.some(f => l.trim().startsWith(f));
      })
    ];
  }

  function continueCount() {
    let count = 0;
    history.forEach(h=>{
      if (h.type === "continue" || h.type === "start") count++;
    })
    return count;
  }

  function isActuallyNaN(n){
    if (typeof n !== "number") return true;
    if (n !== n) return true;
    return false;
  }

  function newCard(title, type, entry, description = "", keys = "") {
    // AI Dungeon's API is really strange. I am not sure why it has to be done
    // like this, but apparently it does
    addStoryCard("!!!");
    // So a dummy card is added, located, and modified with the real data
    let card;
    for(const c of storyCards) {
        if (c.title === "!!!") {
            c.title = title;
            c.type = type;
            c.entry = entry;
            c.description = description;
            c.keys = keys;
            card = c;
            break;
        }
    }
    return card;
  }

  function getCard(title, type, id){
    let card;
    if (id) {
      card = storyCards.find(c => c.id === id);
    } else {
      for (c of storyCards) {
        if (type && title){
          if (c.type.toLowerCase() === type.toLowerCase() && deSymbol(c.title.toLowerCase()) === deSymbol(title.toLowerCase())){
            card = c;
            break;
          };
        } else if (title) {
          if (deSymbol(c.title.toLowerCase()) === deSymbol(title.toLowerCase())){
            card = c;
            break;
          };       
        };
      };
    }
    return card;
  }

  function findProtagCard(cardType) {
    return storyCards.find(c => {
      const [,type,,owner] = partsFromTitle(deSymbol(c.title));
      return type.toLowerCase() === cardType.toLowerCase() && owner.toLowerCase() === PROTAGONIST.toLowerCase();
    });
  }

  function removeCard(title, type, id){
    let idx;
    if (id) {
      idx = storyCards.findIndex(c => c.id === id);
      if (idx < 0) return;
    } else {
      for (let i = 0; i < storyCards.length; i++) {
        const c = storyCards[i];
        if (type){
          if (c.type === type && deSymbol(c.title) === deSymbol(title)){
            idx = i;
            break;
          };
        } else {
          if (deSymbol(c.title) === deSymbol(title)){
            idx = i;
            break;
          };       
        };
      };
    }
    storyCards.splice(idx, 1);
  }

  function isAbbreviationPeriod(text, periodIndex) {
      let start = periodIndex - 1;
      while (start >= 0 && /[a-zA-Z.]/.test(text[start])) {
          start--;
      }
      start++;
      const token = text.substring(start, periodIndex + 1);
      return ABBREVIATIONS.has(token.toLowerCase());
  }

  function isDecimalPeriod(text, idx) {
      return (
          idx > 0 &&
          idx < text.length - 1 &&
          /\d/.test(text[idx - 1]) &&
          /\d/.test(text[idx + 1])
      );
  }

  function isShortFieldValue(line) {
      const colonIdx = line.indexOf(':');
      if (colonIdx === -1 || colonIdx >= 40) return false;

      for (let i = 0; i < colonIdx; i++) {
          const ch = line[i];
          if (ch === '.' || ch === ',' || ch === ';' || ch === '!' || ch === '?') {
              return false;
          }
      }

      const value = line.substring(colonIdx + 1).trim();
      return value.length < 50;
  }

  function isCommaSeparatedList(line) {
      const trimmed = line.trimEnd();
      return (
          isKeyValue(trimmed) &&
          trimmed.includes(',') &&
          !/[.!?]/.test(trimmed)
      );
  }

  function trimToLastEnding(text) {
    if (text.length === 0) return text;

    // ---- Handle special final-line cases ----
    const lastNewline = text.lastIndexOf('\n');
    const finalLine = lastNewline === -1 ? text : text.substring(lastNewline + 1);

    // ---- Early exit if text already ends with a valid sentence terminator ----
    const lastChar = text[text.length - 1];
    if (lastChar === '\n') return text;
    if (lastChar === '!' || lastChar === '?' || lastChar === ']' || lastChar === '}' || lastChar === ')') return text;
    if (lastChar === '.' && !isDecimalPeriod(text, text.length - 1)) {
        return text;
    }
    if (isShortFieldValue(finalLine)) return text;
    if (isCommaSeparatedList(finalLine)) return text;

    // ---- Find the last valid sentence‑ending punctuation ----
    let bestPunctuationIdx = -1;
    for (let i = text.length - 1; i >= 0; i--) {
        const ch = text[i];
        if (ch === '!' || ch === '?'  || ch === ']' || ch === '}' || ch === ')') {
            bestPunctuationIdx = i;
            break;
        }
        if (ch === '.' && !isAbbreviationPeriod(text, i) && !isDecimalPeriod(text, i)) {
            bestPunctuationIdx = i;
            break;
        }
    }

    // ---- Process based on whether we found punctuation ----
    if (bestPunctuationIdx !== -1) {
        const maxIndex = Math.max(
            bestPunctuationIdx,
            text.lastIndexOf('\n'),
            text.lastIndexOf('"'),
            text.lastIndexOf('”')
        );

        const trimStr = text.substring(0, maxIndex + 1);
        const trimStrExclusive = text.substring(0, maxIndex);
        const lines = trimStr.split('\n');
        const lastLineQuotes = lines[lines.length - 1];
        const evenQuotes =
            (
                (lastLineQuotes.split('"').length - 1) +
                (lastLineQuotes.split('”').length - 1) +
                (lastLineQuotes.split('“').length - 1)
            ) % 2 === 0;

        if (evenQuotes) return trimStr;
        return trimToLastEnding(trimStrExclusive);
    }

    // ---- No sentence punctuation found, handle newlines/quotes ----
    const maxIndex = Math.max(
        text.lastIndexOf('\n'),
        text.lastIndexOf('"'),
        text.lastIndexOf('”')
    );

    if (maxIndex !== -1) {
        const trimStr = text.substring(0, maxIndex + 1);
        const trimStrExclusive = text.substring(0, maxIndex);
        const lines = trimStr.split('\n');
        const lastLineQuotes = lines[lines.length - 1];
        const evenQuotes =
            (
                (lastLineQuotes.split('"').length - 1) +
                (lastLineQuotes.split('”').length - 1) +
                (lastLineQuotes.split('“').length - 1)
            ) % 2 === 0;

        if (evenQuotes) return trimStr;
        return trimToLastEnding(trimStrExclusive);
    }

    // Absolutely no natural stopping point could be found.
    return text;
  }

  function addParagraphBreak(text){
    const breakPoint = Settings.getValue("Misc", "Paragraph Break Length");

    if (isActuallyNaN(breakPoint) || breakPoint < 0) return text;

    if (text.endsWith("\n")) return text;

    const lines = text.split("\n");

    if (estimateSentenceCount(lines[lines.length - 1]) >= breakPoint) text += "\n\n";

    return text;
  }

  function estimateSentenceCount(text) {
    if (!text || typeof text !== 'string') return 0;
    let str = text.trim();
    if (str.length === 0) return 0;

    // 1. Protect known abbreviation periods
    const abbreviations = [
      "Mr.", "Mrs.", "Ms.", "Dr.", "Prof.", "Sr.", "Jr.", "Capt.",
      "Lt.", "Rev.", "Hon.", "St.", "Gen.", "Col.", "Maj.", "Sgt.",
      "Gov.", "Sen.", "Rep.", "Jan.", "Feb.", "Mar.", "Apr.", "Jun.",
      "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec.", "vs.", "etc.",
      "i.e.", "e.g.", "a.m.", "p.m.", "U.S.", "U.K.", "U.N.", "Ph.D.",
      "M.D.", "B.A.", "M.A.", "D.C.", "N.Y.", "L.A.", "approx.", "dept.",
      "est.", "no.", "fig.", "eq."
    ];
    // Build a regex that matches any abbreviation as a whole word (case‑insensitive)
    const escaped = abbreviations.map(abbr => abbr.replace(/\./g, '\\.'));
    const abbrRegex = new RegExp('\\b(' + escaped.join('|') + ')', 'gi');
    str = str.replace(abbrRegex, match => match.replace(/\./g, '__ABBRDOT__'));

    // 2. Protect decimal numbers (e.g., 3.14)
    str = str.replace(/(\d)\.(\d)/g, '$1__DECIMAL__$2');

    // 3. Find real sentence boundaries
    // Punctuation (! ? .) optionally followed by closing quotes/parentheses/brackets,
    // then whitespace or end of string, then (optional opening quote/parenthesis + capital letter/digit)
    const boundaryRegex = /([!?.]+)[)}\]'"”’]*(?:\s+|$)(?=[(\["'“‘]?[A-Z0-9]|$)/g;
    const matches = str.match(boundaryRegex);
    const count = matches ? matches.length : 0;

    // 4. If no boundaries were found but the text contains characters, assume at least one sentence
    return count > 0 ? count : 1;
  }

  function ensureProperSpacing(str) {
    // Punctuation marks that typically require spaces afterwards.
    const PUNCTUATION = ['.',';',',',':','"','”', "'", '’']
    // If the input string is empty, return it immediately
    if (str.length === 0) return str;
    // Remove leading whitespace characters
    str = str.replace(/^[ \t]/, '');
    // Get the first character of the cleaned input string
    const firstChar = str[0];
    // If the new text already starts with a newline, it won't need a space
    if (firstChar === '\n') return str
    // Get the last character of the most recent text entry
    const latest = history[history.length -1].text
    const lastChar = latest[latest.length - 1];
    // Check if the last character of previous text is a listed punctuation
    if (PUNCTUATION.includes(lastChar)) {
            return " " + str;
    } 
    // If the last character doesn't have a punctuation on the list, return as-is
    return str;
  }

  function parseRawOutput(text) {
      if (Settings.getValue("Misc", "Output Trimming")) text = trimToLastEnding(ensureProperSpacing(text));
      if (Settings.getValue("Misc", "Paragraph Breaks")) text = addParagraphBreak(text);
      return text;
  }

}
