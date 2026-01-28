export const TokenType = {
  Variable: 'Variable',
  Constant: 'Constant',
  And: 'And',
  Or: 'Or',
  Not: 'Not',
  Xor: 'Xor',
  LeftParen: 'LeftParen',
  RightParen: 'RightParen',
  Eof: 'Eof',
} as const;

export type TokenType = (typeof TokenType)[keyof typeof TokenType];

export interface Token {
  type: TokenType;
  value: string;
  position: number;
}

export type BinaryOperator = 'and' | 'or' | 'xor';

export type ASTNode =
  | { type: 'constant'; value: boolean }
  | { type: 'variable'; name: string }
  | { type: 'unary'; operator: 'not'; operand: ASTNode }
  | { type: 'binary'; operator: BinaryOperator; left: ASTNode; right: ASTNode };

export class ParseError extends Error {
  public override message: string;
  public position: number;
  public expected?: string[];

  constructor(message: string, position: number, expected?: string[]) {
    const fullMessage = `${message} at position ${position}${expected ? `. Expected: ${expected.join(', ')}` : ''}`;
    super(fullMessage);
    this.message = fullMessage;
    this.position = position;
    this.expected = expected;
    this.name = 'ParseError';
  }
}

export class EvaluationError extends Error {
  public override message: string;

  constructor(message: string) {
    super(message);
    this.message = message;
    this.name = 'EvaluationError';
  }
}
