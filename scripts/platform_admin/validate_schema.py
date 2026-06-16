import json
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parents[2]
PLATFORM_DIR = BASE_DIR / "data" / "platform_admin"
MIN_MOCK_RECORDS = 3

FILES = [
    ("platform_merchant_review", "platform_merchant_review.schema.json", "platform_merchant_review.mock.json"),
    ("platform_coupon_review", "platform_coupon_review.schema.json", "platform_coupon_review.mock.json"),
    ("platform_activity_review", "platform_activity_review.schema.json", "platform_activity_review.mock.json"),
    ("platform_release", "platform_release.schema.json", "platform_release.mock.json"),
    ("platform_dashboard_summary", "platform_dashboard_summary.schema.json", "platform_dashboard_summary.mock.json"),
]


def load_json(path: Path):
    with path.open("r", encoding="utf-8") as fh:
        return json.load(fh)


def normalize_mock_records(mock):
    if isinstance(mock, list):
        return mock
    if isinstance(mock, dict):
        return [mock]
    raise ValueError("mock must be an object or array")


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


def validate_field_type(value, spec: dict) -> list[str]:
    errors = []
    expected = spec.get("type")
    if expected == "string" and not isinstance(value, str):
        errors.append(f"expected string, got {type(value).__name__}")
    elif expected == "number" and not isinstance(value, (int, float)):
        errors.append(f"expected number, got {type(value).__name__}")
    enum_values = spec.get("enum")
    if enum_values is not None and value not in enum_values:
        errors.append(f"value {value!r} not in enum {enum_values}")
    return errors


def validate_mock_record(schema: dict, record: dict) -> list[str]:
    errors = []
    required = schema.get("required", [])
    props = schema.get("properties", {})
    for key in required:
        if key not in record:
            errors.append(f"missing required field: {key}")
    for key, value in record.items():
        if key not in props:
            errors.append(f"unexpected field: {key}")
            continue
        errors.extend(validate_field_type(value, props[key]))
    return errors


def main():
    all_ok = True
    for name, schema_name, mock_name in FILES:
        schema_path = PLATFORM_DIR / schema_name
        mock_path = PLATFORM_DIR / mock_name
        try:
            schema = load_json(schema_path)
            mock = load_json(mock_path)
            records = normalize_mock_records(mock)
            schema_errors = validate_schema(schema)
            record_errors = []
            if len(records) < MIN_MOCK_RECORDS:
                record_errors.append(f"mock must contain at least {MIN_MOCK_RECORDS} records, got {len(records)}")
            for index, record in enumerate(records):
                item_errors = validate_mock_record(schema, record)
                for err in item_errors:
                    record_errors.append(f"record[{index}]: {err}")
            if schema_errors or record_errors:
                all_ok = False
                print(f"{name}: FAIL")
                for err in schema_errors + record_errors:
                    print(f"  - {err}")
            else:
                print(f"{name}: PASS ({len(records)} records)")
        except Exception as exc:
            all_ok = False
            print(f"{name}: FAIL")
            print(f"  - {type(exc).__name__}: {exc}")
    print("SCHEMA_VALIDATION_PASS" if all_ok else "SCHEMA_VALIDATION_FAIL")


if __name__ == "__main__":
    main()
