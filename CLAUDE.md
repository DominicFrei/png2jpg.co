# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Key Commands

### Testing

- `npm test` - Run all tests

### Code Quality

- `npm run format` - Auto-format code with Prettier
- `npm run lint` - Check code formatting with Prettier and run ESLint
- `npm run check` - Run svelte-check for TypeScript validation

## Development Notes

Whenever you finish a task, please run all code quality checks: format, lint, check, test.
If any of those contains warnings, errors or failures - even if from unchanged files - please fix them.
If unclear what to fix (code or test), please ask me. Don't guess. Think hard.

### Test Requirements

- **No skipped tests allowed** - All tests must run and pass
- If you encounter skipped tests (`.skip()` or similar), you must either:
  1. Fix them to run properly, or
  2. Inform me about the skipped tests and ask for guidance
- Skipped tests indicate incomplete test coverage and must be addressed
