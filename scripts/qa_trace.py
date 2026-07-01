"""QA scoring history trace for aiqigu_landing_v1.jpg"""
import os, json

print('=== QA SCORING HISTORY TRACE ===')
print()

# 1. Check all .md reports for QA records
reports_dir = 'docs/production'
qa_keywords = ['QA', 'qa_scoring', '评分', 'score', 'quality']
print('[REPORTS CONTAINING QA CONTENT]')
for f in sorted(os.listdir(reports_dir)):
    if f.endswith('.md'):
        fp = os.path.join(reports_dir, f)
        with open(fp, 'r', encoding='utf-8') as fh:
            content = fh.read()
        for kw in qa_keywords:
            if kw.lower() in content.lower():
                print(f'  {f}: contains "{kw}"')
                break

# 2. Check generation scripts - do they invoke QA?
print()
print('[GENERATION SCRIPTS QA INVOCATION]')
gen_scripts = ['scripts/generate_landing_v1.py', 'scripts/generate_landing_v1_v2.py', 'scripts/landing_v1_real_generation.py']
for gs in gen_scripts:
    if os.path.exists(gs):
        with open(gs, 'r', encoding='utf-8') as fh:
            content = fh.read()
        has_qa = any(kw in content.lower() for kw in ['qa', 'score', 'quality', 'validate', 'eval'])
        print(f'  {gs}: QA/score/quality/validate references = {has_qa}')

# 3. Pipeline step completion trace
print()
print('[PIPELINE STEP COMPLETION]')
steps = [
    ('STEP 0-1: STRUCTURE DESIGN + APPROVAL', True),
    ('STEP 2: FULL PAGE VISUAL GENERATION', True), 
    ('STEP 3: VISUAL QA (scoring the generated image)', False),
    ('STEP 4: FINAL HUMAN APPROVAL (after generation)', False),
    ('STEP 5+: DECOMPOSITION / PRODUCTION / RECONSTRUCTION', False),
]
for name, done in steps:
    print(f'  [{"DONE" if done else "SKIPPED"}] {name}')

# 4. Check generation_spec approval
print()
spec_path = 'assets/visual-pipeline/landing_v1/landing_v1_generation_spec.json'
if os.path.exists(spec_path):
    with open(spec_path, 'r', encoding='utf-8') as fh:
        spec = json.load(fh)
    approval = spec.get('approval', {})
    print(f'[GENERATION SPEC APPROVAL STATUS]')
    print(f'  Approval recorded at step: {approval.get("step")}')
    print(f'  Status: {approval.get("status")}')
    print(f'  Date: {approval.get("date")}')
    print(f'  Gate message: {approval.get("gate")}')
    print(f'  NOTE: Approval was embedded in spec BEFORE image was generated.')

# 5. Verify the spec's QA section
print()
print('[SPEC QA/GENERATION FLOW ANALYSIS]')
print(f'  The pipeline V3 defines STEP 3 (VISUAL QA) as:')
print(f'    - Evaluating style consistency, clarity, UI fit, completeness')
print(f'    - Score must >= threshold')
print(f'    - Regeneration loop max 3 times')
print(f'')
print(f'  What actually happened:')
print(f'    1. QA was run EARLIER during PIPELINE BOOTSTRAP (approved STRUCTURE_SPEC at 1.00)')
print(f'    2. Generation spec was PRE-APPROVED (STEP 4 before STEP 2)')
print(f'    3. Image was generated via Seedream Ark (HTTP 200, 226KB)')
print(f'    4. NO QA was run on the actual generated image')
print(f'    5. No human review of the actual image output')
print(f'')
print(f'  THE GENERATED IMAGE NEVER PASSED QA SCORING.')

print()
print('=== END OF TRACE ===')
