// ═════════════════════════════════════════════════════════════════════
// CONTENT WORLD SEED — RIGHTS PAGE
//
// Narrative enrichment for rewards, coupons, and rights history.
// Each reward gets: ritual meaning, emotional tone, usage scenario.
//
// RULE: Every item reads like a "ritual reward", not a coupon.
// No system language. No "折扣" / "兑换" as primary narrative.
// ═════════════════════════════════════════════════════════════════════

var RIGHTS_WORLD_SEED = Object.freeze({

  // ─── POINT NARRATIVES ───
  points: Object.freeze({
    cardTitle: '心愿值',
    cardSubtitle: '你的探索正在被世界记住',
    todayEarned: '今日收获',
    totalEarned: '累计心愿',
    progressLabel: '探索进度',
    emptyDescription: '尚未开始积累，踏上第一步就会收到世界的回应。',
    narrativeInterpretation: function(current, todayTotal, totalAll) {
      if (totalAll === 0) return '你的世界尚未留下足迹';
      if (totalAll < 5) return '初醒的印记正在汇聚';
      if (totalAll < 20) return '世界开始感知你的存在';
      if (totalAll < 50) return '你的回声正在扩散';
      return '你已经与世界建立了深厚的回响';
    }
  }),

  // ─── CHECK-IN REWARD NARRATIVE ───
  checkIn: Object.freeze({
    name: '每日签到——与世界的对话',
    description: '每一天的踏足都是一次仪式。世界在等待你今日的回响。',
    claimedDescription: '今日的对话已经完成。世界听到了你的声音。',
    meta: '今日尚未向世界发声',
    claimedMeta: '今日已与世界对话'
  }),

  // ─── EXPLORATION REWARD NARRATIVE ───
  explorationReward: Object.freeze({
    name: '探索回响奖励',
    description: '每一次AR探索都是一次触碰。世界会用心愿值回应你的到来。',
    meta: '每一次探访 +1 心愿值'
  }),

  // ─── COUPON REWARD NARRATIVES ───
  // Keyed by coupon id
  coupons: Object.freeze({
    coupon_aqg_cafe_tea: Object.freeze({
      ritualName: '桂花酿——冬日温存',
      ritualDescription: '一杯桂花酿茶，是探索途中最好的慰藉。茶香里藏着雾林的气息。',
      emotionalTone: '温暖 · 安定 · 归来',
      usageScenario: '探索归来后在爱企谷茶舍静坐片刻，让热茶的温度从指尖传到心底。',
      narrativeSource: '四象入口的记忆在此发酵'
    }),

    coupon_aqg_bookstore_mark: Object.freeze({
      ritualName: '书页书签——未读完的篇章',
      ritualDescription: '一枚书签，嵌入你未读完的故事。每一页都是一次停留。',
      emotionalTone: '安静 · 沉思 · 期待',
      usageScenario: '在爱企谷书驿的角落里翻开一本书，让书签标记你的沉思时刻。',
      narrativeSource: '残卷阁的墨迹化作了书页间的标记'
    }),

    coupon_aqg_craft_stamp: Object.freeze({
      ritualName: '手作印章——亲手刻下的印记',
      ritualDescription: '在手作坊里亲手制作一枚印章，将你的探索印记刻在实物上。',
      emotionalTone: '创造 · 沉浸 · 专注',
      usageScenario: '在爱企谷手作坊花一个下午做一枚属于自己的印章，每一次盖章都是一次签名。',
      narrativeSource: '石径上的刻痕教会了你用双手留下印记'
    }),

    coupon_aqg_gate_pin: Object.freeze({
      ritualName: '归途徽章——旅者的标识',
      ritualDescription: '一枚纪念徽章，佩戴它的人都是曾经走过归真之门的旅者。',
      emotionalTone: '归属 · 纪念 · 认同',
      usageScenario: '将它别在背包上，每一次低头看到它都会想起那条金色的归途。',
      narrativeSource: '归真之门的光凝结成了一枚可以带走的记忆'
    }),

    coupon_aqg_stargazer_map: Object.freeze({
      ritualName: '星图明信片——寄给远方的自己',
      ritualDescription: '一张印着你专属星图的明信片，寄给未来的你。星辰会记得今天的选择。',
      emotionalTone: '温柔 · 遥远 · 期许',
      usageScenario: '在爱企谷茶舍写完这张明信片，交给时间。未来的你会收到来自过去的问候。',
      narrativeSource: '星痕池底的星图被拓印在了纸上'
    })
  }),

  // ─── COLLECTIBLE REWARD NARRATIVES ───
  collectibleRewards: Object.freeze({
    col_aqg_poster: Object.freeze({
      ritualName: '探索海报——旅程的视觉诗',
      ritualDescription: '你的探索轨迹在海报上连成了一条路。不是地图，而是诗。',
      emotionalTone: '纪念 · 见证 · 骄傲',
      usageScenario: '将它贴在墙上的那一刻，整个世界的记忆都会涌回来。'
    }),
    col_aqg_photo_frame: Object.freeze({
      ritualName: '雾林相框——光的篆文',
      ritualDescription: '一张照片，装着一个时刻——光穿过树冠，在地上写下了一行无人能读的诗。',
      emotionalTone: '宁静 · 神秘 · 珍贵',
      usageScenario: '放在书桌上，每天瞥见它都会想起那片雾气。'
    }),
    col_aqg_social_card: Object.freeze({
      ritualName: '回声卡——你的频率',
      ritualDescription: '你的脚步在回声台上被翻译成了一组记号。这是世界独有的语言来记住你的方式。',
      emotionalTone: '独特 · 亲密 · 呼应',
      usageScenario: '分享给别人时，他们看到的是图案，你看到的是自己的脚步。'
    }),
    col_aqg_invite_card: Object.freeze({
      ritualName: '归途邀请——回望的光',
      ritualDescription: '一封来自归真之门的光做成的邀请函。它不邀请你去哪里，只是邀请你回望来路。',
      emotionalTone: '深沉 · 温柔 · 圆满',
      usageScenario: '在感到迷茫时打开它，它会让你想起自己已经走了多远。'
    }),
    col_aqg_star_map: Object.freeze({
      ritualName: '星痕图鉴——天上你的路',
      ritualDescription: '你在爱企谷走的每一步都被星星记录了。这幅星图只属于你。',
      emotionalTone: '辽阔 · 永恒 · 归属',
      usageScenario: '在晴朗的夜晚仰望星空，你会找到自己的那条轨迹。'
    }),
    col_aqg_memory_scroll: Object.freeze({
      ritualName: '残卷复刻——完成的篇章',
      ritualDescription: '散落的文字终于聚齐。不是你写的，但被你完成的。',
      emotionalTone: '完整 · 释然 · 成就',
      usageScenario: '展开它，读一读那些跨越时间重新组合的文字。这是一个完整的闭环。'
    })
  }),

  // ─── REWARD FEED NARRATIVES ───
  feedNarratives: Object.freeze({
    exploreEarn: '探索回响',
    claimRedeem: '印记兑换',
    couponUse: '礼遇使用',
    systemGrant: '世界馈赠'
  }),

  // ─── REWARD HISTORY NARRATIVES ───
  historyLabels: Object.freeze({
    current: '当前心愿',
    today: '今日回响',
    total: '累计回声',
    claimed: '已实现的礼遇'
  }),

  // ─── EMPTY STATE NARRATIVES ───
  emptyState: Object.freeze({
    message: '礼遇长廊尚未点亮',
    submessage: '每一次探索都会在这里留下回馈。踏上探索之旅，心愿值将开始积累。',
    emptyHint: '世界不会忘记任何一个踏足者'
  }),

  // ─── PAGE NARRATIVES ───
  pageNarratives: Object.freeze({
    title: '礼遇回廊',
    subtitle: '你的探索正在转化为世界的回赠',
    kicker: '回响'
  })
});

module.exports = RIGHTS_WORLD_SEED;
