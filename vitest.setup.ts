// Basic setup for Vitest environment
if (!(globalThis as any).crypto) {
  ;(globalThis as any).crypto = { randomUUID: () => 'test-uuid' }
} else if (!(globalThis as any).crypto.randomUUID) {
  ;(globalThis as any).crypto.randomUUID = () => 'test-uuid'
}

// Provide a lightweight `jest` alias for tests that use `jest.fn()`
if (!(globalThis as any).jest && (globalThis as any).vi) {
  ;(globalThis as any).jest = (globalThis as any).vi
}
