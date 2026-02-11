# Commit Conventions for Takathon

## Overview

This project follows the **Conventional Commits** specification to ensure clear, structured, and automatable commit history.

## Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Required Components

#### `<type>` (REQUIRED)
The type of change being made:

- **feat**: A new feature for the user
- **fix**: A bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, missing semicolons, etc.)
- **refactor**: Code change that neither fixes a bug nor adds a feature
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Changes to build process, dependencies, or tooling
- **ci**: Changes to CI/CD configuration
- **revert**: Reverting a previous commit

#### `<scope>` (OPTIONAL)
The area of the codebase affected:

- **apps**: `student-portal`, `organizer-dashboard`, `sponsor-panel`, `core-gateway`, `ai-engine`
- **libs**: `ui`, `types`, `utils`, `ai-logic`
- **infra**: `docker`, `nx`, `ci`, `deployment`
- **db**: Database migrations or schema changes

#### `<subject>` (REQUIRED)
A brief description:
- Use imperative mood ("add" not "added" or "adds")
- No capitalization of first letter
- No period at the end
- Maximum 50 characters

#### `<body>` (OPTIONAL)
Detailed explanation:
- Explain *what* and *why*, not *how*
- Wrap at 72 characters
- Separate from subject with blank line

#### `<footer>` (OPTIONAL)
- **Breaking changes**: `BREAKING CHANGE: description`
- **Issue references**: `Closes #123`, `Fixes #456`
- **Reviewers**: `Reviewed-by: @username`

## Examples

### Basic Feature
```
feat(student-portal): add team invitation flow

Implement the UI for students to invite team members with
email validation and real-time status updates.

Closes #42
```

### Bug Fix
```
fix(ai-engine): resolve matching score calculation error

The scoring algorithm was incorrectly weighting skill proficiency.
Updated the formula to use normalized values.

Fixes #87
```

### Documentation
```
docs(readme): update installation instructions

Add missing steps for Docker setup and environment variables.
```

### Refactoring
```
refactor(core-gateway): extract auth middleware to separate module

Improve code organization by moving JWT validation logic
to a dedicated middleware file.
```

### Breaking Change
```
feat(types): update Team interface with new required fields

BREAKING CHANGE: Team interface now requires `maxSize` and `isPublic` fields.
All consumers must update their implementations.

Related to #112
```

### Multiple Scopes
```
fix(student-portal,organizer-dashboard): correct date formatting

Standardize date display across both frontends using ISO 8601 format.
```

### Chore
```
chore(deps): upgrade Next.js to v14.1.0

Update Next.js and related dependencies to latest stable version.
```

### Performance
```
perf(ai-engine): optimize matching algorithm query

Replace nested loops with hash map lookup, reducing time complexity
from O(n²) to O(n). Performance improvement: ~60% faster on 1000+ users.

Closes #203
```

### Revert
```
revert: feat(sponsor-panel): add advanced filtering

This reverts commit a1b2c3d4e5f6.
Reason: Feature causing performance regression in production.
```

## Rules and Guidelines

### ✅ DO
- Keep commits atomic (one logical change per commit)
- Write in present tense ("add feature" not "added feature")
- Reference issues when applicable
- Use lowercase for type and scope
- Be specific in the subject line
- Explain *why* in the body, not *what* (code shows what)

### ❌ DON'T
- Mix multiple unrelated changes in one commit
- Use vague messages like "fix stuff" or "update code"
- Exceed character limits (50 for subject, 72 for body)
- Include file names in subject (use scope instead)
- Commit commented-out code or console.logs
- Use past tense or continuous tense

## Commit Types in Detail

### `feat` - New Features
User-facing functionality:
```
feat(student-portal): add skills autocomplete
feat(ai-engine): implement team compatibility scoring
feat(shared/ui): create dropdown component
```

### `fix` - Bug Fixes
Resolving issues:
```
fix(core-gateway): prevent duplicate team invitations
fix(organizer-dashboard): correct participant count display
fix(types): export missing HackathonStatus enum
```

