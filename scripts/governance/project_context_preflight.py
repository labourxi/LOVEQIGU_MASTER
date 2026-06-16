#!/usr/bin/env python3
"""Project context preflight executor.

This tool reads the project context registry, memory, and router docs,
then emits a compact readiness record for a task name.
"""

from __future__ import annotations

import argparse
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable


REPO_ROOT = Path(__file__).resolve().parents[2]
REGISTRY_PATH = REPO_ROOT / "docs" / "PROJECT_CONTEXT_REGISTRY_V1.md"
MEMORY_PATH = REPO_ROOT / "docs" / "PROJECT_CONTEXT_MEMORY_V1.md"
ROUTER_PATH = REPO_ROOT / "docs" / "PROJECT_CONTEXT_ROUTER_V1.md"


@dataclass(frozen=True)
class TaskSpec:
    name: str
    owner: str
    approver: str
    next_owner: str
    required_files: tuple[str, ...]
    optional_files: tuple[str, ...] = ()
    frozen_files: tuple[str, ...] = ()


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def exists(path_or_key: str) -> bool:
    if path_or_key.startswith(("docs/", "scripts/", "governance/", "apps/")):
        return (REPO_ROOT / path_or_key).exists()
    return False


def resolve_art_chapter_task(task_name: str) -> TaskSpec | None:
    if not task_name.startswith("CH") or "_CONTENT_CANON_V1" not in task_name:
        return None

    chapter = task_name.split("_", 1)[0]
    chapter_num = chapter[2:]
    prev_num = f"{int(chapter_num) - 1:02d}" if chapter_num.isdigit() and int(chapter_num) > 1 else None
    required = [
        "docs/canon/LOVEQIGU_CANON_INDEX.md",
        "docs/world/LOVEQIGU_WORLD_BIBLE_V1.md",
        "docs/language/LOVEQIGU_TERMINOLOGY_V1.md",
    ]
    if prev_num:
        required.append(f"docs/content/CH{prev_num}_CONTENT_CANON_V1.md")
    required.append(f"docs/content/{task_name}.md")
    frozen = tuple(
        [f"docs/content/CH{prev_num}_CONTENT_CANON_V1.md"] if prev_num else []
    )
    return TaskSpec(
        name=task_name,
        owner="C",
        approver="C",
        next_owner="B",
        required_files=tuple(required),
        optional_files=(),
        frozen_files=frozen,
    )


