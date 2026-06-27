/**
 * VISUAL LANGUAGE V1 — Unified Visual Mothertongue
 *
 * LOVEQIGU_MASTER 统一视觉母体定义。
 *
 * 视觉不是UI，是“世界状态表达”。
 * 所有页面、组件、信物、显现动效必须遵循本语言系统。
 *
 * ─────────────────────────────────────────────────────────
 * 核心原则（不可变）
 * ─────────────────────────────────────────────────────────
 *
 * 1. 世界优先于产品
 * 2. 显现优先于表达
 * 3. 显现 ≠ 出现 ≠ 获得 ≠ 生成
 * 4. 显现 = 遮蔽消散
 * 5. 用户并非获得新的事物 — 只是重新看见原本存在的事物
 * 6. 回响大于特效
 * 7. 少即是多
 * 8. UI必须「像世界」，不能「像系统」
 *
 * 合规：
 *   - docs/system/visual/VISUAL_SYSTEM_V1.md (FROZEN)
 *   - docs/art/ART_03_VISUAL_PHILOSOPHY_V1.md (FROZEN)
 *   - docs/art/ART_03_REVELATION_RITUAL_V1.md (FREEZE)
 *   - docs/art/ART_03A_REVELATION_PARTICLE_SYSTEM_V1.md (FROZEN)
 *   - docs/art/ART_03C_CONNECTION_LIGHTING_TEMPLATE_V1.md (FROZEN)
 *   - system/world_engine/state_machine.js (STRUCTURAL FREEZE)
 *   - system/visual/motion.js (rAF breathing)
 *   - system/visual/visual_tokens.css (CSS custom properties)
 */

/**
 * ─────────────────────────────────────────────────────────
 *  一、主视觉关键词（Visual Keywords）
 * ─────────────────────────────────────────────────────────
 *
 * 定义整个系统的视觉母体。每个关键词对应一组可观测的视觉特征，
 * 是系统内所有视觉表达的基础组成部分。
 */
export const VISUAL_KEYWORDS = {

  /**
   * 光（Light）— 世界的呼吸与显现媒介
   *
   * 光代表显现。光不是奖励特效。
   * 必须：缓慢、柔和、具有呼吸感。
   * 禁止：爆闪、强光炸裂。
   *
   * 合规：ART_03_VISUAL_PHILOSOPHY_V1 §八
   */
  LIGHT: {
    id: 'light',
    label: '光',
    description: '世界的呼吸与显现媒介。缓慢、柔和、具有呼吸感。',
    prohibitions: ['爆闪', '强光炸裂', '纯白高亮'],
    css_tokens: [
      '--light-gold',
      '--light-gold-soft',
      '--light-gold-edge',
      '--light-gold-core',
      '--light-platinum',
      '--light-platinum-muted'
    ]
  },

  /**
   * 雾（Mist）— 世界的遮蔽与深度
   *
   * 雾代表尚未显现的部分。是遮蔽，不是装饰。
   * 雾的变化 = 世界状态的物理表达。
   *
   * 合规：VISUAL_SYSTEM_V1 §2.1
   */
  MIST: {
    id: 'mist',
    label: '雾',
    description: '世界的遮蔽与深度。雾的变化 = 世界状态的物理表达。',
    prohibitions: ['纯色遮罩', '信息堆积'],
    css_tokens: [
      '--world-mist',
      '--world-mist-deep',
      '--world-mist-accent',
      '--world-mist-intensity'
    ]
  },

  /**
   * 星（Star）— 世界的记忆与连接点
   *
   * 星代表被记录的位置、被唤醒的连接、被认出的存在。
   * 星点不是装饰 — 是世界的记忆粒子。
   */
  STAR: {
    id: 'star',
    label: '星',
    description: '世界的记忆与连接点。星点不是装饰，是世界的记忆粒子。',
    css_tokens: [
      '--star-dot',
      '--star-dot-gold',
      '--world-star-intensity',
      '--glow-star'
    ]
  },

  /**
   * 纹理（Texture）— 世界的物质感
   *
   * 纹理表达世界的历史感与真实感。
   * 包括：金石质感、古籍质感、星图质感、经络质感。
   * 禁止：高饱和、荧光、塑料感。
   *
   * 合规：ART_03_VISUAL_PHILOSOPHY_V1 §四（视觉关键词）
   */
  TEXTURE: {
    id: 'texture',
    label: '纹理',
    description: '世界的物质感：金石、古籍、星图、经络。克制、安静、厚重。',
    prohibitions: ['高饱和', '荧光', '塑料感', '彩虹渐变'],
    archetypes: [
      '金石墨韵',
      '宣纸留白',
      '星图脉络',
      '经络刻线'
    ]
  },

  /**
   * 显现（Revelation）— 世界状态的转变
   *
   * 显现是遮蔽消散的过程，不是物体的出现。
   * 固定流程：遮蔽 → 消散 → 刻线浮现 → 关系显现 → 回响扩散。
   *
   * 合规：ART_03_REVELATION_RITUAL_V1 §三（视觉路径）
   */
  REVELATION: {
    id: 'revelation',
    label: '显现',
    description: '遮蔽消散的过程。固定流程：遮蔽 → 消散 → 刻线浮现 → 关系显现 → 回响扩散。',
    prohibitions: [
      'SSR爆闪', '宝箱', '金币', '装备', '等级提升',
      '法阵', '能量柱', '五角星', '悬浮神器', '游戏化奖励动画'
    ],
    css_tokens: [
      '--revelation-glow-inner',
      '--revelation-glow-outer',
      '--revelation-ring',
      '--world-revelation-intensity',
      '--world-field-energy'
    ]
  },

  /**
   * 回响（Echo）— 显现后的余波
   *
   * 回响是视觉事件结束后的延续状态。
   * 用户感受的是「回应」，而不是「系统播放了动画」。
   *
   * 合规：ART_03A_REVELATION_PARTICLE_SYSTEM_V1
   */
  ECHO: {
    id: 'echo',
    label: '回响',
    description: '显现后的余波。回响大于特效。用户感受到回应，而非系统动画。',
    prohibitions: ['持续闪烁', '重复循环', 'RPG特效'],
    css_tokens: [
      '--glow-gate',
      '--light-gold-core',
      '--light-platinum-muted'
    ]
  }
};

