// ═════════════════════════════════════════════════════════════════════
// V5.9 UI TOKEN SYSTEM — STANDALONE REFERENCE
//
// BIBLE COMPLIANCE (LEVEL 1): docs/art/ART_03_VISUAL_PHILOSOPHY_V1.md
// BIBLE COMPLIANCE (LEVEL 1): docs/art/FOUR_SYMBOL_VISUAL_SYSTEM_V1.md
//
// Single source of truth for ALL visual tokens.
// Mirrors the tokens in core/visual/global_visual_injector.js
// but as a standalone reference for designers and new pages.
//
// RULES:
//   - ALL pages MUST follow these tokens
//   - ALL tokens MUST conform to Visual Bible palette
//   - NO inline custom values per page
//   - Every token is frozen at definition
// ═════════════════════════════════════════════════════════════════════

var TOKENS = Object.freeze({

  // ─── Palette (Gold / Warm neutral system) ───
  palette: Object.freeze({
    gold: '#C8A24A',
    goldLight: '#E8D8B4',
    goldDark: '#A08030',
    neutralBg: '#F4F1EB',
    neutralDark: '#263A34',
    neutralMid: '#6B5E4A',
    neutralText: '#111827',
    mutedText: 'rgba(38, 58, 52, 0.35)',
    cardBg: '#FAF8F4',
    pageBg: '#F4F1EB',
    heroBgStart: '#0F2A22',
    heroBgEnd: '#0F2A22',
    white: '#FFFFFF',
    borderSubtle: 'rgba(38, 58, 52, 0.06)',
    borderCard: 'rgba(200, 162, 74, 0.10)',
    borderCardActive: 'rgba(200, 162, 74, 0.25)'
  }),

  // ─── Spacing scale (in rpx) ───
  spacing: Object.freeze({
    xs: 8,
    sm: 12,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
    section: 32
  }),

  // ─── Border radius ───
  radius: Object.freeze({
    card: '20rpx',
    cardSmall: '16rpx',
    modal: '24rpx',
    button: '999rpx',
    badge: '999rpx',
    avatar: '50%'
  }),

  // ─── Card system ───
  card: Object.freeze({
    padding: '24rpx',
    paddingLarge: '28rpx 24rpx',
    bg: '#FAF8F4',
    border: '1rpx solid rgba(200, 162, 74, 0.10)',
    borderWidth: '1rpx',
    borderColor: 'rgba(200, 162, 74, 0.10)',
    shadowLevel1: '0 2rpx 12rpx rgba(38, 58, 52, 0.04)',
    shadowLevel2: '0 4rpx 16rpx rgba(38, 58, 52, 0.06)'
  }),

  // ─── Typography hierarchy ───
  typography: Object.freeze({
    title: {
      size: '40rpx',
      weight: 700,
      color: '#263A34',
      letterSpacing: '4rpx'
    },
    subtitle: {
      size: '24rpx',
      weight: 300,
      color: 'rgba(38, 58, 52, 0.35)',
      letterSpacing: '2rpx'
    },
    sectionTitle: {
      size: '30rpx',
      weight: 700,
      color: '#0F2A22'
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
    },
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
    goldTitle: {
      size: '36rpx',
      weight: 700,
      color: '#C8A24A'
    }
  }),

  // ─── Empty state ───
  emptyState: Object.freeze({
    iconSize: '64rpx',
    iconColor: 'rgba(200, 162, 74, 0.12)',
    textSize: '26rpx',
    textColor: 'rgba(38, 58, 52, 0.35)',
    hintSize: '24rpx',
    hintColor: 'rgba(38, 58, 52, 0.20)'
  }),

  // ─── Page padding ───
  page: Object.freeze({
    paddingHorizontal: '28rpx',
    paddingBottom: '120rpx',
    sectionGap: '32rpx'
  })
});

module.exports = TOKENS;
