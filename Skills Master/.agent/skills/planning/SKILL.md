---
name: phased-planning
description: Manages the structured development of features through clear implementation plans and verification checklists. Use when transitioning from ideation to technical execution.
---

# Phased Planning

Transform high-level ideas into structured, executable technical plans.

## When to use this skill
- Transitioning from brainstorming to implementation
- Planning major refactors or new components
- Defining verification steps for complex changes
- Communicating high-level technical decisions to stakeholders

## Workflow

1.  **Define Goal**: Briefly describe the problem and what the changes will accomplish.
2.  **Architectural Context**: Identify how these changes fit into the existing system (e.g., "Extends the User module," "Uses exist Supabase client").
3.  **Identify Risks & Rollback**: Document potential breaking changes and how to reverse them if verification fails.
4.  **Map Proposed Changes**: Group changes by component (e.g., package, feature area, layer).
5.  **Define Verification**: Outline automated and manual steps to prove the implementation works.
6.  **Review & Iterate**: Get approval before starting the heavy lifting.

## Implementation Plan Structure

### Goal Description
Keep it brief. Focus on background and intent.

### User Review Required
> [!IMPORTANT]
> Detail any breaking changes, security implications, or critical design decisions here.

### Proposed Changes
Group by files/components:
- **[MODIFY] [file basename]**: Brief summary of changes.
- **[NEW] [file basename]**: Purpose of the new module.
- **[DELETE] [file basename]**: Why it's no longer needed.

### Verification Plan
- **Automated**: Specific commands, test suites, or CI steps.
- **Manual**: UI walkthroughs, edge-case testing, or user-facing validation.

## Best Practices
- **Order Logically**: List dependencies first in your proposed changes.
- **Be Specific**: Use absolute paths in your links.
- **Keep it Living**: Update the plan if you discover new complexity during the task.

## Resources
- [Implementation Plan Template](resources/plan_template.md)
- [Verification Checklist](resources/verification_checklist.md)
