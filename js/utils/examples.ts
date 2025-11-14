/**
 * Example usage of the KickAds Game Utils Library
 *
 * This file demonstrates how to use the speech bubble and dialogue utilities
 */

import {
  SpeechBubbleData,
  SpeechChoiceData,
  DialogueFlowManager,
  DialogueNodeParser,
  RawDialogueNode,
  Speaker
} from './index';

// ============================================================================
// Example 1: Basic Speech Bubble
// ============================================================================

function example1_BasicSpeechBubble() {
  console.log('=== Example 1: Basic Speech Bubble ===');

  const bubble = new SpeechBubbleData({
    text: "Hello, adventurer!",
    position: { x: 100, y: 50 },
    style: {
      fontSize: 16,
      fontName: 'myfont'
    }
  });

  console.log('Text:', bubble.text);
  console.log('Position:', bubble.position);
  console.log('Bubble width:', bubble.calculateBubbleWidth());
  console.log('Bubble height:', bubble.calculateBubbleHeight());
  console.log('Centered X:', bubble.getCenteredX());

  // Update text
  bubble.text = "How are you today?";
  console.log('Updated text:', bubble.text);

  // Get current state
  const state = bubble.getState();
  console.log('Current state:', state);
}

// ============================================================================
// Example 2: Choice-Based Speech Bubble
// ============================================================================

function example2_ChoiceSpeechBubble() {
  console.log('\n=== Example 2: Choice-Based Speech Bubble ===');

  const choiceBubble = new SpeechChoiceData({
    text: "", // Will be set to first choice
    position: { x: 0, y: -60 },
    choices: [
      "Tell me about yourself",
      "What are you selling?",
      "Any quests available?",
      "Goodbye"
    ],
    initialChoice: 0
  });

  console.log('Initial choice:', choiceBubble.currentChoice);
  console.log('Choice index:', choiceBubble.currentChoiceIndex);

  // Navigate through choices
  choiceBubble.nextChoice();
  console.log('After next:', choiceBubble.currentChoice);

  choiceBubble.nextChoice();
  console.log('After next:', choiceBubble.currentChoice);

  choiceBubble.previousChoice();
  console.log('After previous:', choiceBubble.currentChoice);

  // Wrap around
  choiceBubble.setChoice(0);
  choiceBubble.previousChoice();
  console.log('After wrapping (should be last):', choiceBubble.currentChoice);

  // Get all choices
  console.log('All choices:', choiceBubble.choices);
}

// ============================================================================
// Example 3: Parsing Dialogue Nodes
// ============================================================================

function example3_ParsingDialogue() {
  console.log('\n=== Example 3: Parsing Dialogue Nodes ===');

  const rawNode: RawDialogueNode = {
    title: "MerchantGreeting",
    body: `Welcome to my shop!
What can I do for you today?
[[BuyItems]]
[[SellItems]]
[[AskQuest]]`
  };

  const parsed = DialogueNodeParser.parseNode(rawNode);

  console.log('Node title:', parsed.title);
  console.log('Dialogue lines:', parsed.lines);
  console.log('Next node options:', parsed.nextNodeTitles);
  console.log('Is terminal:', parsed.isTerminal);

  // Get a random line (for variety)
  const randomLine = DialogueNodeParser.getRandomLine(parsed);
  console.log('Random line:', randomLine);

  // Validate the node
  const validation = DialogueNodeParser.validateNode(parsed);
  console.log('Validation:', validation);
}

// ============================================================================
// Example 4: Complete Dialogue Flow
// ============================================================================

