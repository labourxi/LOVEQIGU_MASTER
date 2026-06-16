import json
from pathlib import Path

from lifecycle_engine import TRANSITIONS, get_allowed_next_status, is_valid_status


BASE_DIR = Path(__file__).resolve().parents[2]
DATA_PATH = BASE_DIR / "data" / "event_lifecycle" / "activity_lifecycle.mock.json"


def load_json(path: Path):
    with path.open("r", encoding="utf-8") as fh:
        return json.load(fh)


def main():
    all_ok = True
    records = load_json(DATA_PATH)
    if not isinstance(records, list):
        print("activity_lifecycle: FAIL")
        print("  - mock must be an array")
        print("LIFECYCLE_VALIDATION_FAIL")
        return

    for idx, record in enumerate(records):
        prefix = f"record[{idx}]"
        errors = []
        if not isinstance(record, dict):
            errors.append("record must be an object")
        else:
            for field in ["activity_id", "activity_name", "current_status", "allowed_next_status", "updated_at"]:
                if field not in record:
                    errors.append(f"missing field: {field}")
            current_status = record.get("current_status")
            allowed_next_status = record.get("allowed_next_status")
            if current_status is not None and not is_valid_status(current_status):
                errors.append(f"invalid status: {current_status}")
            if isinstance(allowed_next_status, list):
                for next_status in allowed_next_status:
                    if not is_valid_status(next_status):
                        errors.append(f"invalid next status: {next_status}")
                if current_status in TRANSITIONS:
                    expected = get_allowed_next_status(current_status)
                    if sorted(expected) != sorted(allowed_next_status):
                        errors.append(
                            f"transition mismatch: expected {expected}, got {allowed_next_status}"
                        )
            else:
                errors.append("allowed_next_status must be array")

        if errors:
            all_ok = False
            print(f"{prefix}: FAIL")
            for err in errors:
                print(f"  - {err}")
        else:
            print(f"{prefix}: PASS")

    print("LIFECYCLE_VALIDATION_PASS" if all_ok else "LIFECYCLE_VALIDATION_FAIL")


if __name__ == "__main__":
    main()