/**
 * ─────────────────────────────────────────────────────────
 *  二、光的层级（Light Hierarchy）
 * ─────────────────────────────────────────────────────────
 *
 * 光在系统中分为三个层级，对应不同的世界状态与视觉权重。
 * 较低层级的光始终存在于背景中，较高层级的光在特定状态被触发。
 */
export const LIGHT_HIERARCHY = {

  /**
   * 环境光（Ambient Light）
   *
   * 状态：始终存在（REST baseline）
   * 来源：深蓝冷色调背景，金色散射微光
   * 特征：低对比，不可聚焦，统一氛围
   * 对应 CSS 变量：
   *   --light-gold: rgba(212, 188, 132, 0.82) → 降为 ambient 0.28
   *   --world-field-energy: 0.32
   *
   * 动效：rAF 呼吸（BREATH_BY_STATE.REST: amp 0.02, rate 0.7, base 0.42）
   */
  AMBIENT: {
    id: 'ambient',
    label: '环境光',
    description: '始终存在的深蓝冷光与金色散射。低对比，统一氛围。',
    world_state: 'rest',
    field_energy_min: 0.24,
    field_energy_max: 0.38,
    css_property: '--light-gold',
    opacity_range: [0.18, 0.38],
    blend_mode: 'soft-light'
  },

  /**
   * 聚焦光（Focus Light）
   *
   * 状态：PERCEPTION 状态激活
   * 来源：锚点方向的金光凝集，感知对象微光
   * 特征：方向性，可辨识，但不刺眼
   * 对应 CSS 变量：
   *   --world-field-energy: 0.52
   *   --world-anchor-intensity: 0.62
   *
   * 动效：rAF 呼吸（BREATH_BY_STATE.PERCEPTION: amp 0.035, rate 0.95, base 0.55）
   */
  FOCUS: {
    id: 'focus',
    label: '聚焦光',
    description: 'PERCEPTION 状态激活。有方向性的金光凝集。',
    world_state: 'perception',
    field_energy_min: 0.42,
    field_energy_max: 0.62,
    css_property: '--light-gold-edge',
    opacity_range: [0.38, 0.68],
    blend_mode: 'screen'
  },

  /**
   * 显现光（Reveal Light）
   *
   * 状态：REVELATION 状态触发
   * 来源：场共振 + 环辉光 + 核心脉冲
   * 特征：缓慢显现，持续呼吸，伴随粒子回响
   * 对应 CSS 变量：
   *   --world-field-energy: 0.88
   *   --world-revelation-intensity: 1
   *   --revelation-glow-inner: rgba(232, 208, 152, 0.38) → 升至 0.62
   *
   * 动效：rAF 呼吸（BREATH_BY_STATE.REVELATION: amp 0.055, rate 1.35, base 0.78）
   *       额外 brightness pulse (1.1 ± 0.08)
   *       boxShadow pulse (40±12px / 22±8px)
   */
  REVEAL: {
    id: 'reveal',
    label: '显现光',
    description: 'REVELATION 状态触发。场共振 + 环辉光 + 核心脉冲的完整显现。',
    world_state: 'revelation',
    field_energy_min: 0.72,
    field_energy_max: 1.0,
    css_property: '--revelation-glow-inner',
    opacity_range: [0.62, 1.0],
    blend_mode: 'screen',
    pulse: {
      brightness: { min: 1.02, max: 1.18 },
      shadow_outer: { min: 28, max: 52 },
      shadow_inner: { min: 14, max: 30 }
    }
  }
};

