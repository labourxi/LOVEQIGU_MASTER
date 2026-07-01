// ═════════════════════════════════════════════════════════════════════
// CONTENT WORLD SEED — MY PAGE
//
// Narrative enrichment for personal profile, stats, and biography.
// Every stat has a narrative interpretation, not just a number.
//
// RULE: No "已完成/未完成/暂无" system text.
// Every user's data reads like a "personal exploration biography".
// ═════════════════════════════════════════════════════════════════════

var MY_WORLD_SEED = Object.freeze({

  // ─── STAT NARRATIVE INTERPRETATIONS ───
  // These functions convert raw numbers into narrative text.
  statNarratives: Object.freeze({
    // Exploration progress
    exploreProgress: function(visited, total) {
      var ratio = total > 0 ? visited / total : 0;
      if (ratio === 0) return '探索尚未开始，世界在等待你的第一步';
      if (ratio < 0.25) return '初入之境，你的足迹正在打开世界的封印';
      if (ratio < 0.5) return '渐入深处，世界的回响越来越清晰';
      if (ratio < 0.75) return '行至中程，你已经触碰到了世界的脉络';
      if (ratio < 1) return '接近终点，归途的光已在远处显现';
      return '圆满——你已经走过了这个世界的全部角落';
    },

    // Relic discovery
    relicInterpretation: function(count, total) {
      if (count === 0) return '沉睡的印记尚未被唤醒。世界深处仍有未被触碰的回响。';
      if (count < 3) return '几枚印记已被唤醒，它们在世界的记忆中等到了你。';
      if (count < 6) return '越来越多的印记汇聚在你身边。世界正在通过它们与你对话。';
      if (count < total) return '你已经收集了大部分信物。世界的全貌正在显现。';
      return '所有的信物都已觉醒。你与世界之间建立了完整的回响链。';
    },

    // Points accumulation
    pointsInterpretation: function(totalPoints) {
      if (totalPoints === 0) return '心愿尚未开始积累。';
      if (totalPoints < 10) return '心愿值正在汇聚，如晨露般悄然积累。';
      if (totalPoints < 30) return '你的心愿值正在生长，世界感知到了你的存在。';
      if (totalPoints < 60) return '心愿值已成涓涓细流，你的探索正转化为可见的回馈。';
      return '心愿值如星河般汇聚，世界为你留下了丰厚的回响。';
    },

    // Collectibles
    collectibleInterpretation: function(count) {
      if (count === 0) return '数字形态的记忆尚未生成。';
      if (count < 3) return '几段记忆已经被转化为可见的形态。';
      if (count < 6) return '越来越多的印记展露出了它们的完整面貌。';
      return '你已收集了大量记忆的实体形态。';
    },

    // Level narrative
    levelNarrative: function(visited) {
      if (visited === 0) return '待行之人';
      if (visited < 3) return '初行旅者';
      if (visited < 5) return '寻迹之人';
      if (visited < 8) return '深境探索者';
      if (visited < 10) return '世界穿行者';
      return '归真者——世界的见证人';
    },

    // Biography suggestion
    bioSuggestion: function(visited, relicCount) {
      if (visited === 0 && relicCount === 0) return '尚未留下足迹的探索者。世界在等待你的第一步。';
      if (visited <= 3) return '刚刚踏入世界边缘的旅者，几枚印记已在掌中。';
      if (visited <= 6) return '行过半数之境，手中已有回响的实体。世界不再沉默。';
      return '遍历山河的寻迹者，世界的语言你已经大致懂得。';
    }
  }),

  // ─── LEVEL DEFINITIONS ───
  levels: Object.freeze([
    { threshold: 0, label: '待行的旅者', description: '尚未出发，但路已在前方展开' },
    { threshold: 1, label: '初行探索者', description: '第一步已经迈出，世界开始回应' },
    { threshold: 3, label: '逐迹之人', description: '足迹渐深，世界的轮廓正在显现' },
    { threshold: 5, label: '深境寻迹者', description: '你已经看到了世界表层之下的脉络' },
    { threshold: 8, label: '世界穿行者', description: '世界的语言你已大致听懂' },
    { threshold: 10, label: '归真者', description: '你走过了一切，回到了开始的地方——但一切已经不同' }
  ]),

  // ─── QUICK ACTION NARRATIVES ───
  quickActions: Object.freeze({
    editProfile: { label: '刻下你的名字', description: '在世界中留下你的印记' },
    viewRelics: { label: '查看信物档案', description: '打开你已经唤醒的回响' },
    viewRights: { label: '礼遇回廊', description: '探索的回报正在等待你' },
    viewCollection: { label: '印记长廊', description: '所有痕迹的沉淀之所' }
  }),

  // ─── FUNCTION MODULE NARRATIVES ───
  functionModules: Object.freeze({
    exploreRecord: { label: '探索足迹', description: '你的每一次踏足都被世界记住了' },
    relicArchive: { label: '信物档案', description: '被唤醒的回响——一枚印记一个故事' },
    rightsCenter: { label: '礼遇回廊', description: '探索正在转化为世界的回馈' },
    collection: { label: '印记长廊', description: '所有痕迹的沉淀之所' }
  }),

  // ─── EMPTY STATE NARRATIVES ───
  emptyState: Object.freeze({
    message: '你的故事尚未开始书写',
    submessage: '世界在等待第一个脚步。前往探索页面，踏出属于你的第一步。',
    emptyHint: '每一个旅者都是从第一步开始的'
  }),

  // ─── DEFAULT PROFILE NARRATIVES ───
  defaultProfile: Object.freeze({
    name: '未命名的旅者',
    bio: '尚未留下描述。世界在等待你写下第一行属于自己的文字。',
    avatarSymbol: '◈',
    joinMessage: '游离之域',
    lastVisitUnknown: '尚未记录'
  }),

  // ─── RECENT POINTS NARRATIVES ───
  recentPointNarratives: Object.freeze({
    visited: '已行',
    pending: '未至',
    visitedLabel: '足迹已留',
    pendingLabel: '等待踏足'
  }),

  // ─── SECTION NARRATIVES ───
  sections: Object.freeze({
    stats: '你的探索图谱',
    recentActivity: '最近的足迹',
    quickActions: '行动的印记',
    modules: '世界的入口'
  })
});

module.exports = MY_WORLD_SEED;
