# Rust Algorythmen - Interpreter

## Tokenizer

```rust
use std::fmt::Display;

use crate::{ErrorMessage, MyError};

#[derive(Debug, PartialEq, Eq, Clone)]
pub enum TokenType {
    True,
    False,
    And,
    Or,
    Not,
    LeftParen,
    RightParen,
}

#[derive(Debug, PartialEq, Eq, Clone)]
pub struct Token {
    pub token_type: TokenType,
    pub pos_rnge: (usize, usize),
}

impl Display for TokenType {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let token_str = match self {
            TokenType::LeftParen => "LParen",
            TokenType::RightParen => "RParen",
            TokenType::And => "And",
            TokenType::Or => "Or",
            TokenType::Not => "Not",
            TokenType::True => "True",
            TokenType::False => "False",
        };
        write!(f, "{}", token_str)
    }
}

impl Display for Token {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.token_type)
    }
}

pub struct Tokenizer {
    input: Vec<char>,
    position: usize,
}

impl Tokenizer {
    pub fn new(input: &str) -> Self {
        Tokenizer {
            input: input.chars().collect(),
            position: 0,
        }
    }

    pub fn tokenize(&mut self) -> Result<Vec<Token>, Vec<MyError>> {
        let mut tokens = Vec::new();
        let mut errors = Vec::new();
        while self.position < self.input.len() {
            self.skip_whitespace();

            let pos_rnge_start = self.position;
            let token_type = self.next_token();

            match token_type {
                Ok(t_type) => {
                    tokens.push(Token {
                        token_type: t_type,
                        pos_rnge: (pos_rnge_start, self.position),
                    });
                }
                Err(err) => {
                    errors.push(err);
                }
            }
        }
        if errors.is_empty() {
            Ok(tokens)
        } else {
            Err(errors)
        }
    }

    pub fn next_token(&mut self) -> Result<TokenType, MyError> {
        let pos = self.position;
        if self.position >= self.input.len() {
            return Err(MyError {
                message: ErrorMessage::UnexpectedEndOfInput,
                pos_rnge: (pos, pos),
            });
        }
        let ch = self.input[self.position];

        match ch {
            '(' => {
                self.position += 1;
                Ok(TokenType::LeftParen)
            }
            ')' => {
                self.position += 1;
                Ok(TokenType::RightParen)
            }
            _ => {
                let start_pos = self.position;
                while self.position < self.input.len()
                    && self.input[self.position].is_alphanumeric()
                {
                    self.position += 1;
                }
                let word: String = self.input[start_pos..self.position]
                    .iter()
                    .collect::<String>()
                    .to_lowercase();
                match word.as_str() {
                    "and" => Ok(TokenType::And),
                    "or" => Ok(TokenType::Or),
                    "not" => Ok(TokenType::Not),
                    "true" => Ok(TokenType::True),
                    "false" => Ok(TokenType::False),
                    _ => Err(MyError {
                        message: ErrorMessage::UnexpectedToken(word),
                        pos_rnge: (pos, self.position),
                    }),
                }
            }
        }
    }

    fn skip_whitespace(&mut self) {
        while self.position < self.input.len() && self.input[self.position].is_whitespace() {
            self.position += 1;
        }
    }
}
```

## Shunting Yard Algorithmus

Der Shunting Yard Algorithmus ist ein Verfahren zur Umwandlung von Infix-Ausdrücken (z.B. "3 + 4 *2 / ( 1 - 5 )") in Postfix-Ausdrücke (auch bekannt als Reverse Polish Notation, z.B. "3 4 2* 1 5 - / +"). Dieser Algorithmus wurde von Edsger Dijkstra entwickelt und wird häufig in Taschenrechnern und Compiler-Designs verwendet.

### Implementierung in Rust

