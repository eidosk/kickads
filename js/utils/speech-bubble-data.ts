/**
 * Data model for speech bubbles
 */

import {
  SpeechBubbleConfig,
  SpeechBubblePosition,
  SpeechBubbleState,
  SpeechBubbleStyle,
  SpeechChoiceConfig,
  SpeechChoiceState
} from './speech-bubble.types';

/**
 * Default style constants for speech bubbles
 */
export const DEFAULT_SPEECH_BUBBLE_STYLE: Required<SpeechBubbleStyle> = {
  fontName: 'myfont',
  fontSize: 16,
  textHeight: 6,
  bodyHeight: 12,
  choicePadding: 2,
  whiteArrowWidth: 3
};

/**
 * Class representing speech bubble data and behavior
 */
export class SpeechBubbleData {
  protected _text: string;
  protected _position: SpeechBubblePosition;
  protected _style: Required<SpeechBubbleStyle>;
  protected _visible: boolean;

  constructor(config: SpeechBubbleConfig) {
    this._text = config.text;
    this._position = { ...config.position };
    this._style = { ...DEFAULT_SPEECH_BUBBLE_STYLE, ...config.style };
    this._visible = true;
  }

  /**
   * Get the current text
   */
  get text(): string {
    return this._text;
  }

  /**
   * Set new text
   */
  set text(value: string) {
    this._text = value;
  }

  /**
   * Get the position
   */
  get position(): SpeechBubblePosition {
    return { ...this._position };
  }

  /**
   * Get the style configuration
   */
  get style(): Required<SpeechBubbleStyle> {
    return { ...this._style };
  }

  /**
   * Get whether the bubble is visible
   */
  get visible(): boolean {
    return this._visible;
  }

  /**
   * Set visibility
   */
  set visible(value: boolean) {
    this._visible = value;
  }

  /**
   * Calculate the width of the text content
   * Note: This is a simplified calculation. In practice, you'd measure actual rendered text.
   */
  calculateTextWidth(text: string = this._text): number {
    // Rough estimation: each character is about 8 pixels wide at size 16
    return text.length * (this._style.fontSize / 2);
  }

  /**
   * Calculate the total width including corners
   */
  calculateBubbleWidth(cornerWidth: number = 6): number {
    return this.calculateTextWidth() + (cornerWidth * 2);
  }

  /**
   * Calculate the total height
   */
  calculateBubbleHeight(): number {
    return this._style.textHeight * 2;
  }

  /**
   * Get the current state of the speech bubble
   */
  getState(): SpeechBubbleState {
    return {
      text: this._text,
      visible: this._visible,
      width: this.calculateBubbleWidth(),
      height: this.calculateBubbleHeight()
    };
  }

  /**
   * Calculate centered X position based on bubble width
   */
  getCenteredX(cornerWidth: number = 6): number {
    return -Math.floor(this.calculateBubbleWidth(cornerWidth) * 0.5);
  }

  /**
   * Update the position
   */
  updatePosition(position: Partial<SpeechBubblePosition>): void {
    this._position = { ...this._position, ...position };
  }

  /**
   * Flip the bubble (mirror it)
   */
  flip(): void {
    this._position.flip = !this._position.flip;
  }
}

/**
 * Class representing choice-based speech bubble data
 */
export class SpeechChoiceData extends SpeechBubbleData {
  protected _choices: string[];
  protected _currentChoiceIndex: number;

  constructor(config: SpeechChoiceConfig) {
    super({ ...config, text: config.choices[config.initialChoice || 0] });
    this._choices = [...config.choices];
    this._currentChoiceIndex = config.initialChoice || 0;
  }

  /**
   * Get all available choices
   */
  get choices(): string[] {
    return [...this._choices];
  }

  /**
   * Get the current choice index
   */
  get currentChoiceIndex(): number {
    return this._currentChoiceIndex;
  }

  /**
   * Get the current choice text
   */
  get currentChoice(): string {
    return this._choices[this._currentChoiceIndex];
  }

  /**
   * Move to the next choice
   */
  nextChoice(): void {
    this._currentChoiceIndex++;
    if (this._currentChoiceIndex >= this._choices.length) {
      this._currentChoiceIndex = 0;
    }
    this._text = this._choices[this._currentChoiceIndex];
  }

  /**
   * Move to the previous choice
   */
  previousChoice(): void {
    this._currentChoiceIndex--;
    if (this._currentChoiceIndex < 0) {
      this._currentChoiceIndex = this._choices.length - 1;
    }
    this._text = this._choices[this._currentChoiceIndex];
  }

  /**
   * Set a specific choice by index
   */
  setChoice(index: number): void {
    if (index >= 0 && index < this._choices.length) {
      this._currentChoiceIndex = index;
      this._text = this._choices[this._currentChoiceIndex];
    }
  }

  /**
   * Calculate the bubble width including choice arrows and padding
   */
  calculateBubbleWidth(cornerWidth: number = 6): number {
    const textWidth = this.calculateTextWidth();
    const arrowsAndPadding = (this._style.whiteArrowWidth * 2) + this._style.choicePadding;
    return textWidth + arrowsAndPadding + (cornerWidth * 2);
  }

  /**
   * Get the current state of the choice bubble
   */
  getState(): SpeechChoiceState {
    return {
      ...super.getState(),
      choices: this._choices,
      currentChoiceIndex: this._currentChoiceIndex,
      width: this.calculateBubbleWidth()
    };
  }
}