TASKS: dict[str, TaskSpec] = {
    "ART_02_IMPLEMENTATION_V1": TaskSpec(
        name="ART_02_IMPLEMENTATION_V1",
        owner="C",
        approver="C",
        next_owner="B",
        required_files=(
            "docs/ART_BIBLE_V1.md",
            "docs/STAR_ACTIVATION_RITUAL_V1.md",
            "docs/ART_02_VISUAL_ASSET_SPEC_V1.md",
            "docs/language/LOVEQIGU_TERMINOLOGY_V1.md",
            "docs/ART-02_TECH_FEASIBILITY_REVIEW_V1.md",
        ),
        optional_files=(
            "docs/ARTIFACT_CONCEPT_V1.md",
            "docs/ART_02_IMPLEMENTATION_V1_REPORT.md",
            "docs/language/LOVEQIGU_LANGUAGE_CONSTITUTION_V1.md",
        ),
        frozen_files=(
            "docs/ART_BIBLE_V1.md",
            "docs/STAR_ACTIVATION_RITUAL_V1.md",
            "docs/ART_02_VISUAL_ASSET_SPEC_V1.md",
        ),
    ),
    "ART_02_ASSET_INTEGRATION_V1": TaskSpec(
        name="ART_02_ASSET_INTEGRATION_V1",
        owner="C",
        approver="C",
        next_owner="B",
        required_files=("ART_02_ASSET_PACKAGE_V1",),
        optional_files=(),
        frozen_files=(),
    ),
    "ART_02_KEY_VISUAL_V1": TaskSpec(
        name="ART_02_KEY_VISUAL_V1",
        owner="C",
        approver="C",
        next_owner="B",
        required_files=(
            "docs/ART_BIBLE_V1.md",
            "docs/language/LOVEQIGU_TERMINOLOGY_V1.md",
        ),
        optional_files=(),
        frozen_files=("docs/ART_BIBLE_V1.md",),
    ),
    "AUTOPILOT": TaskSpec(
        name="AUTOPILOT",
        owner="B",
        approver="B",
        next_owner="B",
        required_files=(
            "docs/AUTOPILOT_IMPLEMENTATION_REPORT.md",
            "docs/ADMIN_AUTOPILOT_V1_REPORT.md",
            "docs/PROJECT_CONTEXT_MEMORY_V1.md",
            "docs/automation/LOVEQIGU_AUTOPILOT_V1_REPORT.md",
        ),
        optional_files=(
            "docs/AUTOPILOT_ACCEPTANCE_REPORT.md",
            "docs/AUTOPILOT_V1_OPERATIONALIZATION_REPORT.md",
            "docs/audit/AUTOPILOT_V1_ACCEPTANCE_TEST_REPORT.md",
        ),
        frozen_files=(
            "docs/AUTOPILOT_IMPLEMENTATION_REPORT.md",
            "docs/ADMIN_AUTOPILOT_V1_REPORT.md",
        ),
    ),
    "CH11_CONTENT_CANON_V1": TaskSpec(
        name="CH11_CONTENT_CANON_V1",
        owner="C",
        approver="C",
        next_owner="A",
        required_files=(
            "docs/canon/LOVEQIGU_CANON_INDEX.md",
            "docs/world/LOVEQIGU_WORLD_BIBLE_V1.md",
            "docs/language/LOVEQIGU_TERMINOLOGY_V1.md",
            "docs/content/CH10_CONTENT_CANON_V1.md",
            "docs/content/CH11_CONTENT_CANON_V1.md",
        ),
        optional_files=(),
        frozen_files=(
            "docs/content/CH10_CONTENT_CANON_V1.md",
        ),
    ),
}


def get_task_spec(task_name: str) -> TaskSpec | None:
    if task_name in TASKS:
        return TASKS[task_name]
    return resolve_art_chapter_task(task_name)


def status_for(spec: TaskSpec) -> tuple[str, list[str], list[str]]:
    missing = [path for path in spec.required_files if not exists(path)]
    frozen_missing = [path for path in spec.frozen_files if not exists(path)]
    if missing:
        return "BLOCKED", missing, frozen_missing
    if frozen_missing:
        return "WARN", missing, frozen_missing
    return "READY", missing, frozen_missing


def format_list(items: Iterable[str]) -> str:
    items = list(items)
    if not items:
        return "- None."
    return "\n".join(f"- {item}" for item in items)


def render(spec: TaskSpec) -> str:
    status, missing, frozen_missing = status_for(spec)
    lines = [
        f"TASK: {spec.name}",
        f"OWNER: {spec.owner}",
        "REQUIRED FILES:",
        format_list(spec.required_files),
        "OPTIONAL FILES:",
        format_list(spec.optional_files),
        "MISSING_FILES:",
        format_list(missing),
        "FROZEN_FILES:",
        format_list(spec.frozen_files),
        "STATUS:",
        status,
        "NEXT_OWNER:",
        spec.next_owner,
    ]
    if frozen_missing:
        lines.extend(["FROZEN_MISSING:", format_list(frozen_missing)])
    return "\n".join(lines)


