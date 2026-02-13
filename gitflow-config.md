# Gitflow Configuration for Takathon

## Overview

This project follows the **Gitflow** branching strategy to maintain a clean, organized, and scalable development workflow.

## Branch Structure

### Permanent Branches

#### `main`
- **Purpose**: Production-ready code
- **Protection**: Protected, no direct commits
- **Merges from**: `release/*` and `hotfix/*` only
- **Deployment**: Auto-deploys to production
- **Tags**: All production releases are tagged (e.g., `v1.0.0`)

#### `develop`
- **Purpose**: Integration branch for features
- **Protection**: Protected, no direct commits (except emergencies)
- **Merges from**: `feature/*`, `release/*`, `hotfix/*`
- **Deployment**: Auto-deploys to staging environment
- **Default branch**: For new feature branches

### Temporary Branches

#### `feature/*`
- **Purpose**: New features and enhancements
- **Naming**: `feature/short-description` (e.g., `feature/ai-matching-algorithm`)
- **Branched from**: `develop`
- **Merged into**: `develop`
- **Lifecycle**: Deleted after merge
- **Example**:
  ```bash
  git checkout develop
  git pull origin develop
  git checkout -b feature/team-invitations
  # ... work on feature ...
  git push origin feature/team-invitations
  # Create PR to develop
  ```

#### `release/*`
- **Purpose**: Prepare for production release
- **Naming**: `release/vX.Y.Z` (e.g., `release/v1.2.0`)
- **Branched from**: `develop`
- **Merged into**: `main` AND `develop`
- **Activities**: Bug fixes, version bumps, documentation updates (NO new features)
- **Lifecycle**: Deleted after merge
- **Example**:
  ```bash
  git checkout develop
  git checkout -b release/v1.0.0
  # ... final testing and bug fixes ...
  git checkout main
  git merge release/v1.0.0
  git tag v1.0.0
  git checkout develop
  git merge release/v1.0.0
  ```

#### `hotfix/*`
- **Purpose**: Critical production bug fixes
- **Naming**: `hotfix/short-description` (e.g., `hotfix/auth-token-expiry`)
- **Branched from**: `main`
- **Merged into**: `main` AND `develop`
- **Urgency**: For production-breaking issues only
- **Lifecycle**: Deleted after merge
- **Example**:
  ```bash
  git checkout main
  git checkout -b hotfix/critical-security-patch
  # ... fix the issue ...
  git checkout main
  git merge hotfix/critical-security-patch
  git tag v1.0.1
  git checkout develop
  git merge hotfix/critical-security-patch
  ```

## Workflow Steps

### Starting a New Feature
1. Ensure `develop` is up to date: `git pull origin develop`
2. Create feature branch: `git checkout -b feature/my-feature`
3. Work on feature with regular commits (see COMMIT_CONVENTIONS.md)
4. Push to remote: `git push origin feature/my-feature`
5. Create Pull Request to `develop`
6. Code review and approval
7. Merge to `develop` (squash or merge commit based on team preference)
8. Delete feature branch

### Creating a Release
1. Branch from `develop`: `git checkout -b release/vX.Y.Z`
2. Update version numbers in `package.json`, `pyproject.toml`, etc.
3. Run final tests and fix bugs
4. Update CHANGELOG.md
5. Create PR to `main`
6. After approval, merge to `main`
7. Tag the release: `git tag vX.Y.Z`
8. Merge back to `develop` to sync any release fixes
9. Delete release branch

### Hotfix Process
1. Branch from `main`: `git checkout -b hotfix/issue-description`
2. Fix the critical issue
3. Update version (patch increment)
4. Create PR to `main`
5. After approval, merge to `main`
6. Tag the hotfix: `git tag vX.Y.Z`
7. Merge to `develop` to sync the fix
8. Delete hotfix branch

## Pull Request Guidelines

### Required Checks
- All CI tests pass
- Code review approval from at least 1 team member
- No merge conflicts
- Branch up to date with target

### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Feature
- [ ] Bug fix
- [ ] Documentation
- [ ] Refactor

## Testing
Describe testing performed

## Checklist
- [ ] Follows code style guidelines
- [ ] Self-reviewed code
- [ ] Added tests
- [ ] Updated documentation
```

## Versioning Strategy

We follow **Semantic Versioning** (SemVer):
- **MAJOR** (X.0.0): Breaking changes
- **MINOR** (1.Y.0): New features, backwards-compatible
- **PATCH** (1.0.Z): Bug fixes, backwards-compatible

## Branch Protection Rules

### `main`
- Require PR before merging
- Require status checks to pass
- Require branches to be up to date
- Require review from code owners
- No direct pushes

### `develop`
- Require PR before merging
- Require status checks to pass
- Require 1 approval
- Allow force pushes (with caution)

## Best Practices

1. **Keep branches short-lived**: Merge features within 2-3 days when possible
2. **Sync frequently**: Pull from `develop` daily to reduce conflicts
3. **Clear naming**: Use descriptive branch names with prefix
4. **Small PRs**: Keep pull requests focused and reviewable
5. **Test locally**: Run tests before pushing
6. **Clean history**: Use meaningful commits (see COMMIT_CONVENTIONS.md)
7. **Delete merged branches**: Keep repository clean

## Emergency Bypass

In extreme emergencies (production down), a senior developer may:
1. Create hotfix branch from `main`
2. Fix and merge directly (with notification to team)
3. Tag immediately
4. Backport to `develop` ASAP
5. Document in incident log

**Note**: This should be rare and documented.

## Tools & Automation

- **Git hooks**: Pre-commit for linting, pre-push for tests
- **CI/CD**: GitHub Actions for automated testing and deployment
- **Branch cleanup**: Automated deletion of merged branches
- **Version bumping**: Automated via git tags and release scripts

## Contact

For questions about Gitflow usage, contact the Tech Lead or consult the team wiki.
