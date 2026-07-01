// ═════════════════════════════════════════════════════════════════════
// CONTENT WORLD SEED — COLLECTION PAGE
//
// Narrative enrichment for every relic, collectible, and AR event.
// Each item gets: origin story, symbolic meaning, emotional narrative,
// and "被唤醒原因" (why it was awakened).
//
// RULE: No system text. Every entry reads like a "story fragment".
// ═════════════════════════════════════════════════════════════════════

var COLLECTION_WORLD_SEED = Object.freeze({

  // ─── RELIC NARRATIVES ───
  // Keyed by relic id. Each relic's narrative layer.
  relics: Object.freeze({

    relic_aqg_01: Object.freeze({
      originStory: '四象入口处的金色纹路在雾气中显现，像是被你的到来唤醒。石柱上的刻痕缓缓移动，一枚碎片从地面升起。',
      symbolicMeaning: '四象残片是世界的起点印记。它代表觉醒——第一眼看见世界时的震动。',
      emotionalNarrative: '第一次触碰世界边缘时，它也在触碰你。',
      awakenReason: '你踏入了入口广场，封印感知到了你的存在。',
      poemFragment: '雾起石扉开，金光入眼来。'
    }),

    relic_aqg_02: Object.freeze({
      originStory: '雾林深处的一棵古木下，树根缠绕着一枚木质残片。当你靠近，树皮上的纹路仿佛活了过来，如经络般微微脉动。',
      symbolicMeaning: '木之残片代表生长与记忆。每一圈年轮都是一次生命的刻度。',
      emotionalNarrative: '树不会说话，但它记得每一个经过的人。',
      awakenReason: '你在古木前驻足，树感知到了你的呼吸。',
      poemFragment: '林深雾重处，木有未言时。'
    }),

    relic_aqg_03: Object.freeze({
      originStory: '石径上某块刻痕最深的石板在你走过时发出低沉的共鸣。翻开表面的尘土，下面露出一枚石质碎片，上面刻着半个符号。',
      symbolicMeaning: '石中星痕是时间的化石。它记录了一段被遗忘的行走。',
      emotionalNarrative: '石头不会遗忘，它只是等待。',
      awakenReason: '你的脚步与千百年前的某一步重叠了。',
      poemFragment: '石上痕犹在，人间步已迁。'
    }),

    relic_aqg_04: Object.freeze({
      originStory: '回声台的凹痕中，一枚透明的晶状体在共鸣中微微发光。当你接近，能感受到空气中有微弱的震动——像是某种回应。',
      symbolicMeaning: '风中回响是时间的涟漪。每一个声音都不会真正消失。',
      emotionalNarrative: '声音离开后，回声会在世界某处继续旅行。',
      awakenReason: '你的脚步在回声台上激起了一缕未被听见的声波。',
      poemFragment: '声已随风去，余韵在山中。'
    }),

    relic_aqg_05: Object.freeze({
      originStory: '祈愿台的北斗七星刻痕中，有一颗星在你的注视下缓缓亮起。香灰处升起一缕细细的青烟，在星光中消散。',
      symbolicMeaning: '未亮心愿是尚未被兑现的愿望。星辰接收了它，但需要时间回应。',
      emotionalNarrative: '愿望一旦说出，就不再只属于你一个人。',
      awakenReason: '你的目光落在了北斗七星中最暗淡的那颗星上。',
      poemFragment: '星有未明处，愿在无声时。'
    }),

    relic_aqg_06: Object.freeze({
      originStory: '残卷阁案上散落的卷轴中，有一段文字在你触碰的瞬间重新显现。墨迹从褪色中恢复，像是一个句子刚刚被完成。',
      symbolicMeaning: '墨中残章是未完成的故事。每一个字符都在等待最后一个读者。',
      emotionalNarrative: '被中断的文字会自己寻找续写的人。',
      awakenReason: '你触碰了一卷被遗忘的残页，墨迹感知到了温度。',
      poemFragment: '残墨逢人暖，旧字自生光。'
    }),

    relic_aqg_07: Object.freeze({
      originStory: '星痕池的水面突然泛起涟漪，一枚发光的碎片从池底缓缓上升。水中的星图重新排列，像是在为你指引方向。',
      symbolicMeaning: '水中星碎是坠落的星辰。它们落入水中不是为了熄灭，而是为了等待被捞起。',
      emotionalNarrative: '星辰从未真正坠落，它们只是选择了不同的容器。',
      awakenReason: '你凝视水面时，池底的星光感知到了你的目光。',
      poemFragment: '星落寒潭底，待君一掬光。'
    }),

    relic_aqg_08: Object.freeze({
      originStory: '风语桥上的一条褪色布条突然绷直，像是被什么力量拉住。风在这一刻停住了。布条上浮现出一行字迹，随即又被风带走。',
      symbolicMeaning: '风过留痕是消息的证明。风虽然无形，但它经过的地方都会留下痕迹。',
      emotionalNarrative: '风会把你的消息带给每一个等待的人。',
      awakenReason: '一阵不寻常的风在桥上停驻了刹那。',
      poemFragment: '风过留痕处，消息在人间。'
    })
  }),

  // ─── COLLECTIBLE NARRATIVES ───
  collectibles: Object.freeze({

    col_aqg_poster: Object.freeze({
      originStory: '你的探索足迹在爱企谷的地图上连成了一条发光的小径。这幅海报记录了你的起点，是旅程的第一份物证。',
      symbolicMeaning: '探索海报是地图上第一条被点亮的线路。它证明你曾经踏足这个世界。',
      emotionalNarrative: '每一段旅程都需要一个见证者。',
      awakenReason: '当你完成第一次AR探索，世界的记录者就开始绘制你的轨迹。'
    }),

    col_aqg_photo_frame: Object.freeze({
      originStory: '雾林的雾气在你的镜头前呈现出奇特的图案——一缕光穿过树冠，在地上投下如篆文般的树影。',
      symbolicMeaning: '雾林相框里装的不是风景，而是森林的语言。',
      emotionalNarrative: '有些美景不是为了被拍下来，而是为了被记住。',
      awakenReason: '你在雾林深处捕捉到了光与影的篆文。'
    }),

    col_aqg_social_card: Object.freeze({
      originStory: '回声台录下了你的脚步声，并将其转化成一串记号。这张卡片上的图案就是你脚步的频率——世界在用它听得懂的语言回应你。',
      symbolicMeaning: '回声卡是你与世界对话的记录。你的每一句话都会被记住。',
      emotionalNarrative: '世界会用你的语言回答你。',
      awakenReason: '你在回声台上留下了一组脚步声，世界将它翻译成了图案。'
    }),

    col_aqg_invite_card: Object.freeze({
      originStory: '归真之门前，一缕光在门缝中穿梭，编织成一张发光的邀请函。它不是让你进入，而是让你回忆起你已经走过的路。',
      symbolicMeaning: '归途邀请卡是旅程圆满的见证。它不是开始，而是回望。',
      emotionalNarrative: '最深的邀请不是让你去什么地方，而是让你记得自己从哪里来。',
      awakenReason: '你在归真之门前回望了来时的路，门感受到了你的目光。'
    }),

    col_aqg_star_map: Object.freeze({
      originStory: '星痕池底的星图在你完成探索后重新排列，将你走过的路径在星空中标记出来。这是一幅只属于你的星图。',
      symbolicMeaning: '星痕图鉴是你在星空中的位置。每一个人都有自己的星图，只是大多数人从未见过它。',
      emotionalNarrative: '星星知道你去过哪里，即使你自己已经忘记。',
      awakenReason: '当你完成了足够多的探索，星痕池底的星辰开始回应你的轨迹。'
    }),

    col_aqg_memory_scroll: Object.freeze({
      originStory: '残卷阁中那些被唤醒的文字片段汇聚在一起，自动排列成一篇完整的文本。它不是你写下的，但它确实是你完成的。',
      symbolicMeaning: '残卷复刻本是时间的拼图。你找到了所有碎片，世界帮你拼好。',
      emotionalNarrative: '有些故事需要两个人才能完成——一个开始它的人，一个完成它的人。',
      awakenReason: '你收集的残卷碎片达到了完整所需的数量，文字自行组合。'
    })
  }),

  // ─── AR EVENT NARRATIVES ───
  arEvents: Object.freeze({
    typeDescriptions: {
      scan_success: '扫描成功——世界感知到了你的存在',
      event_triggered: '事件被触发——某段被封印的回响开始苏醒',
      relic_created: '信物显现——一枚印记从世界中浮现',
      collectible_generated: '数字藏品生成——记忆被转化为可见的形态',
      rights_updated: '权益更新——你的探索正在积累意义',
      state_synced: '状态同步——世界记住了你的脚步'
    }
  }),

  // ─── COLLECTION PAGE NARRATIVES ───
  pageNarratives: Object.freeze({
    title: '遗迹回廊',
    subtitle: '每一件藏品都是一个故事，每一次回响都是世界的回应',
    relic: {
      empty: '沉睡的印记仍在等待被唤醒。每一次 AR 扫描都可能揭开一段被遗忘的故事。',
      emptyHint: '世界深处的信物正在等待触碰'
    },
    digital: {
      empty: '尚未形成的记忆正在汇聚。信物将衍生出它们的数字形态。',
      emptyHint: '印记会在时空中展开它的完整面貌'
    },
    arEvent: {
      empty: '尚未被记录的回响。每一次 AR 探索都会在世界中留下痕迹。',
      emptyHint: '行动本身就是最深刻的记录'
    },
    tabRelic: '信物',
    tabDigital: '印记',
    tabArEvent: '回响'
  })
});

module.exports = COLLECTION_WORLD_SEED;
