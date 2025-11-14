/**
 * Type definitions for the Speech Bubble system
 */

/**
 * Position and alignment options for speech bubbles
 */
export interface SpeechBubblePosition {
  x: number;
  y: number;
  /** Whether to center the bubble horizontally */
  centerHorizontally?: boolean;
  /** Whether to flip the bubble (mirror) */
  flip?: boolean;
}

/**
 * Styling configuration for speech bubbles
 */
export interface SpeechBubbleStyle {
  /** Font name for bitmap text */
  fontName?: string;
  /** Font size */
  fontSize?: number;
  /** Text height constant */
  textHeight?: number;
  /** Body height constant */
  bodyHeight?: number;
  /** Padding for choice bubbles */
  choicePadding?: number;
  /** Width of white arrows in choice bubbles */
  whiteArrowWidth?: number;
}

/**
 * Configuration for creating a speech bubble
 */
export interface SpeechBubbleConfig {
  /** The text to display */
  text: string;
  /** Position configuration */
  position: SpeechBubblePosition;
  /** Style configuration */
  style?: SpeechBubbleStyle;
}

/**
 * Configuration for creating a choice-based speech bubble
 */
export interface SpeechChoiceConfig extends SpeechBubbleConfig {
  /** Array of choice texts */
  choices: string[];
  /** Initially selected choice index */
  initialChoice?: number;
}

/**
 * Represents the current state of a speech bubble
 */
export interface SpeechBubbleState {
  /** Current text being displayed */
  text: string;
  /** Whether the bubble is currently visible */
  visible: boolean;
  /** Width of the bubble */
  width: number;
  /** Height of the bubble */
  height: number;
}

/**
 * Represents the state of a choice-based speech bubble
 */
export interface SpeechChoiceState extends SpeechBubbleState {
  /** Array of available choices */
  choices: string[];
  /** Currently selected choice index */
  currentChoiceIndex: number;
}
