/**
 * RELIC VISUAL SYSTEM V1 — 信物视觉生成系统
 *
 * LOVEQIGU_MASTER 信物统一视觉生成规则。
 * 所有信物的形态、材质、光效、能量轨迹、显现动画必须遵循本系统。
 *
 * ─────────────────────────────────────────────────────────
 * 核心公式（FROZEN — RELIC_VISUAL_SYSTEM_V1 §十八）
 * ─────────────────────────────────────────────────────────
 *
 *   古籍 × 古玉 × 显现 = LOVEQIGU 标准信物
 *
 * ─────────────────────────────────────────────────────────
 * 核心哲学（不可变）
 * ─────────────────────────────────────────────────────────
 *
 * 1. 信物不是装备、不是卡牌、不是道具
 * 2. 信物是一段被重新找回的连接（RELIC_CANON_V2 §Token Definition）
 * 3. 信物不可重复获得、不可交易、不可转移
 * 4. 等级通过颜色表达，禁止通过尺寸或数值表达
 * 5. 用户感受：发现失落连接 / 找回古老知识 / 恢复生命图谱
 * 6. 信物 = 故事推进资产（Canon-driven）≠ 数字藏品（Marketing）
 *
 * ─────────────────────────────────────────────────────────
 * 合规引用
 * ─────────────────────────────────────────────────────────
 *
 * - docs/art/RELIC_VISUAL_SYSTEM_V1.md (FROZEN)
 * - docs/product/relic_system/RELIC_CANON_V2.md (FROZEN)
 * - docs/product/relic_system/RELIC_CONTENT_DENSITY_RULE_V1.md
 * - docs/product/relic_system/RELIC_VISUAL_CANON_V1.md
 * - docs/art/ART_03_REVELATION_RITUAL_V1.md (FREEZE)
 * - system/visual/visual_language_v1.js (ACTIVE)
 * - system/world_engine/relic_system.js (runtime)
 * - system/visual/visual_tokens.css (CSS properties)
 */



/**
 * ─────────────────────────────────────────────────────────
 *  一、信物类型定义（Relic Types）
 * ─────────────────────────────────────────────────────────
 *
 * 四种信物类型，对应不同的视觉特征与层级。
 */
export const RELIC_TYPES = {

  /**
   * 天象信物（Celestial Relic）
   *
   * 对应：星名（164星）/ 星宿（28宿）/ 四象
   * 视觉层级：星（青铜绿）→ 宿（白银色）→ 四象（金色）
   * 形态：古玉小印 / 宿印 / 卷轴级图腾
   * 材质：青玉 / 青铜 / 金箔
   * 颜色规则：青铜绿 → 白银色 → 金色（等级递增，非尺寸递增）
   *
   * 合规：RELIC_VISUAL_SYSTEM_V1 §八-§十
   */
  CELESTIAL: {
    id: 'celestial_relic',
    label: '天象信物',
    description: '星名、星宿、四象所对应的信物。找回的连接点、连接簇、连接域。',
    sub_types: ['star', 'lodge', 'symbol'],
    hierarchy: ['star', 'lodge', 'symbol'],
    colors: {
      star: 'bronze_green',
      lodge: 'silver_white',
      symbol: 'gold'
    },
    materials: {
      star: ['青玉（celadon jade）'],
      lodge: ['古玉（antique jade）', '青铜（bronze）'],
      symbol: ['古玉（antique jade）', '金箔（gold foil）']
    },
    forms: {
      star: '古玉小印（small jade seal）',
      lodge: '宿印（constellation seal）',
      symbol: '卷轴级图腾（scroll-level totem）'
    },
    prohibitions: [
      '使用尺寸区分等级',
      '使用数值显示等级',
      '装备式金属边框'
    ]
  },

  /**
   * 地形信物（Terrain Relic）
   *
   * 对应：上海地标 / 文化遗址 / 探索地点
   * 形态：地域印记
   * 材质：青铜 / 古玉
   * 颜色：青铜绿 → 黄土色系
   */
  TERRAIN: {
    id: 'terrain_relic',
    label: '地形信物',
    description: '地标、文化遗址、探索地点的记忆印记。',
    forms: ['地域印记（regional seal）', '地形刻印（terrain carving）'],
    materials: ['青铜（bronze）', '古玉（antique jade）'],
    colors: ['bronze_green', 'earth_ocher'],
    prohibitions: [
      '现代地图UIC',
      'GPS定位图标',
      '打卡标记风格'
    ]
  },

  /**
   * 仪式信物（Ritual Relic）
   *
   * 对应：穴位（365穴位）/ 经络
   * 形态：穴位印记 / 经络刻线
   * 材质：古玉 / 银线
   * 颜色：月白色系
   */
  RITUAL: {
    id: 'ritual_relic',
    label: '仪式信物',
    description: '人体连接节点与网络对应的信物。穴位、经络。',
    sub_types: ['acupoint', 'meridian'],
    forms: {
      acupoint: '穴位印记（acupoint seal）',
      meridian: '经络刻线（meridian line tracing）'
    },
    materials: ['古玉（antique jade）', '银线（silver thread）'],
    colors: ['moon_white', 'silver_grey'],
    prohibitions: [
      '医学图表风格',
      '人体解剖图风格',
      '数据化标注'
    ]
  },

  /**
   * 回响信物（Echo Relic）
   *
   * 对应：神明祝福 / 宝物显现 / 回响
   * 形态：宝物符号 / 祝福印记
   * 材质：金 / 玉 / 朱砂
   * 颜色：暖金色 / 朱砂红
   */
  ECHO: {
    id: 'echo_relic',
    label: '回响信物',
    description: '神明祝福、宝物显现、回响的印记。被找回的连接中最具温度的存在。',
    forms: ['宝物符号（treasure symbol）', '祝福印记（blessing seal）'],
    materials: ['金（gold）', '玉（jade）', '朱砂（cinnabar）'],
    colors: ['warm_gold', 'cinnabar_red'],
    prohibitions: [
      'SSR边框特效',
      '游戏光柱',
      '获得动画式掉落'
    ]
  }
};



