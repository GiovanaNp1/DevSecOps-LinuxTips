    // my-module.test.js
    const assert = require('assert');

    describe('My Module', () => {
      beforeEach(() => {
        console.log('--- Running a new test ---');
      });

      it('should add two numbers correctly', () => {
        const result = 2 + 3;
        console.log('Result of addition:', result); // Echoing a value
        assert.strictEqual(result, 5);
      });

      it('should handle negative numbers', () => {
        const result = -5 + 10;
        console.log('Intermediate value:', result);
        assert.strictEqual(result, 5);
      });
    });