# Specification

## Summary
**Goal:** Fix the Teacher role redirect issue that causes the application to hang on a redirecting page after authentication and role selection.

**Planned changes:**
- Fix redirect logic in App.tsx to properly navigate Teacher users to /teacher/dashboard after role selection
- Add error handling and timeout logic to RoleSelectionModal.tsx to prevent infinite loading states
- Verify and fix the createProfile mutation cache invalidation to trigger proper authentication state updates

**User-visible outcome:** Teachers can successfully complete authentication, select their role, and be redirected to their dashboard within 2 seconds without getting stuck on a loading screen.
