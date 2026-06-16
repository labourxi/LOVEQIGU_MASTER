import json
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parents[2]
DATA_DIR = BASE_DIR / "data" / "merchant_event"

FILES = [
    ("activity", "activity.schema.json", "activity.mock.json"),
    ("activity_task", "activity_task.schema.json", "activity_task.mock.json"),
    ("activity_asset", "activity_asset.schema.json", "activity_asset.mock.json"),
    ("coupon_template", "coupon_template.schema.json", "coupon_template.mock.json"),
    ("merchant_binding", "merchant_binding.schema.json", "merchant_binding.mock.json"),
]


def load_json(path: Path):
    with path.open("r", encoding="utf-8") as fh:
        return json.load(fh)


def validate_schema(schema: dict) -> list[str]:
    errors = []
    if schema.get("type") != "object":
        errors.append("schema type must be object")
    if schema.get("additionalProperties") is not False:
        errors.append("schema must set additionalProperties=false")
    if not isinstance(schema.get("properties"), dict):
        errors.append("schema missing properties object")
    if not isinstance(schema.get("required"), list):
        errors.append("schema missing required list")
    props = schema.get("properties", {})
    for key in schema.get("required", []):
        if key not in props:
            errors.append(f"required field missing from properties: {key}")
    return errors


def validate_mock(schema: dict, mock: dict) -> list[str]:
    errors = []
    props = schema.get("properties", {})
    required = schema.get("required", [])

    if not isinstance(mock, dict):
        return ["mock must be an object"]

    for key in required:
        if key not in mock:
            errors.append(f"missing required field: {key}")

    for key in mock:
        if key not in props:
            errors.append(f"unexpected field: {key}")

    for key, spec in props.items():
        if key not in mock:
            continue
        expected = spec.get("type")
        value = mock[key]
        if expected == "string" and not isinstance(value, str):
            errors.append(f"field {key} must be string")
        elif expected == "integer" and not (isinstance(value, int) and not isinstance(value, bool)):
            errors.append(f"field {key} must be integer")
        elif expected == "boolean" and not isinstance(value, bool):
            errors.append(f"field {key} must be boolean")
        elif expected == "object" and not isinstance(value, dict):
            errors.append(f"field {key} must be object")
        elif expected == "array" and not isinstance(value, list):
            errors.append(f"field {key} must be array")

    return errors


def main():
    all_ok = True
    for name, schema_name, mock_name in FILES:
        schema_path = DATA_DIR / schema_name
        mock_path = DATA_DIR / mock_name
        try:
            schema = load_json(schema_path)
            mock = load_json(mock_path)
            schema_errors = validate_schema(schema)
            mock_errors = validate_mock(schema, mock)
            if schema_errors or mock_errors:
                all_ok = False
                print(f"{name}: FAIL")
                for err in schema_errors + mock_errors:
                    print(f"  - {err}")
            else:
                print(f"{name}: PASS")
        except Exception as exc:
            all_ok = False
            print(f"{name}: FAIL")
            print(f"  - {type(exc).__name__}: {exc}")
    print("SCHEMA_VALIDATION_PASS" if all_ok else "SCHEMA_VALIDATION_FAIL")


if __name__ == "__main__":
    main()