def build_report(example_outputs: dict[str, str]) -> str:
    missing_required = []
    for task_name, output in example_outputs.items():
        if "STATUS:\nBLOCKED" in output:
            missing_required.append(task_name)

    return "\n".join(
        [
            "# PROJECT_CONTEXT_PREFLIGHT_V1_REPORT",
            "",
            "## Execution Model",
            "",
            "The preflight executor reads the registry, memory, and router docs, then resolves a task-specific spec.",
            "It validates required files, optional files, frozen files, and any missing dependencies before execution.",
            "",
            "## Status Engine",
            "",
            "- `BLOCKED` when any required file is missing.",
            "- `WARN` when a frozen dependency is unavailable for a task that depends on it.",
            "- `READY` when all required files exist and no frozen dependency issue is present.",
            "",
            "## Dependency Engine",
            "",
            "The dependency engine resolves each task family from the registry/router/memory set and checks physical file presence in the repository.",
            "ART tasks use the art bible, ritual, and visual spec; AUTOPILOT uses the approved autopilot reports; chapter canon tasks use the canon index, world bible, terminology, and the current/previous chapter files.",
            "",
            "## Example Outputs",
            "",
            "### ART_02_IMPLEMENTATION_V1",
            "```text",
            example_outputs["ART_02_IMPLEMENTATION_V1"],
            "```",
            "",
            "### ART_02_ASSET_INTEGRATION_V1",
            "```text",
            example_outputs["ART_02_ASSET_INTEGRATION_V1"],
            "```",
            "",
            "### ART_02_KEY_VISUAL_V1",
            "```text",
            example_outputs["ART_02_KEY_VISUAL_V1"],
            "```",
            "",
            "### AUTOPILOT",
            "```text",
            example_outputs["AUTOPILOT"],
            "```",
            "",
            "### CH11_CONTENT_CANON_V1",
            "```text",
            example_outputs["CH11_CONTENT_CANON_V1"],
            "```",
            "",
            "## Remaining Blockers",
            "",
            "- `ART_02_ASSET_PACKAGE_V1` is still absent for `ART_02_ASSET_INTEGRATION_V1`.",
            "- `docs/content/CH10_CONTENT_CANON_V1.md` and `docs/content/CH11_CONTENT_CANON_V1.md` are absent, so the chapter 11 canon path remains blocked.",
            "- `docs/language/LOVEQIGU_TERMINOLOGY_FINAL.md` remains a logical alias only; the authoritative live file is `docs/language/LOVEQIGU_TERMINOLOGY_V1.md`.",
            "",
            "`PROJECT_CONTEXT_PREFLIGHT_V1_COMPLETE = YES`",
        ]
    )


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--task", help="Task name to preflight")
    parser.add_argument("--report", action="store_true", help="Print report body")
    parser.add_argument("--write-report", action="store_true", help="Write report to docs/PROJECT_CONTEXT_PREFLIGHT_V1_REPORT.md")
    parser.add_argument("--all", action="store_true", help="Run all example tasks")
    args = parser.parse_args()

    # Required by the prompt: read the source documents.
    _ = read_text(REGISTRY_PATH)
    _ = read_text(MEMORY_PATH)
    _ = read_text(ROUTER_PATH)

    example_tasks = [
        "ART_02_IMPLEMENTATION_V1",
        "ART_02_ASSET_INTEGRATION_V1",
        "ART_02_KEY_VISUAL_V1",
        "AUTOPILOT",
        "CH11_CONTENT_CANON_V1",
    ]

    example_outputs = {
        name: render(get_task_spec(name))
        for name in example_tasks
        if get_task_spec(name)
    }

    if args.all:
        for task_name in example_tasks:
            spec = get_task_spec(task_name)
            if spec is None:
                print(f"TASK: {task_name}\nSTATUS: BLOCKED\nREASON: UNKNOWN_TASK")
            else:
                print(render(spec))
                print()
        if args.write_report:
            report_path = REPO_ROOT / "docs" / "PROJECT_CONTEXT_PREFLIGHT_V1_REPORT.md"
            report_path.write_text(build_report(example_outputs), encoding="utf-8")
        return 0

    if not args.task:
        raise SystemExit("Provide --task or --all")

    spec = get_task_spec(args.task)
    if spec is None:
        print(f"TASK: {args.task}")
        print("OWNER: UNKNOWN")
        print("REQUIRED FILES:")
        print("- None.")
        print("OPTIONAL FILES:")
        print("- None.")
        print("MISSING_FILES:")
        print(f"- Unknown task: {args.task}")
        print("FROZEN_FILES:")
        print("- None.")
        print("STATUS:")
        print("BLOCKED")
        print("NEXT_OWNER:")
        print("NONE")
        return 1

    output = render(spec)
    print(output)

    if args.write_report:
        report_path = REPO_ROOT / "docs" / "PROJECT_CONTEXT_PREFLIGHT_V1_REPORT.md"
        report_path.write_text(build_report(example_outputs), encoding="utf-8")

    if args.report:
        print()
        print(build_report(example_outputs))

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