/**
 * ─────────────────────────────────────────────────────────
 *  三、雾的层级（Mist Hierarchy）
 * ─────────────────────────────────────────────────────────
 *
 * 雾的密度直接对应世界状态。
 * 雾越浓 = 遮蔽越强 = 世界越处于低能量态。
 * 雾越淡 = 显现越充分 = 世界越处于高能量态。
 */
export const MIST_HIERARCHY = {

  /**
   * 柔雾（Soft Mist）
   *
   * 状态：REVELATION 时的低遮蔽
   * 特征：稀薄，半透明，可见深层结构
   * CSS: --world-mist-intensity: 0.82
   * 动效：blur 22px, opacity 0.68, 极慢漂移
   */
  SOFT: {
    id: 'soft',
    label: '柔雾',
    description: 'REVELATION 状态。稀薄半透明，可见深层结构。',
    world_state: 'revelation',
    intensity_range: [0.72, 0.88],
    blur_radius: '22px',
    opacity_range: [0.62, 0.82],
    drift_speed: 0.18,
    radial_scale: 1.02,
    transition_ms: 1800
  },

  /**
   * 浓雾（Dense Mist）
   *
   * 状态：REST 时的中性遮蔽
   * 特征：中等密度，世界轮廓模糊但可辨
   * CSS: --world-mist-intensity: 0.55
   * 动效：blur 26px, opacity 0.55, 缓慢漂移
   */
  DENSE: {
    id: 'dense',
    label: '浓雾',
    description: 'REST 状态。中等密度，世界轮廓模糊但可辨。',
    world_state: 'rest',
    intensity_range: [0.45, 0.62],
    blur_radius: '26px',
    opacity_range: [0.48, 0.62],
    drift_speed: 0.12,
    radial_scale: 1.0,
    transition_ms: 2400
  },

  /**
   * 过渡雾（Transition Mist）
   *
   * 状态：TRANSITION 时的最高遮蔽
   * 特征：最浓，为页面切换做准备
   * CSS: --world-mist-intensity: 0.92
   * 动效：blur 32px, opacity 0.92, 快速充填
   */
  TRANSITION: {
    id: 'transition',
    label: '过渡雾',
    description: 'TRANSITION 状态。最高遮蔽，为页面切换做准备。',
    world_state: 'transition',
    intensity_range: [0.85, 1.0],
    blur_radius: '32px',
    opacity_range: [0.82, 1.0],
    drift_speed: 0.28,
    radial_scale: 1.12,
    transition_ms: 1400
  }
};

/**
 * ─────────────────────────────────────────────────────────
 *  四、显现动效规则（Revelation Motion Rules）
 * ─────────────────────────────────────────────────────────
 *
 * 所有视觉动效必须遵循以下三种原语。
 * 每个原语都有固定的情绪目标与禁止规则。
 *
 * 动效哲学：被发现 → 被唤醒 → 被连接
 */
