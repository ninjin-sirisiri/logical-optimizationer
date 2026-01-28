export enum TokenType {
  Variable = 'Variable',
  Constant = 'Constant',
  And = 'And',
  Or = 'Or',
  Not = 'Not',
  Xor = 'Xor',
  LeftParen = 'LeftParen',
  RightParen = 'RightParen',
  Eof = 'Eof',
}

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
  constructor(
    public message: string,
    public position: number,
    public expected?: string[],
  ) {
    super(
      `${message} at position ${position}${expected ? `. Expected: ${expected.join(', ')}` : ''}`,
    );
    this.name = 'ParseError';
  }
}

export class EvaluationError extends Error {
  constructor(public message: string) {
    super(message);
    this.name = 'EvaluationError';
  }
}
