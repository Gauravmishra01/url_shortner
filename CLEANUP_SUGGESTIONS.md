This file lists suggested cleanup actions for the repository. Review each item before deleting — I did not remove anything automatically.

Suggested items to review

- `push_to_github.ps1` — convenience script; remove if you don't use PowerShell automation for publishing.
- `BACKEND/test-mongo.js` — ad-hoc script for testing MongoDB connectivity; safe to delete if you have a proper test harness.
- `PRODUCTION_READINESS_CHECKLIST.md` and `BUG_FIX_REPORT.md` — keep for records; consider moving to `docs/` if you prefer a cleaner root.
- Any temporary or experimental files in `BACKEND/` or `FRONTEND/` that are not imported or referenced by code (for example one-off scripts). I recommend searching the codebase for references before deleting.

How I recommend proceeding

1. Review the list above and confirm which files you want removed.
2. I can remove the confirmed files and open a Git commit for you.
3. Optionally, I can move historical documents into a `docs/` folder instead of deleting them.

If you want, tell me which items to delete and I'll remove them and commit the changes.
