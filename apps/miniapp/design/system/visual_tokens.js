// ═════════════════════════════════════════════════════════════════════
// V5.9 VISUAL SYSTEM CONTRACT — SINGLE SOURCE OF TRUTH
//
// BIBLE COMPLIANCE (LEVEL 1): docs/art/ART_03_VISUAL_PHILOSOPHY_V1.md
// BIBLE COMPLIANCE (LEVEL 1): docs/art/FOUR_SYMBOL_VISUAL_SYSTEM_V1.md
//
// THIS FILE IS THE CONTRACT. All pages MUST use these tokens only.
// No page-specific custom colors, radii, spacing, or typography.
//
// TOKEN VIOLATION RULES:
//   - If a value differs from this contract, the page is NON-COMPLIANT
//   - Exceptions require explicit Architecture Decision Record (ADR)
//   - Landing page atmosphere layer is exempt (visual-only, not UI)
//
// RENDER TARGET: WeChat Mini Program WXSS
// UNIT CONVENTION: All sizes in rpx (WeChat relative unit)
//   - 2rpx = 1px at default screen width
// ═════════════════════════════════════════════════════════════════════

var CONTRACT = Object.freeze({

  // ─── COLOR SYSTEM ──────────────────────────────────────────────
  // All pages share the same base palette.
  // No page-specific color overrides allowed.
  color: Object.freeze({

    // Primary accent — warm gold
    // Used for: CTAs, active states, stat highlights, badge emphasis
    gold:         '#C8A24A',
    goldLight:    '#E8D8B4',
    goldDark:     '#A08030',

    // Background — deep neutral dark
    // Page background for ALL content pages
    bgDark:       '#0A1A14',

    // Surface — soft dark gray
    // Card backgrounds, modal surfaces
    surface:      '#FAF8F4',

    // Text hierarchy
    textPrimary:  '#263A34',
    textSecondary:'rgba(38, 58, 52, 0.55)',
    textMuted:    'rgba(38, 58, 52, 0.35)',
    textFaint:    'rgba(38, 58, 52, 0.20)',

    // Hero text (on dark background)
    heroText:     '#FFFFFF',
    heroSecondary:'rgba(255, 255, 255, 0.82)',
    heroMuted:    'rgba(255, 255, 255, 0.45)',

    // Borders
    borderSubtle: 'rgba(38, 58, 52, 0.06)',
    borderCard:   'rgba(200, 162, 74, 0.10)',
    borderCardActive: 'rgba(200, 162, 74, 0.25)',

    // Misc
    goldGlow:     'rgba(200, 162, 74, 0.12)',
    goldEmphasis: 'rgba(200, 162, 74, 0.20)',
    white:        '#FFFFFF'
  }),

  // ─── SPACING SCALE ─────────────────────────────────────────────
  // ONLY these values may be used for margins, padding, gaps.
  // No ad-hoc spacing values.
  spacing: Object.freeze({
    xs:  '8rpx',
    sm:  '12rpx',
    md:  '16rpx',
    lg:  '24rpx',
    xl:  '32rpx',
    xxl: '40rpx'
  }),

  // ─── BORDER RADIUS ─────────────────────────────────────────────
  // Card radius is the same everywhere.
  // Only AR/CTA may use a different radius.
  radius: Object.freeze({
    card:      '20rpx',
    cardLarge: '24rpx',
    cardSmall: '16rpx',
    pill:      '999rpx',
    modal:     '24rpx',
    avatar:    '50%'
  }),

  // ─── SHADOW SYSTEM ─────────────────────────────────────────────
  // Level 1: default card elevation
  // Level 2: emphasis (AR button, primary CTA only)
  shadow: Object.freeze({
    level1: '0 2rpx 12rpx rgba(38, 58, 52, 0.04)',
    level2: '0 4rpx 16rpx rgba(38, 58, 52, 0.06)'
  }),

  // ─── TYPOGRAPHY HIERARCHY ──────────────────────────────────────
  // ALL pages MUST use these sizes/weights/colors.
  // No custom typography per page.
  typography: Object.freeze({
    heroTitle: {
      size: '44rpx',
      weight: 800,
      color: '#FFFFFF'
    },
    heroSubtitle: {
      size: '26rpx',
      weight: 400,
      color: 'rgba(255, 255, 255, 0.82)'
    },
    title: {
      size: '40rpx',
      weight: 700,
      color: '#263A34',
      letterSpacing: '4rpx'
    },
    titleGold: {
      size: '36rpx',
      weight: 700,
      color: '#C8A24A'
    },
    sectionTitle: {
      size: '30rpx',
      weight: 700,
      color: '#0F2A22'
    },
    sectionSubtitle: {
      size: '24rpx',
      weight: 300,
      color: 'rgba(38, 58, 52, 0.35)',
      letterSpacing: '2rpx'
    },
    body: {
      size: '26rpx',
      weight: 400,
      color: '#263A34'
    },
    caption: {
      size: '22rpx',
      weight: 400,
      color: 'rgba(38, 58, 52, 0.35)'
    },
    small: {
      size: '20rpx',
      weight: 400,
      color: 'rgba(38, 58, 52, 0.20)'
    }
  }),

  // ─── CARD SYSTEM ───────────────────────────────────────────────
  // All cards share identical style.
  card: Object.freeze({
    padding:      '24rpx',
    paddingLarge: '28rpx 24rpx',
    bg:           '#FAF8F4',
    border:       '1rpx solid rgba(200, 162, 74, 0.10)',
    radius:       '20rpx',
    shadow:       '0 2rpx 12rpx rgba(38, 58, 52, 0.04)',
    heroBg:       'rgba(255, 255, 255, 0.1)',
    heroBorder:   '1rpx solid rgba(255, 255, 255, 0.12)'
  }),

  // ─── EMPTY STATE ───────────────────────────────────────────────
  // ALL empty states use the same visual layout.
  // Text content is page-specific but format is unified.
  emptyState: Object.freeze({
    iconSize:  '64rpx',
    iconColor: 'rgba(200, 162, 74, 0.12)',
    textSize:  '26rpx',
    textColor: 'rgba(38, 58, 52, 0.35)',
    hintSize:  '24rpx',
    hintColor: 'rgba(38, 58, 52, 0.20)',
    padding:   '120rpx 40rpx'
  }),

  // ─── PAGE LAYOUT ───────────────────────────────────────────────
  page: Object.freeze({
    bg:            '#F4F1EB',
    paddingH:      '28rpx',
    paddingBottom: '120rpx',
    sectionGap:    '32rpx'
  })
});

module.exports = CONTRACT;