export const REVELATION_MOTION = {

  /**
   * 淡入（Fade）
   *
   * 用途：元素进入场景的基本方式。
   *      表达「一直存在，刚刚被看见」。
   *
   * 参数：
   *   duration: 800-1600ms（禁止短于 800ms）
   *   easing: cubic-bezier(0.45, 0.05, 0.55, 0.95) — 即 --ease-breath
   *   from_opacity: 0 → to_opacity: target
   *   from_transform: translateY(4-8px) → to_transform: none
   *
   * 禁止：translateY > 16px, opacity < 0 起点, duration < 600ms
   *
   * 适用：卡片入场、文本显现、背景层过渡
   */
  FADE: {
    id: 'fade',
    label: '淡入',
    description: '元素进入场景的基本方式。表达「一直存在，刚刚被看见」。',
    emotion: '重逢 · 确认',
    duration_ms: { min: 800, recommended: 1200, max: 1600 },
    easing: 'cubic-bezier(0.45, 0.05, 0.55, 0.95)',
    from: { opacity: 0, transform: 'translateY(6px)' },
    to: { opacity: null, transform: 'none' },
    prohibitions: [
      'duration < 600ms',
      'translateY > 16px',
      'opacity < 0 as start',
      '从右侧/左侧滑入'
    ]
  },

  /**
   * 显现（Reveal）
   *
   * 用途：世界状态转变的视觉表现。
   *      完整仪式路径：遮蔽 → 消散 → 刻线浮现 → 关系显现 → 回响扩散。
   *
   * 参数：
   *   duration: 2000-4000ms（完整仪式）
   *   phases: [遮蔽 phase(0-25%), 消散 phase(25-55%),
   *            刻线浮现 phase(55-75%), 关系显现 phase(75-90%),
   *            回响扩散 phase(90-100%)]
   *
   * 禁止：< 1500ms、爆闪、跳 phase、无回响扩散
   *
   * 适用：信物显现、星宿点亮、能量场爆发、AR显现
   */
  REVEAL: {
    id: 'reveal',
    label: '显现',
    description: '世界状态转变的完整仪式。遮蔽 → 消散 → 刻线浮现 → 关系显现 → 回响扩散。',
    emotion: '重逢 → 确认 → 祝福 → 坚定',
    duration_ms: { min: 2000, recommended: 2800, max: 4000 },
    easing: 'cubic-bezier(0.45, 0.05, 0.55, 0.95)',
    phases: [
      { name: '遮蔽',       range: [0, 0.25], action: 'maximize_mist + dim_light' },
      { name: '消散',       range: [0.25, 0.55], action: 'mist_dissipate + field_emerge' },
      { name: '刻线浮现',   range: [0.55, 0.75], action: 'line_trace + gold_edge' },
      { name: '关系显现',   range: [0.75, 0.90], action: 'core_reveal + connection_light' },
      { name: '回响扩散',   range: [0.90, 1.0], action: 'echo_ripple + stillness' }
    ],
    prohibitions: [
      'duration < 1500ms',
      '爆闪（brightness > 1.8）',
      '跳过任何 phase',
      '无回响扩散 phase',
      'SSR爆闪特效',
      '游戏化奖励动画'
    ]
  },

  /**
   * 爆发（Burst）
   *
   * 用途：高能量显现的瞬间，如 REVELATION 状态的 resonance burst。
   *      注意：burst ≠ 爆炸。burst = 能量从核心向外均匀扩散。
   *
   * 参数：
   *   duration: 800-2000ms
   *   scale: 1 → 1.08-1.15 → 1（三次呼吸）
   *   brightness: 1 → 1.12-1.28 → 1
   *   shadow: 扩散+回缩
   *
   * 禁止：scale > 1.3、brightness > 1.5、一次性爆发无呼吸衰减
   *
   * 适用：显现态核心脉冲、revelation_core 激活、合一点亮
   */
  BURST: {
    id: 'burst',
    label: '爆发',
    description: '高能量显现的瞬间。能量从核心向外均匀扩散，非爆炸。',
    emotion: '确认 · 坚定',
    duration_ms: { min: 800, recommended: 1400, max: 2000 },
    easing: 'cubic-bezier(0.45, 0.05, 0.55, 0.95)',
    breath_cycles: 3,
    params: {
      scale_peak: 1.12,
      brightness_peak: 1.22,
      shadow_outer_peak_px: 48,
      shadow_inner_peak_px: 26,
      decay_per_cycle: 0.7
    },
    prohibitions: [
      'scale > 1.3',
      'brightness > 1.5',
      '一次性爆发无呼吸衰减',
      '爆炸式粒子飞散',
      '全屏闪光'
    ]
  }
};

