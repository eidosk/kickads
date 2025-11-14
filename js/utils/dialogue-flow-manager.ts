/**
 * Dialogue flow management
 */

import {
  Speaker,
  ParsedDialogueNode,
  DialogueConfig,
  DialogueState,
  DialogueCallback,
  SpeakerChangeCallback,
  QuestionCallback,
  NodeChangeCallback
} from './dialogue.types';
import { DialogueNodeParser } from './dialogue-node-parser';

/**
 * Default configuration for dialogue
 */
const DEFAULT_DIALOGUE_CONFIG: Required<DialogueConfig> = {
  defaultLineDuration: 2000
};

/**
 * Manages the flow of dialogue between speakers
 */
export class DialogueFlowManager {
  private config: Required<DialogueConfig>;
  private nodes: ParsedDialogueNode[];
  private currentNode: ParsedDialogueNode | null = null;
  private currentSpeaker: Speaker = Speaker.PLAYER;
  private currentLine: string = '';
  private isActive: boolean = false;
  private isLastNode: boolean = false;

  // Event callbacks
  private onSpeakerChange: SpeakerChangeCallback | null = null;
  private onQuestionsAvailable: QuestionCallback | null = null;
  private onDialogueEnd: DialogueCallback | null = null;
  private onNodeChange: NodeChangeCallback | null = null;

  constructor(
    nodes: ParsedDialogueNode[],
    config?: DialogueConfig
  ) {
    this.nodes = nodes;
    this.config = { ...DEFAULT_DIALOGUE_CONFIG, ...config };
  }

  /**
   * Start dialogue from a specific node
   */
  start(nodeTitle: string, initialSpeaker: Speaker = Speaker.PLAYER): boolean {
    const node = DialogueNodeParser.findNodeByTitle(this.nodes, nodeTitle);

    if (!node) {
      console.error(`Cannot start dialogue: node "${nodeTitle}" not found`);
      return false;
    }

    this.isActive = true;
    this.currentSpeaker = initialSpeaker;
    this.gotoNode(nodeTitle);

    return true;
  }

  /**
   * Navigate to a specific dialogue node
   */
  gotoNode(nodeTitle: string): void {
    const node = DialogueNodeParser.findNodeByTitle(this.nodes, nodeTitle);

    if (!node) {
      console.error(`Node "${nodeTitle}" not found`);
      return;
    }

    this.currentNode = node;
    this.currentLine = DialogueNodeParser.getRandomLine(node);
    this.isLastNode = node.isTerminal;

    if (this.onNodeChange) {
      this.onNodeChange(node);
    }
  }

  /**
   * Move to the next node in the dialogue
   */
  nextNode(): void {
    if (!this.currentNode) {
      console.error('No current node');
      return;
    }

    // If terminal node, end dialogue
    if (this.isLastNode) {
      this.end();
      return;
    }

    // Switch speaker
    this.switchSpeaker();

    // If multiple next nodes, show questions
    if (this.currentNode.nextNodeTitles.length > 1) {
      const questions = DialogueNodeParser.extractQuestions(
        this.currentNode.nextNodeTitles,
        this.nodes
      );

      if (this.onQuestionsAvailable) {
        this.onQuestionsAvailable(questions);
      }
    } else if (this.currentNode.nextNodeTitles.length === 1) {
      // Single next node, go to it automatically
      this.gotoNode(this.currentNode.nextNodeTitles[0]);

      if (this.onSpeakerChange) {
        this.onSpeakerChange(this.currentSpeaker, this.currentLine);
      }
    } else {
      // No next nodes, end dialogue
      this.end();
    }
  }

  /**
   * Ask a specific question by index
   */
  askQuestion(questionIndex: number): void {
    if (!this.currentNode) {
      console.error('No current node');
      return;
    }

    if (questionIndex < 0 || questionIndex >= this.currentNode.nextNodeTitles.length) {
      console.error(`Invalid question index: ${questionIndex}`);
      return;
    }

    const nextNodeTitle = this.currentNode.nextNodeTitles[questionIndex];
    this.gotoNode(nextNodeTitle);

    if (this.onSpeakerChange) {
      this.onSpeakerChange(this.currentSpeaker, this.currentLine);
    }
  }

  /**
   * Switch the current speaker
   */
  switchSpeaker(): void {
    this.currentSpeaker = this.currentSpeaker === Speaker.PLAYER
      ? Speaker.NPC
      : Speaker.PLAYER;
  }

  /**
   * End the dialogue
   */
  end(): void {
    this.isActive = false;
    this.currentNode = null;
    this.currentLine = '';

    if (this.onDialogueEnd) {
      this.onDialogueEnd();
    }
  }

  /**
   * Get the current dialogue state
   */
  getState(): DialogueState {
    return {
      isActive: this.isActive,
      currentNode: this.currentNode,
      currentLine: this.currentLine,
      currentSpeaker: this.currentSpeaker,
      isLastNode: this.isLastNode,
      availableQuestions: this.currentNode
        ? DialogueNodeParser.extractQuestions(this.currentNode.nextNodeTitles, this.nodes)
        : []
    };
  }

  /**
   * Get the current line of dialogue
   */
  getCurrentLine(): string {
    return this.currentLine;
  }

  /**
   * Get the current speaker
   */
  getCurrentSpeaker(): Speaker {
    return this.currentSpeaker;
  }

  /**
   * Check if dialogue is active
   */
  isDialogueActive(): boolean {
    return this.isActive;
  }

  /**
   * Check if current node has multiple choices
   */
  hasMultipleChoices(): boolean {
    return this.currentNode !== null && this.currentNode.nextNodeTitles.length > 1;
  }

  /**
   * Get available questions for the current node
   */
  getAvailableQuestions(): string[] {
    if (!this.currentNode) {
      return [];
    }

    return DialogueNodeParser.extractQuestions(
      this.currentNode.nextNodeTitles,
      this.nodes
    );
  }

  // Event listener registration methods

  /**
   * Register callback for speaker change events
   */
  setSpeakerChangeCallback(callback: SpeakerChangeCallback): void {
    this.onSpeakerChange = callback;
  }

  /**
   * Register callback for when questions become available
   */
  setQuestionsAvailableCallback(callback: QuestionCallback): void {
    this.onQuestionsAvailable = callback;
  }

  /**
   * Register callback for dialogue end
   */
  setDialogueEndCallback(callback: DialogueCallback): void {
    this.onDialogueEnd = callback;
  }

  /**
   * Register callback for node changes
   */
  setNodeChangeCallback(callback: NodeChangeCallback): void {
    this.onNodeChange = callback;
  }

  /**
   * Clear all event callbacks
   */
  clearCallbacks(): void {
    this.onSpeakerChange = null;
    this.onQuestionsAvailable = null;
    this.onDialogueEnd = null;
    this.onNodeChange = null;
  }
}
