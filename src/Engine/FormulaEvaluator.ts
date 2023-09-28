import Cell from "./Cell"
import SheetMemory from "./SheetMemory"
import { ErrorMessages } from "./GlobalDefinitions";


/*
FormulaEvaluator is used to evaluate the formula for the current cell
it is only called for a cell when all cells it depends on have been evaluated
*/
export class FormulaEvaluator {
  // Define a function called update that takes a string parameter and returns a number
  private _errorOccured: boolean = false;
  private _errorMessage: string = "";
  private _currentFormula: FormulaType = [];
  private _lastResult: number = 0;
  private _sheetMemory: SheetMemory;
  private _result: number = 0;

  private operators = new Set(['+', '-', '*', '/']);
  private precedence: Record<string, number> = {
    '+': 1,
    '-': 1,
    '*': 2,
    '/': 2,
  };


  constructor(memory: SheetMemory) {
    this._sheetMemory = memory;
  }


  /**
   * 
   * It gets called by CalculationManager to reset the FormulaEvaluator attributes
   * 
   */  
  public resetStates(): void {
    this._errorOccured = false;
    this._errorMessage = "";
    this._currentFormula = [];
    this._result = 0;
  }

  /**
   * 
   * @param formula
   * It evaluates the list of tokens to a number if the formula is valid
   * 
   */                        
  evaluate(formula: FormulaType) {
    // Assignment 1: Implement Calculation Engine
    this._currentFormula = formula;

    let len: number = formula.length;
    if (len === 0) {
      this._errorMessage = ErrorMessages.emptyFormula;
      return;
    }

    const postfix = this.convertToPostfix(formula);
    if (!postfix) {
      this._result = 0;
      return;
    }
    this.evaluatePostfix(postfix);
  }

  /**
   * 
   * @param formula
   * @returns a list of postfix tokens if the formula is valid
   * @returns null if the formula is invalid
   * 
   */
  convertToPostfix(formula: FormulaType): string[] | null {
    const output: string[] = [];
    const stack: string[] = [];

    for (const token of formula) {
      if (this.isNumber(token)) {
        output.push(token);
      } else if (this.isCellReference(token)) {
        output.push(token);
      } else if (token === '(') {
        stack.push(token);
      } else if (token === ')') {
        while (stack.length && stack[stack.length - 1] !== '(') {
          output.push(stack.pop()!);
        }
        if (stack.length === 0 || stack.pop() !== '(') {
          // Missing Opening Parentheses
          this._errorMessage = ErrorMessages.missingParentheses;
          this._errorOccured = true;
          break;
        }
      } else if (this.operators.has(token)) {
        while (
          stack.length 
          && stack[stack.length - 1] !== '('
          && this.precedence[token] <= this.precedence[stack[stack.length - 1]]  
        ) {
          output.push(stack.pop()!);
        }
        stack.push(token);
      } else {
        // Invalid Number or Operator
        this._errorMessage = ErrorMessages.invalidOperator;
        this._errorOccured = true;
        break;
      }
    }

    while (stack.length) {
      // Invalid formula 
      if (stack[stack.length - 1] === '(') {
        this._errorMessage = ErrorMessages.invalidFormula;
        this._errorOccured = true;
        break;
      }
      output.push(stack.pop()!);
    }
    return output;
  }

  /**
   * 
   * @param postfix a list of ordered tokens
   * It evaluates the postfix tokens to a number if the list of tokens is valid
   * 
   */
  evaluatePostfix(postfix: string[]) {
    const stack: number[] = [];

    for (const token of postfix) {
      if (this.isNumber(token)) {
        stack.push(parseFloat(token));
      } else if (this.isCellReference(token)) {
        let prevValue = this.getCellValue(token)[0];
        let prevError = this.getCellValue(token)[1];
        if (prevError === "") {
          stack.push(prevValue);
        } else {
          // In the case of a bad reference cell, set invalidCell error
          this._errorMessage = ErrorMessages.invalidCell;
          this._errorOccured = true;
          break;
        }
      } else if (this.operators.has(token) && stack.length >= 2) {
        const b = stack.pop();
        const a = stack.pop();
        if (typeof(a) !== 'number' || typeof(b) !== 'number') {
          this._errorMessage = ErrorMessages.invalidFormula;
          this._errorOccured = true;
          break;
        } else {
          // Calculate based on the operator type
          if (token === '+') {
            stack.push(a + b);
          } else if (token === '-') {
            stack.push(a - b);
          } else if (token === '*') {
            stack.push(a * b);
          } else if (token === '/') {
            if (b === 0) {
              // Divide by zero
              this._result = Infinity;
              this._errorMessage = ErrorMessages.divideByZero;
              this._errorOccured = true;
              break;
            }
            stack.push(a / b);
          }
        }
      } else if (this.operators.has(token) && stack.length < 2) {
        // Invalid Formula as ['4', '+']
        this._errorMessage = ErrorMessages.invalidFormula;
        this._errorOccured = true;
        break;
      }
    }
    // Must maintain the partial result
    if (stack.length > 0) {
      this._result = stack[0];
    }
  }

  public get error(): string {
    return this._errorMessage
  }

  public get result(): number {
    return this._result;
  }




  /**
   * 
   * @param token 
   * @returns true if the toke can be parsed to a number
   */
  isNumber(token: TokenType): boolean {
    return !isNaN(Number(token));
  }

  /**
   * 
   * @param token
   * @returns true if the token is a cell reference
   * 
   */
  isCellReference(token: TokenType): boolean {

    return Cell.isValidCellLabel(token);
  }

  /**
   * 
   * @param token
   * @returns [value, ""] if the cell formula is not empty and has no error
   * @returns [0, error] if the cell has an error
   * @returns [0, ErrorMessages.invalidCell] if the cell formula is empty
   * 
   */
  getCellValue(token: TokenType): [number, string] {

    let cell = this._sheetMemory.getCellByLabel(token);
    let formula = cell.getFormula();
    let error = cell.getError();

    // if the cell has an error return 0
    if (error !== "" && error !== ErrorMessages.emptyFormula) {
      return [0, error];
    }

    // if the cell formula is empty return 0
    if (formula.length === 0) {
      return [0, ErrorMessages.invalidCell];
    }


    let value = cell.getValue();
    return [value, ""];

  }


}

export default FormulaEvaluator;