/**
 * ─────────────────────────────────────────────────────────
 *  五、世界状态 → 视觉映射（World State Visual Mapping）
 * ─────────────────────────────────────────────────────────
 *
 * 将 state_machine 的四个世界状态映射到具体的视觉参数集。
 * 这是 bootstrap 与 state_machine 可引用的视觉配置。
 */
export const STATE_VISUAL_MAP = {
  rest: {
    label: '低能量世界',
    description: '世界处于安静、低能量的初始态。',
    light: LIGHT_HIERARCHY.AMBIENT,
    mist: MIST_HIERARCHY.DENSE,
    motion: {
      amplitude: 0.02,
      rate: 0.70,
      base_opacity: 0.42
    },
    field_profile: {
      '--world-field-energy': '0.32',
      '--world-mist-intensity': '0.55',
      '--world-star-intensity': '0.42',
      '--world-revelation-intensity': '0.38',
      '--world-anchor-intensity': '0.35',
      '--world-fold-depth': '0'
    },
    layer_transitions_ms: {
      mist: 2400,
      stars: 2400,
      revelationField: 2400,
      anchor: 2400,
      worldLayer: 2400
    }
  },
  perception: {
    label: '感知世界',
    description: '世界感知到用户存在，开始聚焦。',
    light: LIGHT_HIERARCHY.FOCUS,
    mist: {
      ...MIST_HIERARCHY.DENSE,
      opacity: 0.68,
      transform: 'translate(-1.2%, -0.8%) scale(1.02)',
      blur: '22px'
    },
    motion: {
      amplitude: 0.035,
      rate: 0.95,
      base_opacity: 0.55
    },
    field_profile: {
      '--world-field-energy': '0.52',
      '--world-mist-intensity': '0.68',
      '--world-star-intensity': '0.58',
      '--world-revelation-intensity': '0.48',
      '--world-anchor-intensity': '0.62',
      '--world-fold-depth': '0'
    },
    layer_transitions_ms: {
      mist: 1800,
      stars: 1800,
      anchor: 1600,
      revelationField: 1800
    }
  },
  revelation: {
    label: '显现世界',
    description: '世界高能量态，金场共振，核心显现。',
    light: LIGHT_HIERARCHY.REVEAL,
    mist: MIST_HIERARCHY.SOFT,
    motion: {
      amplitude: 0.055,
      rate: 1.35,
      base_opacity: 0.78,
      extra_pulse: {
        brightness: { min: 1.02, max: 1.18 },
        shadow_outer: { min: 28, max: 52 },
        shadow_inner: { min: 14, max: 30 }
      }
    },
    field_profile: {
      '--world-field-energy': '0.88',
      '--world-mist-intensity': '0.82',
      '--world-star-intensity': '0.78',
      '--world-revelation-intensity': '1',
      '--world-anchor-intensity': '0.45',
      '--world-fold-depth': '0'
    },
    layer_transitions_ms: {
      mist: 1800,
      stars: 1800,
      anchor: 1600,
      revelationField: 1800
    }
  },
  transition: {
    label: '折叠世界',
    description: '世界为页面切换做准备，雾最浓，能量最低。',
    light: {
      ...LIGHT_HIERARCHY.AMBIENT,
      field_energy_min: 0.18,
      field_energy_max: 0.30
    },
    mist: MIST_HIERARCHY.TRANSITION,
    motion: {
      amplitude: 0.012,
      rate: 0.45,
      base_opacity: 0.28
    },
    field_profile: {
      '--world-field-energy': '0.24',
      '--world-mist-intensity': '0.92',
      '--world-star-intensity': '0.28',
      '--world-revelation-intensity': '0.2',
      '--world-anchor-intensity': '0.18',
      '--world-fold-depth': '1'
    },
    layer_transitions_ms: {
      worldLayer: 1400,
      mist: 1400,
      revelationCore: 1400,
      anchor: 1400
    }
  }
};

/**
 * ─────────────────────────────────────────────────────────
 *  六、信物视觉协议（Relic Visual Protocol）
 * ─────────────────────────────────────────────────────────
 *
 * 信物的视觉语言不得与数字藏品混用。
 * 信物 = 故事推进资产（Canon-driven）。
 * 数字藏品 = 市场传播资产（Marketing）。
 * 两者视觉分离。
 *
 * 信物视觉特征：
 *   - 金石质感（非发光数字）
 *   - 刻线浮现（非闪烁边框）
 *   - 微光呼吸（非发光辉光）
 *   - 静态为主，动效为辅（非全息旋转）
 *
 * 合规：docs/art/ART_03_REVELATION_RITUAL_V1 §七（产品应用范围）
 */
