# CLAUDE.md

This file provides guidance to you, Claude Code, for working with this repository.

## Development Process Overview

This document defines the complete workflow for working on this codebase:

1. **Task Phase**: Work on the assigned task
2. **Quality Phase**: Run quality checks until all pass cleanly
3. **Documentation Phase**: Check and update README.md if needed
4. **Completion Phase**: Present changes summary and request commit approval

## Core Commands

### Code Quality & Testing

- `npm run format` - Auto-format code with Prettier
- `npm run lint` - Check code formatting with Prettier and run ESLint
- `npm run check` - Run svelte-check for TypeScript validation
- `npm test` - Run all tests

## Complete Development Workflow

### 1. Task Phase

- Work on your assigned task while keeping me up to date about the progress.
- **Never proceed to quality phase until all todos are completed**

#### Test Development Requirements

**When adding new functionality:**

- **Always add comprehensive tests** for new features, components, utilities, or functions
- **Test both happy path and edge cases** - ensure robust coverage
- **Add tests before or during development** - not as an afterthought

**When modifying existing functionality:**

- **Update corresponding tests** to match new behavior
- **Add new test cases** if the modification introduces new scenarios
- **Ensure existing tests still pass** or update them appropriately

**For bug fixes:**

- **Consider test-first approach**: Add a failing test that reproduces the bug, then fix it
- **Add regression tests** to prevent the bug from reoccurring
- **Verify the fix resolves the issue** without breaking existing functionality

**Test Coverage Expectations:**

- **Maintain or improve existing coverage levels** - never decrease coverage
- **Prioritize testing complex logic** and critical user workflows
- **Include both unit tests and integration/e2e tests** as appropriate

### 2. Quality Phase

**CRITICAL: Run the complete quality sequence:**

```bash
npm run format && npm run lint && npm run check && npm test
```

**Quality Rules:**

1. **Run ALL FOUR commands in sequence** - no shortcuts
2. **If ANY command fails/warns/errors** → fix the issue and **START OVER** from `npm run format`
3. **Only stop when all 4 commands pass cleanly in a single run**
4. **No exceptions** - even warnings from unchanged files must be fixed
5. **If unclear what to fix** → ask me, don't guess

**Before running quality checks, verify:**

- **New/modified code has corresponding tests** - no untested functionality
- **Test coverage hasn't decreased** - maintain or improve coverage levels
- **All test scenarios are covered** - including edge cases and error conditions

#### Test Requirements

- **No skipped tests allowed** - All tests must run and pass
- If you encounter skipped tests (`.skip()` or similar), you must either:
  1. Fix them to run properly, or
  2. Inform me about the skipped tests and ask for guidance
- Skipped tests indicate incomplete test coverage and must be addressed

### 3. Documentation Phase

**Check if changes affect README.md:**

**Update README.md when:**

- **Features added/removed** (new filters, tools, components)
- **Tech stack changes** (dependencies, frameworks, testing tools)
- **Build/deployment changes** (commands, scripts, CI/CD)
- **Browser support changes** (supported versions, compatibility)
- **Performance characteristics change** (new optimizations, capabilities)
- **Test coverage scope changes** (new types of testing, major testing changes)
- **Anything else that is part of the README but not mentioned here**

**README.md sections to verify:**

- **All sections that could be affected by your changes**
- **When unsure, read the full README.md and compare against your modifications**
- **Common areas**: features, installation, commands, tech stack, testing, browser support
- **If you find outdated content in any section, update it**

### 4. Completion Phase

**CRITICAL: Never commit without explicit user approval.**

**Process:**

1. **Analyze all changes**: Run `git status` and `git diff` to understand all modifications (staged and unstaged)
2. **Draft commit message**: Create comprehensive message covering all changes made
3. **Present summary**: Show user what changed and proposed commit message
4. **Request approval**: Ask "Should I commit and push these changes, or continue working?"
5. **Wait for permission**: Only commit when user explicitly approves

**Commit Rules:**

6. **Never commit without explicit user approval**
7. **Always present commit summary and ask permission**
8. **Include README.md changes in same commit when relevant**

## Example Workflows

### Successful Completion Example:

```
✅ All todos completed
✅ New feature has comprehensive tests (unit + integration)
✅ Test coverage maintained at 100% - no decrease
✅ npm run format && npm run lint && npm run check && npm test (all pass)
✅ README.md checked and updated if needed

📋 Changes Summary:
- Modified: src/components/NewFeature.svelte
- Modified: README.md (updated feature list)
- Added: tests/unit/newFeature.test.ts (8 test cases covering happy path + edge cases)
- Modified: tests/e2e/workflow.test.ts (added integration test for new feature)

🎯 Proposed Commit:
"Add new feature component with comprehensive tests

- Implement NewFeature component with full functionality
- Add 8 unit tests covering all scenarios and edge cases
- Add e2e integration test for complete workflow
- Update README.md to reflect new feature
- Maintain 100% test coverage

🤖 Generated with Claude Code"

❓ Should I commit and push these changes, or continue working?
```

### Quality Check Failure Example:

```
❌ npm run test failed (NewFeature.test.ts missing edge case coverage)
🔄 Adding missing test cases for error handling...
🔄 Restarting from npm run format...
✅ npm run format && npm run lint && npm run check && npm test (all pass)
✅ Test coverage back to 100% with comprehensive edge case testing
✅ Now proceeding to completion phase...
```

### Continue Working Example:

```
User response: "Continue working - add more tests first"
💻 Continuing development...
(Process repeats when ready for next completion attempt)
```