/**
 * ─────────────────────────────────────────────────────────
 *  二、形态定义（Form）
 * ─────────────────────────────────────────────────────────
 *
 * 每个信物由以下 5 个形态胶囊组合而成。
 * 形态是信物的骨架 — 决定信物是什么形状、什么轮廓。
 */
export const RELIC_FORMS = {

  /** 环形（Ring）— 完整性、循环、太极 */
  RING: {
    id: 'ring',
    label: '环形',
    description: '代表完整性、循环、太极。用于天象信物与天人合一。',
    css: ['revelation-core__ring', 'revelation-core__ring--inner']
  },

  /** 方形（Square）— 地、稳固、土地印记 */
  SQUARE: {
    id: 'square',
    label: '方形',
    description: '代表地之稳固、土地印记。用于地形信物。',
    css: 'relic-form__square'
  },

  /** 印章（Seal）— 印记、证实、存在记录 */
  SEAL: {
    id: 'seal',
    label: '印章',
    description: '代表印记、证实、存在记录。通用信物形态。',
    css: 'relic-form__seal'
  },

  /** 刻线（Line）— 路径、经络、连接 */
  LINE: {
    id: 'line',
    label: '刻线',
    description: '代表路径、经络、连接。用于仪式信物的经络刻线。',
    css: 'relic-form__inscription'
  },

  /** 符号（Symbol）— 文化原型、神明标记 */
  SYMBOL: {
    id: 'symbol',
    label: '符号',
    description: '代表文化原型、神明标记。用于回响信物的祝福印记。',
    css: 'relic-form__symbol'
  }
};

/**
 * 三、材质定义（Material）
 *
 * 信物的材质是视觉的第一识别要素。
 * 材质决定信物的「体温」与「时代感」。
 */
