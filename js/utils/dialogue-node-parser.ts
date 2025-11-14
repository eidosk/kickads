/**
 * Dialogue node parsing utilities
 */

import { RawDialogueNode, ParsedDialogueNode } from './dialogue.types';

/**
 * Class for parsing dialogue nodes from raw JSON format
 */
export class DialogueNodeParser {
  /**
   * Parse a raw dialogue node into a structured format
   */
  static parseNode(rawNode: RawDialogueNode): ParsedDialogueNode {
    const lines: string[] = [];
    const nextNodeTitles: string[] = [];

    // Split body by newlines
    const bodyLines = rawNode.body.split('\n');

    // Process each line
    for (const line of bodyLines) {
      const trimmedLine = line.trim();

      // Check if this line is a node reference: [[NodeTitle]]
      if (trimmedLine.startsWith('[[') && trimmedLine.endsWith(']]')) {
        // Extract the node title
        const nodeTitle = trimmedLine.substring(2, trimmedLine.length - 2);
        nextNodeTitles.push(nodeTitle);
      } else if (trimmedLine.length > 0) {
        // Regular dialogue line
        lines.push(trimmedLine);
      }
    }

    return {
      title: rawNode.title,
      lines: lines,
      nextNodeTitles: nextNodeTitles,
      isTerminal: nextNodeTitles.length === 0,
      tags: rawNode.tags
    };
  }

  /**
   * Parse an array of raw dialogue nodes
   */
  static parseNodes(rawNodes: RawDialogueNode[]): ParsedDialogueNode[] {
    return rawNodes.map(node => this.parseNode(node));
  }

  /**
   * Find a node by title in an array of parsed nodes
   */
  static findNodeByTitle(
    nodes: ParsedDialogueNode[],
    title: string
  ): ParsedDialogueNode | null {
    return nodes.find(node => node.title === title) || null;
  }

  /**
   * Get a random line from a node's lines array
   */
  static getRandomLine(node: ParsedDialogueNode): string {
    if (node.lines.length === 0) {
      return '';
    }
    if (node.lines.length === 1) {
      return node.lines[0];
    }
    const randomIndex = Math.floor(Math.random() * node.lines.length);
    return node.lines[randomIndex];
  }

  /**
   * Extract questions from an array of node titles
   * Questions are the first line of each referenced node
   */
  static extractQuestions(
    nodeTitles: string[],
    allNodes: ParsedDialogueNode[]
  ): string[] {
    const questions: string[] = [];

    for (const title of nodeTitles) {
      const node = this.findNodeByTitle(allNodes, title);
      if (node && node.lines.length > 0) {
        questions.push(node.lines[0]);
      }
    }

    return questions;
  }

  /**
   * Validate a dialogue node structure
   */
  static validateNode(node: ParsedDialogueNode): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!node.title || node.title.trim().length === 0) {
      errors.push('Node must have a title');
    }

    if (node.lines.length === 0 && node.nextNodeTitles.length === 0) {
      errors.push('Node must have either dialogue lines or next node references');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate an entire dialogue tree
   */
  static validateDialogueTree(nodes: ParsedDialogueNode[]): {
    valid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];
    const nodeTitles = new Set(nodes.map(n => n.title));

    // Check each node
    for (const node of nodes) {
      const nodeValidation = this.validateNode(node);
      if (!nodeValidation.valid) {
        errors.push(`Node "${node.title}": ${nodeValidation.errors.join(', ')}`);
      }

      // Check if referenced nodes exist
      for (const nextTitle of node.nextNodeTitles) {
        if (!nodeTitles.has(nextTitle)) {
          errors.push(`Node "${node.title}" references non-existent node "${nextTitle}"`);
        }
      }
    }

    // Check for unreachable nodes (warning only)
    const reachableNodes = new Set<string>();
    const findReachable = (title: string) => {
      if (reachableNodes.has(title)) return;
      reachableNodes.add(title);
      const node = this.findNodeByTitle(nodes, title);
      if (node) {
        node.nextNodeTitles.forEach(nextTitle => findReachable(nextTitle));
      }
    };

    // Start from first node (assuming it's the entry point)
    if (nodes.length > 0) {
      findReachable(nodes[0].title);

      for (const node of nodes) {
        if (!reachableNodes.has(node.title)) {
          warnings.push(`Node "${node.title}" may be unreachable`);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }
}
