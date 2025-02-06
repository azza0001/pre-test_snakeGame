// src/utils/mathOperations.js

export function add(a, b) {
    return a + b;
}

export function subtract(a, b) {
    return a - b;
}

export function multiply(a, b) {
    return a * b;
}

export function divide(a, b) {
    if (b === 0) {
        throw new Error("Cannot divide by zero");
    }
    return a / b;
}

export function evaluateExpression(expression) {
    try {
        return Function('"use strict";return (' + expression + ')')();
    } catch (error) {
        throw new Error("Invalid expression");
    }
}