export const RELIC_MATERIALS = {

  /** 青玉（Celadon Jade）— 星的信物材质 */
  CELADON_JADE: {
    id: 'celadon_jade',
    label: '青玉',
    description: '星的信物材质。青铜绿色泽，温润内敛。',
    color: 'bronze_green',
    css_vars: {
      '--relic-material-base': '#3a5a48',
      '--relic-material-highlight': '#5a7a5e',
      '--relic-material-shadow': '#1a2a20',
      '--relic-material-glow': 'rgba(90, 122, 94, 0.28)'
    },
    surface: 'matte',
    reflection: 'low'
  },

  /** 古玉（Antique Jade）— 宿、四象、穴位的通用材质 */
  ANTIQUE_JADE: {
    id: 'antique_jade',
    label: '古玉',
    description: '宿、四象、穴位的通用材质。岁月温润感。',
    color: 'antique_green_gold',
    css_vars: {
      '--relic-material-base': '#4a5a3e',
      '--relic-material-highlight': '#7a8a62',
      '--relic-material-shadow': '#2a3420',
      '--relic-material-glow': 'rgba(122, 138, 98, 0.32)'
    },
    surface: 'polished',
    reflection: 'medium'
  },

  /** 青铜（Bronze）— 星宿、地形的次级材质 */
  BRONZE: {
    id: 'bronze',
    label: '青铜',
    description: '星宿、地形的次级材质。沉重、有历史感。',
    color: 'bronze_gold',
    css_vars: {
      '--relic-material-base': '#5a4a30',
      '--relic-material-highlight': '#8a7050',
      '--relic-material-shadow': '#2a2218',
      '--relic-material-glow': 'rgba(138, 112, 80, 0.3)'
    },
    surface: 'weathered',
    reflection: 'low'
  },

  /** 金箔（Gold Foil）— 四象的信物材质 */
  GOLD_FOIL: {
    id: 'gold_foil',
    label: '金箔',
    description: '四象的信物材质。薄金贴箔，层次丰富。',
    color: 'gold',
    css_vars: {
      '--relic-material-base': '#8a7040',
      '--relic-material-highlight': '#c8a860',
      '--relic-material-shadow': '#4a3820',
      '--relic-material-glow': 'rgba(200, 168, 96, 0.42)'
    },
    surface: 'foiled',
    reflection: 'high'
  },

  /** 银线（Silver Thread）— 经络的材质 */
  SILVER_THREAD: {
    id: 'silver_thread',
    label: '银线',
    description: '经络的材质。细线刻印，若有若无。',
    color: 'silver_white',
    css_vars: {
      '--relic-material-base': '#6a7a82',
      '--relic-material-highlight': '#a8b8c8',
      '--relic-material-shadow': '#384248',
      '--relic-material-glow': 'rgba(168, 184, 200, 0.22)'
    },
    surface: 'threaded',
    reflection: 'medium'
  },

  /** 朱砂（Cinnabar）— 回响信物的点缀材质 */
  CINNABAR: {
    id: 'cinnabar',
    label: '朱砂',
    description: '回响信物的点缀材质。朱红点印，温度感。',
    color: 'cinnabar_red',
    css_vars: {
      '--relic-material-base': '#6a2828',
      '--relic-material-highlight': '#b84838',
      '--relic-material-shadow': '#3a1818',
      '--relic-material-glow': 'rgba(184, 72, 56, 0.28)'
    },
    surface: 'pigment',
    reflection: 'low'
  }
};



/**
 * ─────────────────────────────────────────────────────────
 *  四、光效定义（Light）
 * ─────────────────────────────────────────────────────────
 *
 * 信物光的规则：
 *   - 光不是奖励特效 — 光是「被认出」的视觉证据
 *   - 所有信物光效必须使用 visual_language_v1 的三级光体系
 *   - 未点亮态：无主动光，仅材质本身的被动反射
 *   - 点亮态：微金呼吸光，从信物核心向外扩散
 *   - 收藏态：持续微光，亮度为点亮态的 40%
 */
export const RELIC_LIGHT = {

  /** 未点亮态（Dormant Light）— 信物未被认出的状态 */
  DORMANT: {
    label: '未点亮态',
    description: '信物未被认出。无主动光，仅材质本身的被动反射。',
    active_glow: false,
    field_energy: 0,
    opacity: 0.38,
    css: 'relic-light__dormant'
  },

  /** 点亮态（Active Light）— 信物被认出的瞬间 */
  ACTIVE: {
    label: '点亮态',
    description: '信物被认出。微金呼吸光，从核心向外扩散。',
    active_glow: true,
    field_energy: 0.72,
    opacity: 1,
    glow_params: {
      color: '--light-gold-core',
      radius_px: { min: 8, max: 24 },
      opacity_range: [0.42, 0.82],
      breath_rate: 0.95,
      pulse_duration_ms: 2800
    },
    css: 'relic-light__active'
  },

  /** 收藏态（Collection Light）— 信物被登记后的稳定状态 */
  COLLECTION: {
    label: '收藏态',
    description: '信物被登记后进入图鉴的稳定态。持续微光，亮度为点亮态的40%。',
    active_glow: true,
    field_energy: 0.32,
    opacity: 0.72,
    glow_params: {
      color: '--light-gold-soft',
      radius_px: { min: 4, max: 12 },
      opacity_range: [0.18, 0.38],
      breath_rate: 0.55,
      pulse_duration_ms: 4800
    },
    css: 'relic-light__collection'
  }
};

