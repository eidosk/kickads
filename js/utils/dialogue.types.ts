/**
 * Type definitions for the Dialogue system
 */

/**
 * Represents a speaker in the dialogue
 */
export enum Speaker {
  PLAYER = 'player',
  NPC = 'npc'
}

/**
 * Raw dialogue node structure (as stored in JSON)
 */
export interface RawDialogueNode {
  /** Title/ID of this node */
  title: string;
  /** Body text containing dialogue lines and node references */
  body: string;
  /** Optional tags for categorization */
  tags?: string[];
}

/**
 * Parsed dialogue node with separated lines and next nodes
 */
export interface ParsedDialogueNode {
  /** Title/ID of this node */
  title: string;
  /** Array of dialogue lines (one will be selected to display) */
  lines: string[];
  /** Array of titles of next nodes (for branching) */
  nextNodeTitles: string[];
  /** Whether this is a terminal node (no next nodes) */
  isTerminal: boolean;
  /** Optional tags */
  tags?: string[];
}

/**
 * Configuration for the dialogue system
 */
export interface DialogueConfig {
  /** Default duration to show each line (in milliseconds) */
  defaultLineDuration?: number;
}

/**
 * Current state of the dialogue system
 */
export interface DialogueState {
  /** Whether dialogue is currently active */
  isActive: boolean;
  /** Current node being processed */
  currentNode: ParsedDialogueNode | null;
  /** Current line being displayed */
  currentLine: string;
  /** Current speaker */
  currentSpeaker: Speaker;
  /** Whether this is the last node */
  isLastNode: boolean;
  /** Available questions/choices for the player */
  availableQuestions: string[];
}

/**
 * Callback function types for dialogue events
 */
export type DialogueCallback = () => void;
export type SpeakerChangeCallback = (speaker: Speaker, line: string) => void;
export type QuestionCallback = (questions: string[]) => void;
export type NodeChangeCallback = (node: ParsedDialogueNode) => void;
