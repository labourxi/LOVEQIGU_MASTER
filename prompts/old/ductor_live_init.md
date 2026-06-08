# Ductor Live Workflow Initialization for LOVEQIGU_MASTER

Objective:
Configure Ductor Agents and run the first live workflow to verify full integration.

Tasks:

1. Register Ductor agents:
   - Codex CLI
   - Cursor CLI
   - LOVEQIGU_MASTER repository as a workflow root

2. Configure agent permissions for repository-local workflows.

3. Verify Ductor onboarding:
   - Ensure Ductor can see all relevant prompts in prompts/
   - Ensure Ductor can execute workflows under D:\LOVEQIGU_MASTER

4. Execute the first live workflow:
   - Trigger: prompts/git_init.md
   - Action: Codex edits and governance updates
   - Validation: Ductor monitors workflow completion

5. Generate full workflow report:
   - Location: D:\LOVEQIGU_MASTER\ductor\logs\ductor_live_report.md
   - Include:
     - Steps executed
     - Success/failure status
     - Modified files
     - Warnings or unresolved items

6. After execution, show:
   - Workflow summary
   - Tracked files changed
   - Git commit summary if applicable

Rules:
- Do not modify Canon files
- Do not modify project logic
- Only configure agents and validate workflow execution