/**
 * ─────────────────────────────────────────────────────────
 *  五、能量轨迹（Flow）
 * ─────────────────────────────────────────────────────────
 *
 * 能量轨迹是信物在显现时刻释放的视觉信号。
 * 轨迹不是装饰 — 是信物与世界建立连接的「路径」。
 *
 * 所有轨迹必须遵守：
 *   - 非粒子爆炸
 *   - 非RPG特效
 *   - 非数字科技线
 */
export const RELIC_FLOWS = {

  /** 光尘沉降（Light Dust Fall）— 最安静的能量路径 */
  LIGHT_DUST: {
    id: 'light_dust',
    label: '光尘沉降',
    description: '最安静的能量路径。金色微尘从信物上方缓缓沉降。',
    duration_ms: { min: 1200, recommended: 1800, max: 2400 },
    easing: 'cubic-bezier(0.45, 0.05, 0.55, 0.95)',
    particle_count: { min: 6, max: 16 },
    particle_behavior: 'top-down gentle fall',
    prohibitions: ['向上喷射', '快速飞散', '闪烁']
  },

  /** 刻线蔓延（Line Trace）— 信物自身的纹路被逐一点亮 */
  LINE_TRACE: {
    id: 'line_trace',
    label: '刻线蔓延',
    description: '信物自身的纹路被逐一点亮。刻线从起点到终点缓缓浮现。',
    duration_ms: { min: 800, recommended: 1400, max: 2000 },
    easing: 'cubic-bezier(0.45, 0.05, 0.55, 0.95)',
    trace_direction: '起点 → 终点（依刻线拓扑）',
    prohibitions: ['闪烁描边', '往返扫描', '霓虹光效']
  },

  /** 场扩散（Field Ripple）— 信物周围的能量场向外扩散 */
  FIELD_RIPPLE: {
    id: 'field_ripple',
    label: '场扩散',
    description: '信物周围的能量场向外扩散。如一石入水，波纹渐远渐消。',
    duration_ms: { min: 1000, recommended: 1600, max: 2200 },
    easing: 'cubic-bezier(0.45, 0.05, 0.55, 0.95)',
    ripple_count: 2,
    max_radius_scale: 1.6,
    prohibitions: ['爆炸式扩散', '光圈闪烁', '旋转光环']
  },

  /** 连接线点亮（Connection Light）— 信物与图谱节点的路径连通 */
  CONNECTION_LIGHT: {
    id: 'connection_light',
    label: '连接线点亮',
    description: '信物与图谱节点的路径连通。一条金线从信物延伸至对应节点。',
    duration_ms: { min: 1200, recommended: 2000, max: 3000 },
    easing: 'cubic-bezier(0.45, 0.05, 0.55, 0.95)',
    trace_style: 'fluid_curve',
    prohibitions: ['直线连接', '科技网格线', '箭头指向']
  }
};



/**
 * ─────────────────────────────────────────────────────────
 *  六、显现动画（Reveal Motion）
 * ─────────────────────────────────────────────────────────
 *
 * 每个信物必须有三种动画状态：
 *   1. 生成动画（Unearth）— 首次被发现时的显现仪式
 *   2. 点亮动画（Activate）— 从收藏态到检视态的过渡
 *   3. 收藏态（Idle）— 在图鉴或列表中的稳定状态
 *
 * 所有动画遵循 VISUAL_LANGUAGE_V1 §四（REVELATION_MOTION）。
 */
