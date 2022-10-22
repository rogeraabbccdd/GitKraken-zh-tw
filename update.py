"""
Soruce From EvanHsieh0415
https://github.com/EvanHsieh0415
"""

from json import load, dump

with open('./strings.en.json', encoding='utf8') as enJSON, open('./strings.json', encoding='utf8') as zhJSON:
    data = load(enJSON) | load(zhJSON)

with open('./strings.json', 'w', encoding='utf8') as JSON:
    dump(data, JSON, indent=4, ensure_ascii=False)
