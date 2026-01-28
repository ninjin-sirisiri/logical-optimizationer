import { Lexer } from './lexer';
import { type ASTNode, TokenType, ParseError, type BinaryOperator } from './types';

// Precedence (Binding Power)
// OR < XOR < AND < NOT
const INFIX_BP: Record<string, [number, number]> = {
  '+': [1, 2], // OR - Left associative
  '⊕': [3, 4], // XOR - Left associative
  '・': [5, 6], // AND - Left associative
};

const PREFIX_BP: Record<string, number> = {
  '¬': 7, // NOT
};

export class Parser {
  private lexer: Lexer;

  constructor(lexer: Lexer) {
    this.lexer = lexer;
  }

  public parse(): ASTNode {
    const node = this.parseExpression(0);
    const endToken = this.lexer.peek();
    if (endToken.type !== TokenType.Eof) {
      throw new ParseError(
        `Unexpected token after expression: ${endToken.value}`,
        endToken.position,
      );
    }
    return node;
  }

  private parseExpression(minBp: number): ASTNode {
    let left = this.parsePrefix();

    while (true) {
      const opToken = this.lexer.peek();
      if (opToken.type === TokenType.Eof || opToken.type === TokenType.RightParen) {
        break;
      }

      const bp = INFIX_BP[opToken.value];
      if (!bp) {
        // Not an infix operator we recognize here
        break;
      }

      const [lBp, rBp] = bp;
      if (lBp < minBp) {
        break;
      }

      // Consume operator
      this.lexer.next();
      const right = this.parseExpression(rBp);

      left = {
        type: 'binary',
        operator: this.tokenToBinaryOperator(opToken.type),
        left,
        right,
      };
    }

    return left;
  }

  private parsePrefix(): ASTNode {
    const token = this.lexer.next();

    switch (token.type) {
      case TokenType.Variable:
        return { type: 'variable', name: token.value };

      case TokenType.Constant:
        return { type: 'constant', value: token.value === '1' };

      case TokenType.Not: {
        const bp = PREFIX_BP['¬'];
        const operand = this.parseExpression(bp);
        return { type: 'unary', operator: 'not', operand };
      }

      case TokenType.LeftParen: {
        const node = this.parseExpression(0);
        const nextToken = this.lexer.next();
        if (nextToken.type !== TokenType.RightParen) {
          throw new ParseError('Expected closing parenthesis', nextToken.position, [')']);
        }
        return node;
      }

      case TokenType.Eof:
        throw new ParseError('Unexpected end of input', token.position);

      default:
        throw new ParseError(`Unexpected token: ${token.value}`, token.position);
    }
  }

  private tokenToBinaryOperator(type: TokenType): BinaryOperator {
    switch (type) {
      case TokenType.And:
        return 'and';
      case TokenType.Or:
        return 'or';
      case TokenType.Xor:
        return 'xor';
      default:
        throw new Error(`Unknown operator type: ${type}`);
    }
  }
}