export const RELIC_REVEAL_MOTION = {

  /**
   * 生成动画（Unearth Animation）
   *
   * 信物首次被发现时的完整显现仪式。
   * 流程：古籍背景显现 → 遮蔽消散 → 信物轮廓浮现 → 刻线逐一点亮 → 回响扩散
   *
   * 总时长：2000-4000ms
   * 情绪目标：重逢 → 确认 → 祝福 → 坚定
   */
  UNEARTH: {
    label: '生成动画',
    description: '首次发现信物的完整显现仪式。古籍背景 → 遮蔽消散 → 轮廓浮现 → 刻线点亮 → 回响扩散。',
    total_duration_ms: { min: 2000, recommended: 2800, max: 4000 },
    easing: 'cubic-bezier(0.45, 0.05, 0.55, 0.95)',
    phases: [
      {
        name: '古籍显现',
        range: [0, 0.20],
        action: 'relic_bg_fade_in + knowledge_layer_emerge',
        opacity_from: 0,
        opacity_to: 0.72,
        flow: 'none'
      },
      {
        name: '遮蔽消散',
        range: [0.20, 0.45],
        action: 'mist_dissipate + relic_form_appear',
        opacity_from: 0.72,
        opacity_to: 1,
        flow: 'none'
      },
      {
        name: '刻线浮现',
        range: [0.45, 0.65],
        action: 'line_trace + material_reveal',
        flow: 'LINE_TRACE'
      },
      {
        name: '场扩散',
        range: [0.65, 0.85],
        action: 'field_ripple + core_light_pulse',
        flow: 'FIELD_RIPPLE'
      },
      {
        name: '回响扩散',
        range: [0.85, 1.0],
        action: 'light_dust_settle + echo_fade',
        flow: 'LIGHT_DUST'
      }
    ],
    prohibitions: [
      '跳过任何phase',
      '总时长 < 1500ms',
      'SSR爆闪或全屏闪光',
      '旋转或翻转入场',
      '从屏幕外飞入'
    ]
  },

  /**
   * 点亮动画（Activate Animation）
   *
   * 用户从图鉴点开信物，进入检视态时的过渡动画。
   * 不需要完整仪式 — 只需从收藏微光过渡到主动光。
   */
  ACTIVATE: {
    label: '点亮动画',
    description: '从收藏态到检视态的过渡。收藏微光 → 核心光脉冲 → 刻线重新点亮 → 稳定显现光。',
    total_duration_ms: { min: 600, recommended: 1000, max: 1400 },
    easing: 'cubic-bezier(0.45, 0.05, 0.55, 0.95)',
    phases: [
      {
        name: '光脉冲',
        range: [0, 0.35],
        action: 'core_light_pulse + scale_breathe',
        from_energy: 0.32,
        to_energy: 0.88
      },
      {
        name: '刻线重亮',
        range: [0.35, 0.65],
        action: 'line_trace_quick',
        flow: 'LINE_TRACE'
      },
      {
        name: '稳定光',
        range: [0.65, 1.0],
        action: 'light_stabilize_at_active',
        target_energy: 0.72
      }
    ],
    prohibitions: [
      '重新执行完整生成仪式',
      '抖动或弹跳',
      '闪烁中途停止'
    ]
  },

  /**
   * 收藏态动效（Idle Animation）
   *
   * 信物在图鉴列表或收藏页面中的稳定状态。
   * 须为极低能耗动效。
   */
  IDLE: {
    label: '收藏态',
    description: '图鉴或收藏列表中的稳定状态。极低能耗的持续微光呼吸。',
    motion: {
      type: 'breath',
      breath_rate: 0.55,
      amplitude: 0.015,
      glow_opacity_range: [0.18, 0.38],
      glow_radius_px: { min: 4, max: 12 }
    },
    css: 'relic-light__collection',
    prohibitions: [
      '持续旋转',
      '闪烁',
      '粒子系统循环',
      '周期性高亮脉冲'
    ]
  }
};



/**
 * ─────────────────────────────────────────────────────────
 *  七、信物等级颜色映射（Relic Rank Color Map）
 * ─────────────────────────────────────────────────────────
 *
 * 信物等级只通过颜色表达。禁止使用尺寸或数值表达等级。
 *
 * 颜色体系：
 *   星（Star）       → 青铜绿（bronze_green）     — 等级 1
 *   宿（Lodge）      → 白银色（silver_white）     — 等级 2
 *   四象（Symbol）   → 金色（gold）                — 等级 3
 *   天（Heaven）     → 暖金阳鱼（warm_gold_yang）  — 等级 4
 *   人（Human）      → 月白阴鱼（moon_white_yin）  — 等级 5
 *   天人合一（Unity）→ 彩色太极（color_tai_chi）   — 终局
 *
 * 合规：RELIC_VISUAL_SYSTEM_V1 §十四
 */