### `docs` - Documentation
README, comments, wikis:
```
docs(api): add endpoint documentation for teams
docs(contributing): update PR workflow guidelines
docs(ai-logic): add docstrings to matching functions
```

### `style` - Code Style
No logic changes:
```
style(student-portal): format with Prettier
style(core-gateway): fix ESLint warnings
style(shared/types): organize imports alphabetically
```

### `refactor` - Restructuring
No bug fixes or features:
```
refactor(ai-engine): migrate to async/await pattern
refactor(shared/utils): split validators into separate files
refactor(core-gateway): rename ambiguous variable names
```

### `test` - Testing
Adding or updating tests:
```
test(ai-engine): add unit tests for scoring algorithm
test(student-portal): add E2E test for team creation
test(shared/utils): increase coverage for validators
```

### `chore` - Maintenance
Dependencies, configs, tooling:
```
chore(deps): update all npm packages
chore(nx): adjust project configurations
chore(docker): optimize image layer caching
```

### `ci` - Continuous Integration
GitHub Actions, deployment:
```
ci: add automated testing workflow
ci: configure staging deployment pipeline
ci: enable caching for faster builds
```

## Automation & Tooling

### Pre-commit Hook
Validate commit messages before allowing commit:
```bash
# .git/hooks/commit-msg
npx commitlint --edit $1
```

### Configuration (`commitlint.config.js`)
```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'chore', 'ci', 'revert']
    ],
    'scope-enum': [
      2,
      'always',
      [
        'student-portal', 'organizer-dashboard', 'sponsor-panel',
        'core-gateway', 'ai-engine',
        'ui', 'types', 'utils', 'ai-logic',
        'docker', 'nx', 'ci', 'db', 'deps'
      ]
    ],
    'subject-case': [2, 'always', 'lower-case'],
    'subject-max-length': [2, 'always', 50],
    'body-max-line-length': [2, 'always', 72]
  }
};
```

### Changelog Generation
Use conventional commits to auto-generate CHANGELOG.md:
```bash
npx standard-version
```

### Semantic Release
Automatically determine version bumps:
- `feat` → Minor version bump (1.X.0)
- `fix` → Patch version bump (1.0.X)
- `BREAKING CHANGE` → Major version bump (X.0.0)

## Examples by Scenario

### Adding a New Component
```
feat(shared/ui): create TeamCard component

Add reusable card component for displaying team information
with members, skills, and status indicators.
```

### Fixing a Critical Bug
```
fix(core-gateway): prevent auth token expiration race condition

Add mutex lock to token refresh logic to prevent concurrent
refresh requests from invalidating each other.

Fixes #456
Priority: High
```

### Database Migration
```
feat(db): add team_preferences table

Create new table for storing team formation preferences
including communication style and time zone.

Migration: 20260211_add_team_preferences.sql
```

### Dependency Update
```
chore(deps): upgrade FastAPI to v0.109.0

Update FastAPI and related dependencies to latest stable version.
No breaking changes affecting current implementation.
```

### Code Review Feedback
```
refactor(ai-engine): address PR review comments

- Extract magic numbers to constants
- Add error handling for edge cases
- Improve variable naming clarity

Reviewed-by: @senior-dev
Related to PR #89
```

## Enforcement

### CI Pipeline
All commits must pass commit message linting in CI:
```yaml
# .github/workflows/ci.yml
- name: Validate Commit Messages
  run: npx commitlint --from=origin/main --to=HEAD
```

### PR Title Convention
PR titles should also follow conventional commits format:
```
feat(student-portal): implement hackathon registration flow
```

## Resources

- [Conventional Commits Specification](https://www.conventionalcommits.org/)
- [Angular Commit Guidelines](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#commit)
- [Semantic Versioning](https://semver.org/)
- [Commitlint Documentation](https://commitlint.js.org/)

## Questions?

For clarification on commit conventions, consult the Tech Lead or post in #dev-standards channel.

---

**Last Updated**: February 11, 2026  
**Maintained By**: Takathon Engineering Team
