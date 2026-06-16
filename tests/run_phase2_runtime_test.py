from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from runtime.state_engine.event_state_engine import (
    claim_coupon,
    complete_task,
    reset_progress,
)


PROGRESS_PATH = ROOT / "runtime" / "user_progress" / "user_progress.json"
USER_COUPON_PATH = ROOT / "data" / "user_mock" / "user_coupon.mock.json"


def _load_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def main() -> None:
    reset_progress()

    task_result = complete_task("task_book_quiz")
    print("task_complete", "PASS" if task_result.get("success") else "FAIL")
    print(json.dumps(task_result, ensure_ascii=False))

    relic_result = task_result.get("relic_result") or {}
    print("relic_granted", "PASS" if relic_result.get("success") else "FAIL")

    coupon_result = relic_result.get("coupon_result") or {}
    print("coupon_unlocked", "PASS" if coupon_result.get("success") else "FAIL")
    print(json.dumps(coupon_result, ensure_ascii=False))

    claim_result = claim_coupon("coupon_loveqigu_book_01")
    print("coupon_claimed", "PASS" if claim_result.get("success") else "FAIL")
    print(json.dumps(claim_result, ensure_ascii=False))

    progress = _load_json(PROGRESS_PATH)
    user_coupons = _load_json(USER_COUPON_PATH)

    checks = [
        "task_book_quiz" in progress.get("completed_tasks", []),
        "relic_bookmark" in progress.get("owned_relics", []),
        "coupon_loveqigu_book_01" in progress.get("unlocked_coupons", []),
        "coupon_loveqigu_book_01" in progress.get("claimed_coupons", []),
        any(
            isinstance(item, dict)
            and item.get("coupon_id") == "coupon_loveqigu_book_01"
            and item.get("status") == "CLAIMED"
            for item in user_coupons
        ),
    ]
    print("EVENT_RUNTIME_PATH_PASS" if all(checks) else "EVENT_RUNTIME_PATH_FAIL")


if __name__ == "__main__":
    main()
