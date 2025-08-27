import { evaluate, parse, compile, MathNode } from 'mathjs';
import { ParsedFunction } from '../types';

export class MathEngine {
  private static cache = new Map<string, ParsedFunction>();

  /**
   * Parse a mathematical expression and return a compiled function
   */
  static parseExpression(input: string): ParsedFunction {
    if (!input || typeof input !== 'string') {
      throw new Error('Invalid expression: input must be a non-empty string');
    }

    const trimmedInput = input.trim();
    if (trimmedInput.length === 0) {
      throw new Error('Invalid expression: input cannot be empty');
    }

    // Check cache first
    if (this.cache.has(trimmedInput)) {
      return this.cache.get(trimmedInput)!;
    }

    try {
      // Parse the expression to get the AST
      const node: MathNode = parse(trimmedInput);
      
      // Extract variables from the expression
      const variables = this.extractVariables(node);
      
      // Compile the expression for faster evaluation
      const compiled = compile(trimmedInput);
      
      const parsedFunction: ParsedFunction = {
        expression: trimmedInput,
        variables,
        compiled: compiled.evaluate
      };

      // Cache the result
      this.cache.set(trimmedInput, parsedFunction);
      
      return parsedFunction;
    } catch (error) {
      throw new Error(`Invalid expression syntax: ${(error as Error).message}`);
    }
  }

  /**
   * Evaluate a parsed function with given variable values
   */
  static evaluateFunction(func: ParsedFunction, variables: Record<string, number> = {}): number {
    try {
      // If no variables are needed, evaluate directly
      if (func.variables.length === 0) {
        const result = func.compiled({});
        return this.validateResult(result);
      }

      // Check if all required variables are provided
      const missingVars = func.variables.filter(v => !(v in variables));
      if (missingVars.length > 0) {
        throw new Error(`Missing variables: ${missingVars.join(', ')}`);
      }

      const result = func.compiled(variables);
      return this.validateResult(result);
    } catch (error) {
      if (error instanceof Error && error.message.includes('Missing variables')) {
        throw error;
      }
      throw new Error(`Evaluation error: ${(error as Error).message}`);
    }
  }

  /**
   * Simple evaluation for basic calculator operations
   */
  static evaluate(expression: string): number | string {
    try {
      if (!expression || typeof expression !== 'string' || expression.trim().length === 0) {
        return 'Error: Empty expression';
      }

      const result = evaluate(expression.trim());
      
      if (typeof result === 'number') {
        if (!isFinite(result)) {
          return isNaN(result) ? 'Error: Invalid operation' : 'Error: Infinity';
        }
        return result;
      }
      
      return result.toString();
    } catch (error) {
      return `Error: ${(error as Error).message}`;
    }
  }

  /**
   * Extract variable names from a parsed expression
   */
  private static extractVariables(node: MathNode): string[] {
    const variables = new Set<string>();
    
    node.traverse((node: MathNode) => {
      if (node.type === 'SymbolNode' && !this.isConstant(node.name)) {
        variables.add(node.name);
      }
    });
    
    return Array.from(variables).sort();
  }

  /**
   * Check if a symbol is a mathematical constant or function
   */
  private static isConstant(name: string): boolean {
    const constants = new Set(['pi', 'e', 'i', 'PI', 'E', 'true', 'false', 'null', 'undefined']);
    const functions = new Set([
      'sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'atan2',
      'sinh', 'cosh', 'tanh', 'asinh', 'acosh', 'atanh',
      'log', 'log10', 'log2', 'ln', 'exp', 'sqrt', 'cbrt',
      'abs', 'sign', 'ceil', 'floor', 'round', 'fix',
      'min', 'max', 'sum', 'mean', 'median', 'mode', 'std', 'var',
      'factorial', 'gamma', 'combinations', 'permutations',
      'gcd', 'lcm', 'mod', 'pow', 'random', 'randomInt'
    ]);
    return constants.has(name) || functions.has(name);
  }

  /**
   * Validate and sanitize numerical results
   */
  private static validateResult(result: any): number {
    if (typeof result === 'number') {
      if (isNaN(result)) {
        throw new Error('Result is not a number (NaN)');
      }
      if (!isFinite(result)) {
        throw new Error('Result is infinite');
      }
      return result;
    }
    
    if (typeof result === 'object' && result !== null && typeof result.re === 'number') {
      // Handle complex numbers - return real part for now
      if (Math.abs(result.im || 0) < 1e-10) {
        return this.validateResult(result.re);
      }
      throw new Error('Complex numbers not supported in this context');
    }
    
    throw new Error(`Invalid result type: ${typeof result}`);
  }

  /**
   * Clear the expression cache
   */
  static clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get cache size for debugging
   */
  static getCacheSize(): number {
    return this.cache.size;
  }
}