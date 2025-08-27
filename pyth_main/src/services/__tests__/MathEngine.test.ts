import { MathEngine } from '../MathService';

describe('MathEngine', () => {
  beforeEach(() => {
    MathEngine.clearCache();
  });

  describe('parseExpression', () => {
    it('should parse simple arithmetic expressions', () => {
      const parsed = MathEngine.parseExpression('2 + 3');
      expect(parsed.expression).toBe('2 + 3');
      expect(parsed.variables).toEqual([]);
      expect(typeof parsed.compiled).toBe('function');
    });

    it('should parse expressions with variables', () => {
      const parsed = MathEngine.parseExpression('x^2 + 2*x + 1');
      expect(parsed.expression).toBe('x^2 + 2*x + 1');
      expect(parsed.variables).toEqual(['x']);
      expect(typeof parsed.compiled).toBe('function');
    });

    it('should parse expressions with multiple variables', () => {
      const parsed = MathEngine.parseExpression('x*y + z');
      expect(parsed.expression).toBe('x*y + z');
      expect(parsed.variables).toEqual(['x', 'y', 'z']);
    });

    it('should handle scientific functions', () => {
      const parsed = MathEngine.parseExpression('sin(x) + cos(y)');
      expect(parsed.variables).toEqual(['x', 'y']);
    });

    it('should ignore mathematical constants', () => {
      const parsed = MathEngine.parseExpression('pi * e + x');
      expect(parsed.variables).toEqual(['x']);
    });

    it('should throw error for invalid expressions', () => {
      expect(() => MathEngine.parseExpression('2 +')).toThrow('Invalid expression syntax');
      expect(() => MathEngine.parseExpression('')).toThrow('Invalid expression: input must be a non-empty string');
      expect(() => MathEngine.parseExpression('   ')).toThrow('Invalid expression: input cannot be empty');
    });

    it('should throw error for null or undefined input', () => {
      expect(() => MathEngine.parseExpression(null as any)).toThrow('Invalid expression: input must be a non-empty string');
      expect(() => MathEngine.parseExpression(undefined as any)).toThrow('Invalid expression: input must be a non-empty string');
    });

    it('should cache parsed expressions', () => {
      const expr = 'x^2 + 1';
      const parsed1 = MathEngine.parseExpression(expr);
      const parsed2 = MathEngine.parseExpression(expr);
      expect(parsed1).toBe(parsed2); // Same object reference due to caching
      expect(MathEngine.getCacheSize()).toBe(1);
    });
  });

  describe('evaluateFunction', () => {
    it('should evaluate expressions without variables', () => {
      const parsed = MathEngine.parseExpression('2 + 3 * 4');
      const result = MathEngine.evaluateFunction(parsed);
      expect(result).toBe(14);
    });

    it('should evaluate expressions with single variable', () => {
      const parsed = MathEngine.parseExpression('x^2 + 2*x + 1');
      const result = MathEngine.evaluateFunction(parsed, { x: 3 });
      expect(result).toBe(16); // 9 + 6 + 1
    });

    it('should evaluate expressions with multiple variables', () => {
      const parsed = MathEngine.parseExpression('x*y + z');
      const result = MathEngine.evaluateFunction(parsed, { x: 2, y: 3, z: 4 });
      expect(result).toBe(10); // 2*3 + 4
    });

    it('should evaluate scientific functions', () => {
      const parsed = MathEngine.parseExpression('sin(0) + cos(0)');
      const result = MathEngine.evaluateFunction(parsed);
      expect(result).toBeCloseTo(1, 10); // sin(0) = 0, cos(0) = 1
    });

    it('should handle mathematical constants', () => {
      const parsed = MathEngine.parseExpression('pi');
      const result = MathEngine.evaluateFunction(parsed);
      expect(result).toBeCloseTo(Math.PI, 10);
    });

    it('should throw error for missing variables', () => {
      const parsed = MathEngine.parseExpression('x + y');
      expect(() => MathEngine.evaluateFunction(parsed, { x: 1 })).toThrow('Missing variables: y');
    });

    it('should handle division by zero', () => {
      const parsed = MathEngine.parseExpression('1/x');
      expect(() => MathEngine.evaluateFunction(parsed, { x: 0 })).toThrow('Result is infinite');
    });

    it('should handle invalid operations resulting in NaN', () => {
      const parsed = MathEngine.parseExpression('sqrt(x)');
      expect(() => MathEngine.evaluateFunction(parsed, { x: -1 })).toThrow('Complex numbers not supported');
    });

    it('should handle complex number results', () => {
      const parsed = MathEngine.parseExpression('sqrt(-1)');
      expect(() => MathEngine.evaluateFunction(parsed)).toThrow('Complex numbers not supported');
    });
  });

  describe('evaluate (simple calculator)', () => {
    it('should evaluate basic arithmetic', () => {
      expect(MathEngine.evaluate('2 + 3')).toBe(5);
      expect(MathEngine.evaluate('10 - 4')).toBe(6);
      expect(MathEngine.evaluate('3 * 4')).toBe(12);
      expect(MathEngine.evaluate('15 / 3')).toBe(5);
    });

    it('should handle order of operations', () => {
      expect(MathEngine.evaluate('2 + 3 * 4')).toBe(14);
      expect(MathEngine.evaluate('(2 + 3) * 4')).toBe(20);
    });

    it('should handle scientific functions', () => {
      expect(MathEngine.evaluate('sin(0)')).toBeCloseTo(0, 10);
      expect(MathEngine.evaluate('cos(0)')).toBeCloseTo(1, 10);
      expect(MathEngine.evaluate('sqrt(16)')).toBe(4);
    });

    it('should handle mathematical constants', () => {
      const piResult = MathEngine.evaluate('pi');
      expect(typeof piResult).toBe('number');
      expect(piResult as number).toBeCloseTo(Math.PI, 10);
    });

    it('should handle powers and exponents', () => {
      expect(MathEngine.evaluate('2^3')).toBe(8);
      expect(MathEngine.evaluate('2^0.5')).toBeCloseTo(Math.sqrt(2), 10);
    });

    it('should return error messages for invalid expressions', () => {
      expect(MathEngine.evaluate('')).toBe('Error: Empty expression');
      expect(MathEngine.evaluate('   ')).toBe('Error: Empty expression');
      expect(MathEngine.evaluate('2 +')).toMatch(/^Error:/);
      expect(MathEngine.evaluate('invalid')).toMatch(/^Error:/);
    });

    it('should handle division by zero', () => {
      expect(MathEngine.evaluate('1/0')).toBe('Error: Infinity');
      expect(MathEngine.evaluate('0/0')).toBe('Error: Invalid operation');
    });

    it('should handle factorial', () => {
      expect(MathEngine.evaluate('5!')).toBe(120);
      expect(MathEngine.evaluate('0!')).toBe(1);
    });

    it('should handle logarithms', () => {
      expect(MathEngine.evaluate('log10(10)')).toBeCloseTo(1, 10);
      expect(MathEngine.evaluate('log(e)')).toBeCloseTo(1, 10);
    });

    it('should handle null and undefined inputs', () => {
      expect(MathEngine.evaluate(null as any)).toBe('Error: Empty expression');
      expect(MathEngine.evaluate(undefined as any)).toBe('Error: Empty expression');
    });
  });

  describe('edge cases and error handling', () => {
    it('should handle very large numbers', () => {
      const result = MathEngine.evaluate('10^100');
      expect(typeof result).toBe('number');
      expect(isFinite(result as number)).toBe(true);
    });

    it('should handle very small numbers', () => {
      const result = MathEngine.evaluate('10^(-100)');
      expect(typeof result).toBe('number');
      expect(result as number).toBeGreaterThan(0);
    });

    it('should handle nested parentheses', () => {
      expect(MathEngine.evaluate('((2 + 3) * (4 + 5))')).toBe(45);
    });

    it('should handle multiple decimal points correctly', () => {
      expect(MathEngine.evaluate('1.5 + 2.7')).toBeCloseTo(4.2, 10);
    });

    it('should handle negative numbers', () => {
      expect(MathEngine.evaluate('-5 + 3')).toBe(-2);
      expect(MathEngine.evaluate('(-5) * 3')).toBe(-15);
    });
  });

  describe('cache management', () => {
    it('should clear cache', () => {
      MathEngine.parseExpression('x + 1');
      MathEngine.parseExpression('y + 2');
      expect(MathEngine.getCacheSize()).toBe(2);
      
      MathEngine.clearCache();
      expect(MathEngine.getCacheSize()).toBe(0);
    });

    it('should return cache size', () => {
      expect(MathEngine.getCacheSize()).toBe(0);
      MathEngine.parseExpression('x + 1');
      expect(MathEngine.getCacheSize()).toBe(1);
    });
  });
});