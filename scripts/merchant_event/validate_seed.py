import json
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parents[2]
DATA_DIR = BASE_DIR / "data" / "merchant_event"


def load_json(path: Path):
    with path.open("r", encoding="utf-8") as fh:
        return json.load(fh)


def assert_unique(items, key):
    seen = set()
    errors = []
    for item in items:
        value = item.get(key)
        if value in seen:
            errors.append(f"duplicate {key}: {value}")
        seen.add(value)
    return errors


def ids(items, key):
    return {item[key] for item in items if isinstance(item, dict) and key in item}


def main():
    all_ok = True
    errors = []

    activity = load_json(DATA_DIR / "activity.seed.json")
    exploration_points = load_json(DATA_DIR / "exploration_points.seed.json")
    tasks = load_json(DATA_DIR / "tasks.seed.json")
    relics = load_json(DATA_DIR / "relics.seed.json")
    merchants = load_json(DATA_DIR / "merchants.seed.json")
    coupons = load_json(DATA_DIR / "coupon_templates.seed.json")
    bindings = load_json(DATA_DIR / "bindings.seed.json")

    if activity.get("event_code") != "LOVEQIGU_FIRST_EVENT_CASE_V1":
        errors.append("activity event_code mismatch")
        all_ok = False

    expected_counts = {
        "merchant_count": len(merchants),
        "coupon_count": len(coupons),
        "task_count": len(tasks),
    }
    for field, expected in expected_counts.items():
        if activity.get(field) != expected:
            errors.append(f"{field} mismatch: expected {expected}, got {activity.get(field)}")
            all_ok = False

    for label, items, key in [
        ("exploration_points", exploration_points, "point_id"),
        ("tasks", tasks, "task_id"),
        ("relics", relics, "relic_id"),
        ("merchants", merchants, "merchant_id"),
        ("coupon_templates", coupons, "coupon_id"),
    ]:
        if not isinstance(items, list):
            errors.append(f"{label} must be array")
            all_ok = False
            continue
        dup_errors = assert_unique(items, key)
        if dup_errors:
            errors.extend(dup_errors)
            all_ok = False

    point_ids = ids(exploration_points, "point_id")
    task_ids = ids(tasks, "task_id")
    relic_ids = ids(relics, "relic_id")
    merchant_ids = ids(merchants, "merchant_id")
    coupon_ids = ids(coupons, "coupon_id")

    if bindings.get("activity_id") != activity.get("event_id"):
        errors.append("bindings activity_id mismatch")
        all_ok = False
    if bindings.get("event_code") != activity.get("event_code"):
        errors.append("bindings event_code mismatch")
        all_ok = False

    for ref_field, known_ids in [
        ("activity_to_exploration_points", point_ids),
        ("activity_to_tasks", task_ids),
        ("activity_to_relics", relic_ids),
        ("activity_to_merchants", merchant_ids),
        ("activity_to_coupon_templates", coupon_ids),
    ]:
        refs = bindings.get(ref_field)
        if not isinstance(refs, list):
            errors.append(f"{ref_field} must be array")
            all_ok = False
            continue
        missing = [ref for ref in refs if ref not in known_ids]
        if missing:
            errors.append(f"{ref_field} has unknown refs: {missing}")
            all_ok = False

    for link_field, left_key, right_key, left_ids, right_ids in [
        ("exploration_point_task_bindings", "point_id", "task_id", point_ids, task_ids),
        ("task_relic_bindings", "task_id", "relic_id", task_ids, relic_ids),
        ("merchant_coupon_bindings", "merchant_id", "coupon_id", merchant_ids, coupon_ids),
    ]:
        links = bindings.get(link_field)
        if not isinstance(links, list):
            errors.append(f"{link_field} must be array")
            all_ok = False
            continue
        for idx, link in enumerate(links):
            if not isinstance(link, dict):
                errors.append(f"{link_field}[{idx}] must be object")
                all_ok = False
                continue
            if link.get(left_key) not in left_ids:
                errors.append(f"{link_field}[{idx}] unknown {left_key}: {link.get(left_key)}")
                all_ok = False
            if link.get(right_key) not in right_ids:
                errors.append(f"{link_field}[{idx}] unknown {right_key}: {link.get(right_key)}")
                all_ok = False

    if len(exploration_points) < 5 or len(tasks) < 5 or len(relics) < 5 or len(merchants) < 3 or len(coupons) < 3:
        errors.append("minimum seed counts not met")
        all_ok = False

    if all_ok:
        print("SEED_VALIDATION_PASS")
    else:
        print("SEED_VALIDATION_FAIL")
        for err in errors:
            print(f"- {err}")


if __name__ == "__main__":
    main()