```rust
pub fn to_shunting_yard(tokens: &Vec<Token>) -> Result<Vec<Token>, Vec<MyError>> {
    fn get_precedence(token_type: &TokenType) -> i32 {
        match token_type {
            TokenType::Not => 3,
            TokenType::And => 2,
            TokenType::Or => 1,
            _ => 0,
        }
    }

    fn is_left_associative(token_type: &TokenType) -> bool {
        match token_type {
            TokenType::And | TokenType::Or => true,
            _ => false,
        }
    }

    let mut stack: Vec<Token> = Vec::new();
    let mut output = Vec::new();
    let mut errors = Vec::new();

    for token in tokens {
        // println!("Token: {}", token);
        match token.token_type {
            TokenType::True | TokenType::False => {
                output.push(token.clone());
            }
            TokenType::Not | TokenType::And | TokenType::Or => {
                while let Some(top) = stack.last() {
                    let top_prec = get_precedence(&top.token_type);
                    let curr_prec = get_precedence(&token.token_type);
                    if top_prec >= curr_prec && is_left_associative(&token.token_type) {
                        output.push(stack.pop().unwrap());
                    } else {
                        break;
                    }
                }
                stack.push(token.clone());
            }
            TokenType::LeftParen => {
                stack.push(token.clone());
            }
            TokenType::RightParen => {
                while let Some(top) = stack.pop() {
                    if top.token_type == TokenType::LeftParen {
                        break;
                    } else {
                        output.push(top);
                    }
                }
            }
        }
    }

    while let Some(top) = stack.pop() {
        if top.token_type == TokenType::LeftParen {
            errors.push(MyError {
                message: ErrorMessage::ExpectedToken("RightParen".to_string()),
                pos_rnge: top.pos_rnge,
            });
        } else {
            output.push(top);
        }
    }

    if errors.is_empty() {
        Ok(output)
    } else {
        Err(errors)
    }
}
```

### Erklärung des Codes

1. **Token-Typen und Präzedenz**: Der Code definiert eine Funktion `get_precedence`, die die Präzedenz der Operatoren (`Not`, `And`, `Or`) zurückgibt. Höhere Werte bedeuten höhere Präzedenz. Die Funktion `is_left_associative` bestimmt, ob ein Operator linksassoziativ ist.
2. **Hauptlogik**: Der Algorithmus iteriert über die Eingabetokens. Je nach Token-Typ wird das Token entweder direkt zur Ausgabe hinzugefügt (bei `True` und `False`), auf den Stack gelegt (bei Operatoren und linken Klammern) oder es werden Tokens vom Stack zur Ausgabe verschoben (bei rechten Klammern).
3. **Abschluss**: Nachdem alle Tokens verarbeitet wurden, werden verbleibende Tokens auf dem Stack zur Ausgabe hinzugefügt. Wenn eine linke Klammer ohne passende rechte Klammer gefunden wird, wird ein Fehler generiert.

## Parser/Interpreter

```rust

struct RpnParser<'a> {
    tokens: &'a Vec<Token>,
    position: usize,
}

impl<'a> RpnParser<'a> {
    fn new(tokens: &'a Vec<Token>) -> Self {
        Self {
            tokens,
            position: 0,
        }
    }

    pub fn error(&self, msg: ErrorMessage) -> MyError {
        MyError {
            message: msg,
            pos_rnge: if self.position < self.tokens.len() {
                self.tokens[self.position].pos_rnge
            } else if !self.tokens.is_empty() {
                let last_token = &self.tokens[self.tokens.len() - 1];
                (last_token.pos_rnge.1, last_token.pos_rnge.1)
            } else {
                (0, 0)
            },
        }
    }

    pub fn evaluate(&mut self) -> Result<bool, MyError> {
        let mut stack: Vec<bool> = Vec::new();

        while self.position < self.tokens.len() {
            let token = &self.tokens[self.position];
            match token.token_type {
                TokenType::True => stack.push(true),
                TokenType::False => stack.push(false),
                TokenType::Not => {
                    if let Some(value) = stack.pop() {
                        stack.push(!value);
                    } else {
                        return Err(self
                            .error(ErrorMessage::UnexpectedToken("operand for NOT".to_string())));
                    }
                }
                TokenType::And => {
                    if let (Some(right), Some(left)) = (stack.pop(), stack.pop()) {
                        stack.push(left && right);
                    } else {
                        return Err(self.error(ErrorMessage::UnexpectedToken(
                            "operands for AND".to_string(),
                        )));
                    }
                }
                TokenType::Or => {
                    if let (Some(right), Some(left)) = (stack.pop(), stack.pop()) {
                        stack.push(left || right);
                    } else {
                        return Err(self
                            .error(ErrorMessage::UnexpectedToken("operands for OR".to_string())));
                    }
                }
                _ => {
                    return Err(self.error(ErrorMessage::UnexpectedToken(format!(
                        "{:?}",
                        token.token_type
                    ))));
                }
            }
            self.position += 1;
        }

        if let Some(result) = stack.pop() {
            Ok(result)
        } else {
            Err(self.error(ErrorMessage::UnexpectedEndOfInput))
        }
    }
}
```