export const RELIC_RANK_COLORS = {
  BRONZE_GREEN: {
    rank: 1,
    label: '青铜绿',
    description: '星的信物颜色。等级最低，数量最多。',
    hex: '#4a6a4a',
    css_var: '--color-bronze-green',
    glow_css_var: '--glow-bronze',
    relic_type: 'celestial_relic',
    sub_type: 'star'
  },
  SILVER_WHITE: {
    rank: 2,
    label: '白银色',
    description: '宿的信物颜色。28宿所对应。',
    hex: '#a8b8c8',
    css_var: '--color-silver-white',
    glow_css_var: '--glow-silver',
    relic_type: 'celestial_relic',
    sub_type: 'lodge'
  },
  GOLD: {
    rank: 3,
    label: '金色',
    description: '四象的信物颜色。青龙、朱雀、白虎、玄武。',
    hex: '#c8a860',
    css_var: '--color-relic-gold',
    glow_css_var: '--light-gold-core',
    relic_type: 'celestial_relic',
    sub_type: 'symbol'
  },
  WARM_GOLD_YANG: {
    rank: 4,
    label: '暖金阳鱼',
    description: '天体系信物（阳鱼）。天卷核心。',
    hex: '#d4b868',
    css_var: '--color-warm-gold',
    glow_css_var: '--light-gold',
    relic_type: null,
    sub_type: 'heaven'
  },
  MOON_WHITE_YIN: {
    rank: 5,
    label: '月白阴鱼',
    description: '人体系信物（阴鱼）。人卷核心。',
    hex: '#c8d0d8',
    css_var: '--color-moon-white',
    glow_css_var: '--light-platinum',
    relic_type: null,
    sub_type: 'human'
  },
  COLOR_TAI_CHI: {
    rank: 6,
    label: '彩色太极',
    description: '天人合一。唯一终局信物。无更高等级。',
    hex: null,
    css_var: '--color-tai-chi',
    glow_css_var: '--glow-tai-chi',
    relic_type: null,
    sub_type: 'unity',
    is_final: true
  }
};

/**
 * ─────────────────────────────────────────────────────────
 *  八、信物视觉协议（Relic Visual Protocol）
 * ─────────────────────────────────────────────────────────
 *
 * 信物类型 → 形态 → 材质 → 颜色 → 光 → 能量轨迹 → 显现动画
 * 的完整视觉映射表。
 *
 * 用于运行时根据信物类型生成完整的视觉配置。
 */
export const RELIC_VISUAL_MAP = {
  celestial_relic: {
    label: '天象信物',
    forms: ['RING', 'SEAL'],
    materials: ['CELADON_JADE', 'ANTIQUE_JADE', 'BRONZE', 'GOLD_FOIL'],
    colors: ['BRONZE_GREEN', 'SILVER_WHITE', 'GOLD'],
    light: ['DORMANT', 'ACTIVE', 'COLLECTION'],
    flows: ['LINE_TRACE', 'FIELD_RIPPLE', 'LIGHT_DUST'],
    reveal_motion: 'UNEARTH',
    rank_color_map: {
      star: 'BRONZE_GREEN',
      lodge: 'SILVER_WHITE',
      symbol: 'GOLD'
    },
    prohibitions: [
      '使用尺寸区分等级',
      '使用数值显示等级',
      '装备式金属边框'
    ]
  },
  terrain_relic: {
    label: '地形信物',
    forms: ['SQUARE', 'SEAL'],
    materials: ['BRONZE', 'ANTIQUE_JADE'],
    colors: ['BRONZE_GREEN'],
    light: ['DORMANT', 'ACTIVE', 'COLLECTION'],
    flows: ['LIGHT_DUST', 'FIELD_RIPPLE'],
    reveal_motion: 'UNEARTH',
    prohibitions: [
      '现代地图UI',
      'GPS定位图标',
      '打卡标记风格'
    ]
  },
  ritual_relic: {
    label: '仪式信物',
    forms: ['LINE', 'SEAL'],
    materials: ['ANTIQUE_JADE', 'SILVER_THREAD'],
    colors: ['SILVER_WHITE'],
    light: ['DORMANT', 'ACTIVE', 'COLLECTION'],
    flows: ['LINE_TRACE', 'CONNECTION_LIGHT'],
    reveal_motion: 'UNEARTH',
    prohibitions: [
      '医学图表风格',
      '人体解剖图风格',
      '数据化标注'
    ]
  },
  echo_relic: {
    label: '回响信物',
    forms: ['SYMBOL', 'RING'],
    materials: ['GOLD_FOIL', 'ANTIQUE_JADE', 'CINNABAR'],
    colors: ['GOLD', 'WARM_GOLD_YANG'],
    light: ['DORMANT', 'ACTIVE', 'COLLECTION'],
    flows: ['LIGHT_DUST', 'FIELD_RIPPLE', 'CONNECTION_LIGHT'],
    reveal_motion: 'UNEARTH',
    prohibitions: [
      'SSR边框特效',
      '游戏光柱',
      '获得动画式掉落'
    ]
  }
};



