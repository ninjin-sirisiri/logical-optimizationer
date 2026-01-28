import { type Token, TokenType, ParseError } from './types';

export class Lexer {
  private input: string;
  private position = 0;
  private currentToken: Token | null = null;

  constructor(input: string) {
    this.input = input;
  }

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
    // Check for standard whitespace or full-width space (U+3000)
    while (
      this.position < this.input.length &&
      (/\s/.test(this.input[this.position]) || this.input[this.position] === '\u3000')
    ) {
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
    if (char === '・' || char === '&' || char === '*') {
      this.position++;
      return { type: TokenType.And, value: char, position: start };
    }
    // Added '＋' and '｜' for full-width support
    if (char === '+' || char === '|' || char === '＋' || char === '｜') {
      this.position++;
      return { type: TokenType.Or, value: char, position: start };
    }
    // Added '！' for full-width support
    if (char === '¬' || char === '~' || char === '!' || char === '！') {
      this.position++;
      return { type: TokenType.Not, value: char, position: start };
    }
    if (char === '⊕' || char === '^') {
      this.position++;
      return { type: TokenType.Xor, value: char, position: start };
    }
    // Added '（' for full-width support
    if (char === '(' || char === '（') {
      this.position++;
      return { type: TokenType.LeftParen, value: char, position: start };
    }
    // Added '）' for full-width support
    if (char === ')' || char === '）') {
      this.position++;
      return { type: TokenType.RightParen, value: char, position: start };
    }

    // Constants
    // Added '０' and '１' for full-width support
    if (char === '0' || char === '1' || char === '０' || char === '１') {
      this.position++;
      // Normalize value to ASCII for processing
      const normalized = char === '０' ? '0' : char === '１' ? '1' : char;
      return { type: TokenType.Constant, value: normalized, position: start };
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
