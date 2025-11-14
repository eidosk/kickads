# KickAds Game Utils Library

A TypeScript library for managing speech bubbles and dialogue systems in games. This library provides framework-agnostic data models and logic that can be integrated with any game engine.

## Features

- **Speech Bubble Data Models**: Manage text, positioning, and styling for speech bubbles
- **Choice-Based Speech**: Support for interactive speech bubbles with multiple choices
- **Dialogue Flow Management**: Sophisticated dialogue system with branching conversations
- **Node-Based Dialogue**: Parse and navigate dialogue trees from JSON structures
- **Type-Safe**: Full TypeScript support with comprehensive type definitions

## Installation

Since this is part of the KickAds project, the library is located in `js/utils/`. To use it:

1. Compile the TypeScript files:
```bash
cd js/utils
npx tsc
```

2. Import the compiled modules in your game code.

## API Reference

### Speech Bubble System

#### SpeechBubbleData

Core class for managing speech bubble data.

```typescript
import { SpeechBubbleData } from './utils';

const bubble = new SpeechBubbleData({
  text: "Hello, world!",
  position: { x: 0, y: -50 },
  style: {
    fontSize: 16,
    fontName: 'myfont'
  }
});

// Get the current text
console.log(bubble.text);

// Update text
bubble.text = "New message!";

// Calculate dimensions
const width = bubble.calculateBubbleWidth();
const height = bubble.calculateBubbleHeight();

// Get centered position
const centeredX = bubble.getCenteredX();
```

#### SpeechChoiceData

Extended class for choice-based speech bubbles.

```typescript
import { SpeechChoiceData } from './utils';

const choiceBubble = new SpeechChoiceData({
  text: "", // Will be set to first choice
  position: { x: 0, y: -50 },
  choices: [
    "Tell me about yourself",
    "Where are you going?",
    "Goodbye"
  ],
  initialChoice: 0
});

// Navigate choices
choiceBubble.nextChoice();
choiceBubble.previousChoice();

// Get current choice
console.log(choiceBubble.currentChoice);
console.log(choiceBubble.currentChoiceIndex);

// Set specific choice
choiceBubble.setChoice(2);
```

### Dialogue System

#### DialogueNodeParser

Utility class for parsing dialogue nodes from JSON.

```typescript
import { DialogueNodeParser, RawDialogueNode } from './utils';

const rawNode: RawDialogueNode = {
  title: "Greeting",
  body: `Hello there!
How can I help you?
[[Question1]]
[[Question2]]`
};

// Parse a single node
const parsed = DialogueNodeParser.parseNode(rawNode);

console.log(parsed.title); // "Greeting"
console.log(parsed.lines); // ["Hello there!", "How can I help you?"]
console.log(parsed.nextNodeTitles); // ["Question1", "Question2"]
console.log(parsed.isTerminal); // false

// Get a random line from the node
const randomLine = DialogueNodeParser.getRandomLine(parsed);
```

#### DialogueFlowManager

Manages dialogue flow and speaker switching.

```typescript
import { DialogueFlowManager, Speaker, ParsedDialogueNode } from './utils';

// Create dialogue nodes
const nodes: ParsedDialogueNode[] = [
  {
    title: "Start",
    lines: ["Hello, adventurer!"],
    nextNodeTitles: ["Response1"],
    isTerminal: false
  },
  {
    title: "Response1",
    lines: ["Hello there!", "Greetings!"],
    nextNodeTitles: ["Question1", "Question2"],
    isTerminal: false
  },
  {
    title: "Question1",
    lines: ["Tell me about yourself"],
    nextNodeTitles: ["Answer1"],
    isTerminal: false
  },
  {
    title: "Answer1",
    lines: ["I am a wandering merchant."],
    nextNodeTitles: [],
    isTerminal: true
  }
];

// Create flow manager
const dialogue = new DialogueFlowManager(nodes, {
  defaultLineDuration: 2000
});

// Set up event callbacks
dialogue.setSpeakerChangeCallback((speaker, line) => {
  console.log(`${speaker} says: ${line}`);
});

dialogue.setQuestionsAvailableCallback((questions) => {
  console.log('Available questions:', questions);
});

dialogue.setDialogueEndCallback(() => {
  console.log('Dialogue ended');
});

// Start dialogue
dialogue.start("Start", Speaker.NPC);

// Progress dialogue
dialogue.nextNode();

// Ask a specific question (when multiple choices available)
if (dialogue.hasMultipleChoices()) {
  const questions = dialogue.getAvailableQuestions();
  dialogue.askQuestion(0); // Ask the first question
}

// Get current state
const state = dialogue.getState();
console.log(state.isActive);
console.log(state.currentLine);
console.log(state.currentSpeaker);
```

## Type Definitions

### SpeechBubblePosition

```typescript
interface SpeechBubblePosition {
  x: number;
  y: number;
  centerHorizontally?: boolean;
  flip?: boolean;
}
```

### SpeechBubbleStyle

```typescript
interface SpeechBubbleStyle {
  fontName?: string;
  fontSize?: number;
  textHeight?: number;
  bodyHeight?: number;
  choicePadding?: number;
  whiteArrowWidth?: number;
}
```

### SpeechBubbleConfig

```typescript
interface SpeechBubbleConfig {
  text: string;
  position: SpeechBubblePosition;
  style?: SpeechBubbleStyle;
}
```