export const RELIC_VISUAL_PROTOCOL = {
  /**
   * 信物只使用以下视觉原语：
   */
  allowed_primitives: [
    '微光呼吸（gold soft pulse）',
    '刻线浮现（line trace emerge）',
    '金石表面质感（metal-stone texture）',
    '关系线连通（connection line lighting）',
    '静止显现场（static revelation field）'
  ],
  prohibited_primitives: [
    '全息旋转（holographic rotation）',
    '彩虹渐变（rainbow gradient）',
    '发光描边（neon glow stroke）',
    '粒子爆炸（particle explosion）',
    '悬空旋转（levitation spin）',
    'SSR级别特效'
  ],
  /**
   * 信物显现流程（遵循 REVELATION_MOTION.REVEAL）：
   */
  revelation_phases: REVELATION_MOTION.REVEAL.phases,
  /**
   * 信物层次结构（从远到近）：
   */
  layer_stack: [
    { z: 0, name: '背景场', visual: 'revelation-core__field' },
    { z: 1, name: '环辉光', visual: 'revelation-core__ring' },
    { z: 2, name: '信物体', visual: 'relic-body' },
    { z: 3, name: '刻线', visual: 'relic-inscription' },
    { z: 4, name: '微光', visual: 'relic-glow' }
  ]
};

/**
 * ─────────────────────────────────────────────────────────
 *  七、禁止项完整性检查（Prohibitions Checklist）
 * ─────────────────────────────────────────────────────────
 *
 * 用于运行时 / 设计评审时验证视觉合规。
 */
export const PROHIBITIONS_CHECKLIST = [
  // ART_03_VISUAL_PHILOSOPHY_V1
  '赛博朋克',
  '欧美魔幻',
  '重金属',
  '高饱和',
  '爆炸特效',
  '重数值感',
  '重游戏化',
  '夸张奖励感',

  // ART_03_VISUAL_PHILOSOPHY_V1 §六
  '信息堆积',
  '满屏元素',
  '持续闪烁',

  // ART_03_VISUAL_PHILOSOPHY_V1 §七
  '高纯度荧光色',
  '彩虹渐变背景',

  // ART_03_VISUAL_PHILOSOPHY_V1 §八
  '爆闪',
  '强光炸裂',
  '满屏粒子',

  // ART_03_REVELATION_RITUAL_V1 §六
  '掉落',
  '召唤',
  '爆炸',
  '飞行',
  'RPG特效',

  // ART_03_REVELATION_RITUAL_V1 §八
  'SSR爆闪',
  '宝箱',
  '金币',
  '装备',
  '等级提升',
  '法阵',
  '能量柱',
  '五角星徽章',
  '悬浮神器',

  // VISUAL_SYSTEM_V1 §3
  '登录压迫感设计',
  '数据UI',
  '卡片工具化',
  'KPI/数值/成长系统',
  '强运营结构',
  '游戏化奖励系统'
];

/**
 * ─────────────────────────────────────────────────────────
 *  八、视觉系统版本信息
 * ─────────────────────────────────────────────────────────
 */
export const VISUAL_SYSTEM_META = {
  name: 'VISUAL_LANGUAGE_V1',
  status: 'ACTIVE',
  version: '1.0.0',
  date: '2026-06-27',
  frozen_specs: [
    'docs/system/visual/VISUAL_SYSTEM_V1.md',
    'docs/art/ART_03_VISUAL_PHILOSOPHY_V1.md',
    'docs/art/ART_03_REVELATION_RITUAL_V1.md',
    'docs/art/ART_03A_REVELATION_PARTICLE_SYSTEM_V1.md',
    'docs/art/ART_03C_CONNECTION_LIGHTING_TEMPLATE_V1.md'
  ],
  runtime_implementations: [
    'system/world_engine/state_machine.js (FIELD_PROFILE)',
    'system/visual/motion.js (BREATH_BY_STATE + rAF loop)',
    'system/visual/visual_tokens.css (CSS custom properties)',
    'system/visual/visual_language_v1.js (THIS FILE)'
  ],
  principles: [
    '世界优先于产品',
    '显现优先于表达',
    '显现 = 遮蔽消散',
    '回响大于特效',
    '少即是多',
    'UI必须像世界，不能像系统'
  ]
};