function example4_DialogueFlow() {
  console.log('\n=== Example 4: Complete Dialogue Flow ===');

  // Define a complete dialogue tree
  const rawDialogue: RawDialogueNode[] = [
    {
      title: "Approach",
      body: "Hello there, traveler!\n[[Greeting]]"
    },
    {
      title: "Greeting",
      body: "Greetings!\nHello!\n[[AskName]]\n[[AskBusiness]]"
    },
    {
      title: "AskName",
      body: "What's your name?\n[[TellName]]"
    },
    {
      title: "TellName",
      body: "I'm Marcus, a traveling merchant.\n[[AskBusiness]]"
    },
    {
      title: "AskBusiness",
      body: "What brings you here?\n[[TellBusiness]]"
    },
    {
      title: "TellBusiness",
      body: "I'm looking for rare artifacts.\nI buy and sell exotic goods.\n[[OfferHelp]]"
    },
    {
      title: "OfferHelp",
      body: "Can I help you with anything?\n[[AcceptHelp]]\n[[DeclineHelp]]"
    },
    {
      title: "AcceptHelp",
      body: "I have a quest for you. Find me 5 ancient coins.\n[[Farewell]]"
    },
    {
      title: "DeclineHelp",
      body: "No problem. Safe travels!\n[[Farewell]]"
    },
    {
      title: "Farewell",
      body: "Goodbye!\nFarewell!\nUntil we meet again!"
    }
  ];

  // Parse all nodes
  const nodes = DialogueNodeParser.parseNodes(rawDialogue);

  // Validate the dialogue tree
  const validation = DialogueNodeParser.validateDialogueTree(nodes);
  console.log('Dialogue tree validation:');
  console.log('  Valid:', validation.valid);
  if (validation.errors.length > 0) {
    console.log('  Errors:', validation.errors);
  }
  if (validation.warnings.length > 0) {
    console.log('  Warnings:', validation.warnings);
  }

  // Create dialogue flow manager
  const dialogue = new DialogueFlowManager(nodes, {
    defaultLineDuration: 2000
  });

  // Set up event handlers
  dialogue.setSpeakerChangeCallback((speaker, line) => {
    console.log(`  [${speaker.toUpperCase()}]: ${line}`);
  });

  dialogue.setQuestionsAvailableCallback((questions) => {
    console.log('  Available questions:');
    questions.forEach((q, i) => console.log(`    ${i + 1}. ${q}`));
  });

  dialogue.setNodeChangeCallback((node) => {
    console.log(`  [Moved to node: ${node.title}]`);
  });

  dialogue.setDialogueEndCallback(() => {
    console.log('  [Dialogue ended]');
  });

  // Start the dialogue
  console.log('\nStarting dialogue from "Approach" node:');
  dialogue.start("Approach", Speaker.NPC);

  // Simulate dialogue progression
  console.log('\nPlayer responds:');
  dialogue.nextNode();

  // Check for questions
  if (dialogue.hasMultipleChoices()) {
    console.log('\nPlayer chooses question 0:');
    dialogue.askQuestion(0);
  }

  console.log('\nNPC responds:');
  dialogue.nextNode();

  console.log('\nPlayer responds:');
  dialogue.nextNode();

  console.log('\nNPC responds:');
  dialogue.nextNode();

  console.log('\nPlayer responds:');
  dialogue.nextNode();

  // Check for questions again
  if (dialogue.hasMultipleChoices()) {
    console.log('\nPlayer chooses question 0 (accept help):');
    dialogue.askQuestion(0);
  }

  console.log('\nNPC responds:');
  dialogue.nextNode();

  console.log('\nContinuing to end:');
  dialogue.nextNode();

  // Get final state
  const finalState = dialogue.getState();
  console.log('\nFinal state:');
  console.log('  Active:', finalState.isActive);
  console.log('  Current speaker:', finalState.currentSpeaker);
}

// ============================================================================
// Example 5: Dialogue State Management
// ============================================================================

function example5_StateManagement() {
  console.log('\n=== Example 5: Dialogue State Management ===');

  const nodes = DialogueNodeParser.parseNodes([
    {
      title: "Start",
      body: "Let's begin!\n[[Middle]]"
    },
    {
      title: "Middle",
      body: "Halfway there!\n[[End]]"
    },
    {
      title: "End",
      body: "We're done!"
    }
  ]);

  const dialogue = new DialogueFlowManager(nodes);
  dialogue.start("Start", Speaker.NPC);

  // Check state at each step
  console.log('Initial state:', dialogue.getState());

  dialogue.nextNode();
  console.log('After first next:', dialogue.getState());

  dialogue.nextNode();
  console.log('After second next:', dialogue.getState());

  dialogue.nextNode();
  console.log('After third next (should end):', dialogue.getState());
}

// ============================================================================
// Run all examples
// ============================================================================

export function runAllExamples() {
  example1_BasicSpeechBubble();
  example2_ChoiceSpeechBubble();
  example3_ParsingDialogue();
  example4_DialogueFlow();
  example5_StateManagement();

  console.log('\n=== All examples completed ===');
}

// Run if this file is executed directly
if (require.main === module) {
  runAllExamples();
}