## Recursive Descent Parser

```rust
use crate::{
    tokenizer::{Token, TokenType},
    ErrorMessage, MyError,
};

struct Parser<'a> {
    tokens: &'a Vec<Token>,
    position: usize,
}

impl<'a> Parser<'a> {
    fn new(tokens: &'a Vec<Token>) -> Self {
        Self {
            tokens,
            position: 0,
        }
    }

    fn error(&self, msg: ErrorMessage) -> MyError {
        MyError {
            message: msg,
            pos_rnge: if self.position < self.tokens.len() {
                self.tokens[self.position].pos_rnge
            } else if !self.tokens.is_empty() {
                let last_token = &self.tokens[self.tokens.len() - 1];
                (last_token.pos_rnge.1, last_token.pos_rnge.1)
            } else {
                (0, 0)
            },
        }
    }

    fn peek(&self) -> Option<&TokenType> {
        self.tokens
            .get(self.position)
            .map(|token| &token.token_type)
    }

    fn advance(&mut self) {
        if self.position < self.tokens.len() {
            self.position += 1;
        }
    }

    fn expression(&mut self) -> Result<bool, MyError> {
        let mut left = self.term()?;

        while let Some(TokenType::Or) = self.peek() {
            self.advance();
            let right = self.term()?;
            left = left || right;
        }

        Ok(left)
    }

    fn term(&mut self) -> Result<bool, MyError> {
        let mut left = self.factor()?;

        while let Some(TokenType::And) = self.peek() {
            self.advance();
            let right = self.factor()?;
            left = left && right;
        }

        Ok(left)
    }

    fn factor(&mut self) -> Result<bool, MyError> {
        match self.peek() {
            Some(TokenType::Not) => {
                self.advance();
                let operand = self.factor()?;
                Ok(!operand)
            }
            Some(TokenType::LeftParen) => {
                self.advance();
                let expr = self.expression()?;
                match self.peek() {
                    Some(TokenType::RightParen) => {
                        self.advance();
                        Ok(expr)
                    }
                    _ => Err(self.error(ErrorMessage::ExpectedToken(")".to_string()))),
                }
            }
            Some(TokenType::True) => {
                self.advance();
                Ok(true)
            }
            Some(TokenType::False) => {
                self.advance();
                Ok(false)
            }
            Some(token) => Err(self.error(ErrorMessage::UnexpectedToken(format!("{:?}", token)))),
            None => Err(self.error(ErrorMessage::UnexpectedEndOfInput)),
        }
    }
}

pub fn interpret(input: &Vec<Token>) -> Result<bool, Vec<MyError>> {
    let mut parser = Parser::new(input);
    let mut errors = Vec::new();
    let result = parser.expression();
    if parser.position < input.len() {
        errors.push(parser.error(ErrorMessage::UnexpectedToken(format!(
            "{:?}",
            input[parser.position].token_type
        ))));
    }
    match result {
        Ok(value) if errors.is_empty() => Ok(value),
        Ok(_) | Err(_) => Err(errors),
    }
}

```
