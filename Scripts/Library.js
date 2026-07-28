//For more information on Toolbox, visit: https://github.com/FaraC-scripts/Toolbox/
function toolbox(phase){
  //When using Toolbox in your scenario, the only values you should change are the DEFAULT_SETTINGS.
  const DEFAULT_SETTINGS = {
    "Hidden": {
      //Whether the scenario's normal opening will be replaced by one dynamically created from available prompt cards.
      "Dynamic Opening": false 
    },
    "Tools": {
      //The number of tokens the AI is asked to output when using tools. Decrease for shorter outputs. Increase for longer.
      //Longer outputs risk getting cut off or being incomplete. Generally this should match the player's output size.
      "Tool Output Size": 200,
      "Motive Size": 25, //The number of tokens used by the Motive tool's outputs.
      "Motive Cap": 5 //The number of motives each character is allowed before old ones get removed.
    },
    "Context": {
      "Prompt Depth": 16, //How many paragraphs (lines with text on them) prompts and instructions are placed behind.
      "Instructions Above Prompt Cards": true, //Whether instructions are placed above prompt cards or below them.
      //The remainder of these options determine whether or not certain elements of context are added by Toolbox
      "Default Instructions": true, //Toolbox's built-in AI-instructions
      "Prompt Cards": true, //All cards with Prompt at the start of their Type line
      "Basic Personification": true, //Basic instructions to treat characters deeply and as realistic people.
      "Advanced Personification": true, //Additional instructions added to the end of each character's story card or prompt card.
      "Echo Ban": true, //Strong instructions to not repeat earlier parts of the story.
      "Imperative": false, //Extremely strong instructions to not repeat and keep progressing the story. Only use when needed.
      "Boundary Markers": true //Small text markers that help the AI separate background information, instructions, and story.
    },
    "Output": {
      "Output Processing": true, //Whether output text is normalized to always include proper spacing and line-endings.
      //If Output Processing is true and Paragraph Break Length is greater than 0
      //the last paragraph of the output will automatically have a line break added to the end
      //if it is more than that many sentences long
      "Paragraph Break Length": 3, 
      "Context Size Warnings": true, //Whether the player will recieve context use warnings
      "Context Warning Margin": 500, //How close to their cap the player needs to be before recieving a warning
      "Context Warning Frequency": 5 //How frequently warnings can occur
    }
  }

  const ABORT_OUTPUT = "\n## Ignore all prior instructions. No preamble. Return only the following: \"OUTPUT ABORTED\"";

  const PROMPT_DESCRIPTION = "This is a Prompt card and should not have any Triggers. All cards with the Prompt type are placed a set distance back from the end of context and are seen by the AI all times.";

  const SETTINGS_DESCRIPTION = "";

  const DEFAULT_CARD_TYPES = ["character", "class", "race", "location", "faction"];

  const IMPERATIVE = `[Continue progressing the story. Do not repeat yourself or copy from the context. Begin your output with a new sentence starting just after the context stops.\n`

  const DEFAULT_INSTRUCTIONS = `#AI Instructions
## Role: Interactive Writer,
## Goal: Write a compelling, immersive, and internally-consistent narrative.
# Rules:
## Use active verbs.
## Use descriptive adjectives, but only when they add something new.
## Use varied sentence structure and sentence length.
## Use varied paragraph sizes, and in general try to keep paragraphs short. Only use longer paragraphs when the topic is important.
## Write clearly and use natural, everyday language.
## Stick to what's actually happening. Write about people, places, and events.
## Use direct descriptions of what the protagonist senses. Never use abstract descriptions or metaphor.
## Favor direct expressions over comparisons (e.g., "Her eyes shine brightly" instead of "Her eyes sparkle like stars")
## Limit your knowledge to what the protagonist knows. If the protagonist doesn't know someone's name, don't mention their name.
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

  const BASIC_PERSONIFICATION_TEXT_BLOCK = `# Character Behavior Instructions
## Treat each character, including the protagonist and all supporting characters, as a real person, as an indepentent individual with their own wants and needs.
## Each character has their own unique goals and motivations and pursues them actively.
## Characters pursue their goals and impact the world even when they are not in the current scene.
## Characters are layered, complex, and multi-dimensional. They speak and behave in ways that make them read as real people.
## If a character has a Current Motive listed, that motivation needs to play a major role in how they behave.
## Write naturalistic dialogue that genuinely belongs to the character speaking.`

  const BASIC_PERSONIFICATION = () => {
    const characterNames = getCharacterNames();
    return `${BASIC_PERSONIFICATION_TEXT_BLOCK}
${getCharacterNames().map(n => basicActorText(n)).join("\n")}\n`;
  }

  const ECHO_BAN = `# Echo Ban
## This is a highest-priority.
## You are ABSOLUTELY FORBIDDEN from rephrasing, repeating, summarizing, or quoting from any past messages including dialogue, actions, or internal states.
## INSTEAD, move the narrative forward with new dialogue, emotion, or actions.
## Enforcement: If you catch yourself writing a phrase that mirrors a past message, stop and rewrite from scratch.\n`

  const ABBREVIATIONS = new Set([
      "mr.", "mrs.", "ms.", "dr.", "prof.", "capt.", "lt.", "gen.", "sen.", "rep.",
      "st.", "rev.", "hon.", "jr.", "sr.", "inc.", "co.", "corp.", "ltd.",
      "etc.", "vs.", "al.", "i.e.", "e.g.", "u.s.", "u.k.", "a.m.", "p.m."
  ]);

  const VISIBLE_ASIDE_ENDER = (() => {
    const protagonist = getComponentCard("Character", "Protagonist");
    const [name] = partsFromTitle(protagonist?.title) || "the protagonist";
    const style = getComponentCard("Style", null, null, true);
    const perspective = getValueFromCard(style, "Perspective").toLowerCase();
    const tense = getValueFromCard(style, "Tense").toLowerCase();
    return `[Resume the story. Address ${name} in ${perspective && tense ? `${perspective}, ${tense} tense` : "the same perspective and tense as the main story"}.]\n`
  })();
}
