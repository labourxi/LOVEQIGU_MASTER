import requests
import json

ARK_API_KEY = "ark-7eba71b8-b92e-4ffb-93a1-f87cae96351a-11790"
API_URL = "https://ark.cn-beijing.volces.com/api/v3/images/generations"

headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {ARK_API_KEY}"
}

payload = {
    "model": "doubao-seedream-5-0-260128",
    "prompt": "Ancient Eastern celestial relic, Jiao Mansion constellation seal, jade glyph artifacts, museum artifact lighting, soft golden dust particles, ancient manuscript background",
    "sequential_image_generation": "disabled",
    "response_format": "url",
    "size": "2048x2048",  # 改成模型支持的尺寸
    "stream": False,
    "watermark": False
}

response = requests.post(API_URL, headers=headers, json=payload)
print(json.dumps(response.json(), ensure_ascii=False, indent=2))