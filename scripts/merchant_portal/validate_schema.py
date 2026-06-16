import json
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parents[2]
MERCHANT_DIR = BASE_DIR / "data" / "merchant_portal"
PARK_DIR = BASE_DIR / "data" / "park_admin"
SCHEMA_DIR = BASE_DIR / "docs" / "product" / "merchant"


ARRAY_MOCKS = {
    "merchant_redemption_center": 3,
}

FILES = [
    ("merchant_profile", MERCHANT_DIR, "merchant_profile.schema.json", "merchant_profile.mock.json"),
    ("merchant_coupon", MERCHANT_DIR, "merchant_coupon.schema.json", "merchant_coupon.mock.json"),
    ("merchant_redemption_center", MERCHANT_DIR, "merchant_redemption_center.schema.json", "merchant_redemption_center.mock.json"),
    ("coupon_redemption_record", MERCHANT_DIR, "coupon_redemption_record.schema.json", "coupon_redemption_record.mock.json"),
    ("merchant_bill", MERCHANT_DIR, "merchant_bill.schema.json", "merchant_bill.mock.json"),
    ("merchant_ticket", MERCHANT_DIR, "merchant_ticket.schema.json", "merchant_ticket.mock.json"),
    ("park_activity", PARK_DIR, "park_activity.schema.json", "park_activity.mock.json"),
    ("park_activity_coupon_link", PARK_DIR, "park_activity_coupon_link.schema.json", "park_activity_coupon_link.mock.json"),
    ("park_activity_merchant_link", PARK_DIR, "park_activity_merchant_link.schema.json", "park_activity_merchant_link.mock.json"),
    ("park_admin_dashboard_summary", PARK_DIR, "park_admin_dashboard_summary.schema.json", "park_admin_dashboard_summary.mock.json"),
    ("rule_based_optimization_suggestion", PARK_DIR, "rule_based_optimization_suggestion.schema.json", "rule_based_optimization_suggestion.mock.json"),
]


def load_json(path: Path):
    with path.open("r", encoding="utf-8") as fh:
        return json.load(fh)


def validate_schema(schema: dict) -> list[str]:
    errors = []
    if schema.get("type") != "object":
        errors.append("schema type must be object")
    if "properties" not in schema:
        errors.append("schema missing properties")
    if "required" not in schema:
        errors.append("schema missing required")
    if schema.get("additionalProperties") is not False:
        errors.append("schema must set additionalProperties=false")
    return errors


def validate_mock(schema: dict, mock: dict) -> list[str]:
    errors = []
    required = schema.get("required", [])
    props = schema.get("properties", {})
    for key in required:
        if key not in mock:
            errors.append(f"missing required field: {key}")
    for key in mock:
        if key not in props:
            errors.append(f"unexpected field: {key}")
    return errors


def validate_mock_records(schema: dict, mock) -> list[str]:
    records = mock if isinstance(mock, list) else [mock]
    errors = []
    min_count = ARRAY_MOCKS.get(schema.get("title", ""), 0)
    if min_count and len(records) < min_count:
        errors.append(f"mock must contain at least {min_count} records, got {len(records)}")
    for index, record in enumerate(records):
        for err in validate_mock(schema, record):
            errors.append(f"record[{index}]: {err}")
    return errors


def main():
    all_ok = True
    for name, base_dir, schema_name, mock_name in FILES:
        schema_path = base_dir / schema_name
        mock_path = base_dir / mock_name
        try:
            schema = load_json(schema_path)
            mock = load_json(mock_path)
            schema_errors = validate_schema(schema)
            mock_errors = validate_mock_records(schema, mock)
            if schema_errors or mock_errors:
                all_ok = False
                print(f"{name}: FAIL")
                for err in schema_errors + mock_errors:
                    print(f"  - {err}")
            else:
                count = len(mock) if isinstance(mock, list) else 1
                print(f"{name}: PASS ({count} records)" if count > 1 else f"{name}: PASS")
        except Exception as exc:
            all_ok = False
            print(f"{name}: FAIL")
            print(f"  - {type(exc).__name__}: {exc}")
    print("SCHEMA_VALIDATION_PASS" if all_ok else "SCHEMA_VALIDATION_FAIL")


if __name__ == "__main__":
    main()
