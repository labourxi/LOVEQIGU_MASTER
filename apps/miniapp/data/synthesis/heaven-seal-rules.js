/** 合成规则 — 自动生成 */

module.exports = {
  "schema": "loveqigu.synthesis.heaven.v1",
  "version": "1.0.0",
  "heaven_rule": {
    "id": "heaven_seal",
    "level": "heaven",
    "required_symbol_seals": [
      "seal_qinglong",
      "seal_zhuque",
      "seal_baihu",
      "seal_xuanwu"
    ],
    "required_symbol_names": [
      "青龙印",
      "朱雀印",
      "白虎印",
      "玄武印"
    ],
    "reward_relic": {
      "id": "seal_heaven",
      "name": "天印",
      "reward_type": "certificate",
      "reward_desc": "天印 · 高阶体验资格"
    }
  }
};