### ParsedDialogueNode

```typescript
interface ParsedDialogueNode {
  title: string;
  lines: string[];
  nextNodeTitles: string[];
  isTerminal: boolean;
  tags?: string[];
}
```

## Examples

### Example 1: Simple Speech Bubble

```typescript
import { SpeechBubbleData } from './utils';

// Create a speech bubble
const bubble = new SpeechBubbleData({
  text: "Welcome to the game!",
  position: { x: 100, y: 50 }
});

// Use in your game engine (Phaser example)
const bitmapText = game.add.bitmapText(
  bubble.position.x,
  bubble.position.y,
  bubble.style.fontName,
  bubble.text,
  bubble.style.fontSize
);
```

### Example 2: Interactive Choice Menu

```typescript
import { SpeechChoiceData } from './utils';

const menu = new SpeechChoiceData({
  text: "",
  position: { x: 0, y: -60 },
  choices: [
    "New Game",
    "Continue",
    "Options",
    "Quit"
  ]
});

// In your game loop
function onUpKey() {
  menu.previousChoice();
  updateDisplay();
}

function onDownKey() {
  menu.nextChoice();
  updateDisplay();
}

function onEnterKey() {
  handleChoice(menu.currentChoiceIndex);
}

function updateDisplay() {
  menuText.text = menu.currentChoice;
}
```

### Example 3: Branching Dialogue

```typescript
import {
  DialogueFlowManager,
  DialogueNodeParser,
  RawDialogueNode
} from './utils';

// Load dialogue from JSON
const rawDialogue: RawDialogueNode[] = [
  {
    title: "Approach",
    body: "Hey there!\n[[Greeting]]"
  },
  {
    title: "Greeting",
    body: "Hello!\nHi there!\n[[AskName]]\n[[AskQuest]]"
  },
  {
    title: "AskName",
    body: "What's your name?\n[[TellName]]"
  },
  {
    title: "TellName",
    body: "I'm Bob the merchant.\n[[Farewell]]"
  },
  {
    title: "AskQuest",
    body: "Do you have any quests?\n[[GiveQuest]]"
  },
  {
    title: "GiveQuest",
    body: "Yes! Find me 10 healing potions.\n[[Farewell]]"
  },
  {
    title: "Farewell",
    body: "Goodbye!\nFarewell!\nSee you later!"
  }
];

// Parse dialogue
const parsedNodes = DialogueNodeParser.parseNodes(rawDialogue);

// Validate dialogue tree
const validation = DialogueNodeParser.validateDialogueTree(parsedNodes);
if (!validation.valid) {
  console.error('Dialogue errors:', validation.errors);
}

// Create dialogue manager
const dialogue = new DialogueFlowManager(parsedNodes);

// Set up callbacks for your game
dialogue.setSpeakerChangeCallback((speaker, line) => {
  if (speaker === Speaker.NPC) {
    npc.showSpeechBubble(line);
  } else {
    player.showSpeechBubble(line);
  }
});

dialogue.setQuestionsAvailableCallback((questions) => {
  player.showChoiceMenu(questions);
});

// Start the dialogue
dialogue.start("Approach", Speaker.PLAYER);
```

## Architecture

The library is designed with separation of concerns:

1. **Data Layer** (`speech-bubble-data.ts`): Pure data models with no dependencies on rendering
2. **Type Layer** (`*.types.ts`): TypeScript interfaces and type definitions
3. **Logic Layer** (`dialogue-node-parser.ts`, `dialogue-flow-manager.ts`): Business logic for dialogue management
4. **Integration Layer**: Your game engine integrates with these components

This architecture allows you to:
- Use the same dialogue data with different rendering engines
- Test dialogue logic without a game engine
- Easily serialize/deserialize dialogue states
- Share dialogue structures across different games

## Integration with Game Engines

### Phaser Integration Example

The original KickAds game uses Phaser. Here's how to integrate:

```typescript
// In your Character class
class Character extends Phaser.Sprite {
  private speechBubbleData: SpeechBubbleData | null = null;
  private speechBubbleGroup: Phaser.Group | null = null;

  speak(text: string) {
    // Create data model
    this.speechBubbleData = new SpeechBubbleData({
      text: text,
      position: { x: 0, y: -50 }
    });

    // Create visual representation (your existing rendering code)
    this.speechBubbleGroup = new KA.SpeechBubble(
      this.game,
      this.speechBubbleData.text,
      this,
      -50
    );
  }

  removeSpeechBubble() {
    if (this.speechBubbleGroup) {
      this.speechBubbleGroup.destroy();
      this.speechBubbleGroup = null;
    }
    this.speechBubbleData = null;
  }
}
```

## Testing

The library includes validation utilities:

```typescript
import { DialogueNodeParser } from './utils';

// Validate a dialogue tree
const validation = DialogueNodeParser.validateDialogueTree(nodes);

if (!validation.valid) {
  console.error('Errors:', validation.errors);
}

if (validation.warnings.length > 0) {
  console.warn('Warnings:', validation.warnings);
}
```

## License

This library is part of the KickAds project. See the main project LICENSE file for details.

## Contributing

This library was extracted from the KickAds game to provide reusable dialogue and speech bubble utilities. Contributions are welcome!
