/**
 * SAFE JSON — 安全的 JSON.parse 包装器
 *
 * 防止 storage 中损坏的 JSON 数据（如 "<!DOCTYPE html>" 等 HTML 片段）
 * 导致 JSON.parse 抛出 "Unexpected token <" 崩溃。
 *
 * 使用场景：
 *   所有从 wx.getStorageSync / localStorage / sessionStorage 读取的数据
 *   必须经过 safeParse() 而非直接 JSON.parse()
 *
 * @param {*} str - 待解析的字符串（或任意值）
 * @param {*} fallback - 解析失败时的默认返回值（默认 null）
 * @returns {*} 解析结果或 fallback
 */
function safeParse(str, fallback) {
  if (fallback === undefined) {
    fallback = null;
  }
  try {
    if (str === null || str === undefined || str === '') {
      return fallback;
    }
    if (typeof str !== 'string') {
      return str;
    }
    // 快速检测常见非 JSON 前缀（HTML 标签、XML 声明等）
    var trimmed = str.trim();
    if (trimmed.length > 0) {
      var firstChar = trimmed.charAt(0);
      if (firstChar === '<' || firstChar === '%' || firstChar === '!' || firstChar === '-' || firstChar === '/') {
        console.warn('[safeParse] input starts with unexpected character "' + firstChar + '", returning fallback');
        return fallback;
      }
    }
    return JSON.parse(str);
  } catch (e) {
    console.warn('[safeParse] JSON parse failed:', e && e.message ? e.message : String(e));
    return fallback;
  }
}

/**
 * SAFE CLONE — 安全深拷贝（防止循环引用崩溃）。
 *
 * 替换项目中所有 JSON.parse(JSON.stringify(value)) 模式，
 * 在 JSON.stringify 异常时 fallback 到 Object.assign 浅拷贝。
 *
 * @param {*} value - 要克隆的值
 * @param {*} fallback - 克隆失败时的默认返回值（默认 undefined）
 * @returns {*} 克隆结果或 fallback
 */
function safeClone(value, fallback) {
  if (value === null || value === undefined) {
    return value;
  }
  // 原始类型无需克隆
  if (typeof value !== 'object') {
    return value;
  }
  try {
    return JSON.parse(JSON.stringify(value));
  } catch (e) {
    console.warn('[safeClone] JSON clone failed:', e && e.message ? e.message : String(e), '- falling back to shallow copy');
    try {
      if (Array.isArray(value)) {
        return value.slice();
      }
      return Object.assign({}, value);
    } catch (e2) {
      return fallback;
    }
  }
}

/**
 * GUARD STORAGE VALUE — 检查 wx.getStorageSync 返回的原始值是否被污染。
 *
 * wx.getStorageSync 在正常情况返回已反序列化的对象，
 * 但如果存储数据被外部工具直接写入 HTML/文本，返回值是字符串。
 * 此函数捕获这种情况并返回 fallback。
 *
 * @param {*} value - wx.getStorageSync 的返回值
 * @param {*} fallback - 被污染时的默认值（默认 null）
 * @returns {*} 原始值或 fallback
 */
function guardStorageValue(value, fallback) {
  if (fallback === undefined) {
    fallback = null;
  }
  if (value === null || value === undefined) {
    return fallback;
  }
  // 字符串类型可能是被污染的 HTML 或错误响应
  if (typeof value === 'string') {
    var trimmed = value.trim();
    if (trimmed.length > 0) {
      var firstChar = trimmed.charAt(0);
      if (firstChar === '<' || firstChar === '%' || firstChar === '!' || firstChar === '{' || firstChar === '[') {
        // { 和 [ 是合法的 JSON 起始字符，但如果是纯字符串存储则作为正常值
        // 只有在字符串包含 HTML 标记特征时才判定为污染
        if (firstChar === '<' || trimmed.indexOf('<!DOCTYPE') === 0 || trimmed.indexOf('<html') === 0 || trimmed.indexOf('<HTML') === 0) {
          console.warn('[guardStorageValue] HTML-contaminated value detected, returning fallback');
          return fallback;
        }
      }
    }
  }
  return value;
}

module.exports = {
  safeParse: safeParse,
  safeClone: safeClone,
  guardStorageValue: guardStorageValue
};
