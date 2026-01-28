import { Token, TokenType, ParseError } from './types';

export class Lexer {
  private position = 0;
  private currentToken: Token | null = null;

  constructor(private input: string) {}

  public peek(): Token {
    if (!this.currentToken) {
      this.currentToken = this.readToken();
    }
    return this.currentToken;
  }

  public next(): Token {
    const token = this.peek();
    this.currentToken = null;
    return token;
  }

  private skipWhitespace(): void {
    while (this.position < this.input.length && /\s/.test(this.input[this.position])) {
      this.position++;
    }
  }

  private readToken(): Token {
    this.skipWhitespace();

    if (this.position >= this.input.length) {
      return { type: TokenType.Eof, value: '', position: this.position };
    }

    const start = this.position;
    const char = this.input[this.position];

    // Single character operators
    if (char === '・') {
      this.position++;
      return { type: TokenType.And, value: char, position: start };
    }
    if (char === '+') {
      this.position++;
      return { type: TokenType.Or, value: char, position: start };
    }
    if (char === '¬') {
      this.position++;
      return { type: TokenType.Not, value: char, position: start };
    }
    if (char === '⊕') {
      this.position++;
      return { type: TokenType.Xor, value: char, position: start };
    }
    if (char === '(') {
      this.position++;
      return { type: TokenType.LeftParen, value: char, position: start };
    }
    if (char === ')') {
      this.position++;
      return { type: TokenType.RightParen, value: char, position: start };
    }

    // Constants
    if (char === '0' || char === '1') {
      this.position++;
      return { type: TokenType.Constant, value: char, position: start };
    }

    // Variables
    if (/[a-zA-Z]/.test(char)) {
      return this.readVariable();
    }

    throw new ParseError(`Unexpected character: ${char}`, start);
  }

  private readVariable(): Token {
    const start = this.position;
    let name = '';

    // Variables must start with a letter
    while (this.position < this.input.length) {
      const char = this.input[this.position];
      // Letters, digits, underscores, and subscripts (U+2080-U+2089)
      if (/[a-zA-Z0-9_]/.test(char) || (char >= '\u2080' && char <= '\u2089')) {
        name += char;
        this.position++;
      } else {
        break;
      }
    }

    return { type: TokenType.Variable, value: name, position: start };
  }
}