/**
 * ─────────────────────────────────────────────────────────
 *  九、视觉验收函数（Visual Validation）
 * ─────────────────────────────────────────────────────────
 *
 * 运行时检查信物视觉配置是否合规。
 * 用于开发调试与设计评审。
 */

/**
 * 验证信物类型是否为已定义类型。
 * @param {string} type - relic type id
 * @returns {boolean}
 */
export function isValidRelicType(type) {
  return !!RELIC_VISUAL_MAP[type];
}

/**
 * 验证信物视觉配置的完整性。
 * 返回缺失字段列表。
 *
 * @param {string} type - relic type id
 * @param {object} visualConfig - 信物视觉配置
 * @returns {{ valid: boolean, missing: string[] }}
 */
export function validateRelicVisualConfig(type, visualConfig) {
  var required = ['form', 'material', 'color', 'light', 'flow', 'reveal_motion'];
  var missing = [];
  var i;
  for (i = 0; i < required.length; i += 1) {
    if (!visualConfig || !visualConfig[required[i]]) {
      missing.push(required[i]);
    }
  }

  if (!isValidRelicType(type)) {
    missing.push('valid_relic_type');
  }

  return {
    valid: missing.length === 0,
    missing: missing
  };
}

/**
 * 获取信物类型对应的完整视觉默认值。
 * @param {string} type - relic type id
 * @returns {object|null} 默认视觉配置，或 null（类型无效）
 */
export function getDefaultVisualConfig(type) {
  var map = RELIC_VISUAL_MAP[type];
  if (!map) return null;

  return {
    type: type,
    form: map.forms[0],
    material: map.materials[0],
    color: map.colors[0],
    light: 'DORMANT',
    flow: map.flows[0],
    reveal_motion: map.reveal_motion
  };
}

/**
 * ─────────────────────────────────────────────────────────
 *  十、系统版本信息
 * ─────────────────────────────────────────────────────────
 */
export const RELIC_VISUAL_SYSTEM_META = {
  name: 'RELIC_VISUAL_SYSTEM_V1',
  status: 'ACTIVE',
  version: '1.0.0',
  date: '2026-06-27',
  canon_formula: '古籍 × 古玉 × 显现 = LOVEQIGU 标准信物',
  frozen_specs: [
    'docs/art/RELIC_VISUAL_SYSTEM_V1.md (FROZEN)',
    'docs/product/relic_system/RELIC_CANON_V2.md (FROZEN)',
    'docs/product/relic_system/RELIC_VISUAL_CANON_V1.md'
  ],
  runtime_references: [
    'system/visual/visual_language_v1.js (VISUAL_KEYWORDS, REVELATION_MOTION, RELIC_VISUAL_PROTOCOL)',
    'system/world_engine/relic_system.js (createRelic, storeRelic)',
    'system/visual/visual_tokens.css (CSS custom properties)'
  ],
  relic_types: ['celestial_relic', 'terrain_relic', 'ritual_relic', 'echo_relic'],
  states: ['DORMANT', 'ACTIVE', 'COLLECTION'],
  prohibitions_check: [
    '是否具有古籍感',
    '是否具有信物感',
    '是否具有显现感',
    '是否符合东方气质',
    '是否避免游戏化',
    '是否避免卡牌化',
    '是否避免NFT化',
    '是否支持批量生产'
  ]
};
