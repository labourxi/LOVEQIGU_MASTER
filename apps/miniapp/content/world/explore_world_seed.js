// ═════════════════════════════════════════════════════════════════════
// CONTENT WORLD SEED — EXPLORE PAGE
//
// Narrative enrichment layer for all 10 exploration nodes.
// Each node gets: story fragment, symbolic meaning, visual hint, AR trigger.
//
// RULE: Every field uses mythic/narrative language. No system text.
// ═════════════════════════════════════════════════════════════════════

var EXPLORE_WORLD_SEED = Object.freeze({

  // ─── 10 nodes in rhythm order (origin → journey → echo → climax → void) ───
  nodes: Object.freeze([

    // ─── NODE 0: origin — 四象入口 ───
    Object.freeze({
      pointId: 'AQG_01',
      storyFragment: '四象石柱分立雾气两侧，地面刻痕如封印缓缓展开。你站在世界入口，古老的金色纹路正在苏醒。',
      symbolicMeaning: '入口即觉醒。四象代表四重生命状态，踏入即是连接开始。',
      visualHint: '石柱上的刻痕在雾气中隐现金色微光，地面纹路如呼吸般明灭。',
      arTriggerDescription: '扫描地面金色纹路，封印将显现第一枚信物印记。',
      emotionalNarrative: '站在门前，你感受到的不是开始，而是归来。'
    }),

    // ─── NODE 1: journey — 雾林 ───
    Object.freeze({
      pointId: 'AQG_02',
      storyFragment: '雾在林间流动，古木参天，根系如经络般在地面蔓延。每一棵树的年轮里都藏着一缕未被唤醒的记忆。',
      symbolicMeaning: '雾是时空的帷幕。林中每一片叶子都是未被阅读的信。',
      visualHint: '雾在树间聚散，偶尔露出深处隐约的光点。树根处的苔藓呈玉色。',
      arTriggerDescription: '扫描树根处的玉色苔藓，雾气中浮现木之印记。',
      emotionalNarrative: '迷失不是错误，而是发现的另一种方式。'
    }),

    // ─── NODE 2: journey — 石径 ───
    Object.freeze({
      pointId: 'AQG_03',
      storyFragment: '青石板铺成的小径蜿蜒向前，每一块石板都刻着不同的符号。岁月磨平了棱角，却未磨灭痕迹。',
      symbolicMeaning: '石径即是命途。每一步踩在古人走过的痕迹上，你正在重复一场古老的仪式。',
      visualHint: '石板上的刻痕在斜阳下显现深浅不一的影子。某些石缝中透出微光。',
      arTriggerDescription: '扫描刻痕最深的石板，石之记忆将沿路径显现。',
      emotionalNarrative: '有些路不是为了抵达，而是为了让你走这一步。'
    }),

    // ─── NODE 3: journey — 回声台 ───
    Object.freeze({
      pointId: 'AQG_04',
      storyFragment: '圆形石台中央有一道浅浅的凹痕，像是被什么声音震出的印记。站在台上，能听见风穿过石壁的回响。',
      symbolicMeaning: '回声是时间的涟漪。曾经在这里发出的声音，仍在空气中振动。',
      visualHint: '凹痕边缘有细微的晶状颗粒，在暗处发出柔和的白光。',
      arTriggerDescription: '站在凹痕前扫描，声波将转化成可视化的光纹。',
      emotionalNarrative: '有些声音发出来就没有消失过，只是等待被听见。'
    }),

    // ─── NODE 4: echo — 祈愿台 ───
    Object.freeze({
      pointId: 'AQG_05',
      storyFragment: '石台上刻着北斗七星的图案，每一颗星的位置都对应一个字的刻痕。台面中央有一枚未熄灭的香灰。',
      symbolicMeaning: '祈愿不是索取，而是将自己的愿望交给星辰。星星不会回应，但它们会记住。',
      visualHint: '北斗刻痕在月光下会有微弱荧光。香灰处偶有热气升腾。',
      arTriggerDescription: '扫描北斗七星图案，星辰将回应你的祈愿。',
      emotionalNarrative: '愿望说出来不是为了实现，而是为了被宇宙听见。'
    }),

    // ─── NODE 5: echo — 残卷阁 ───
    Object.freeze({
      pointId: 'AQG_06',
      storyFragment: '一间半塌的木阁，案上散落着残破的卷轴。墨迹已褪，但某些字句仍然可辨——它们在等一个能读懂的人。',
      symbolicMeaning: '残卷不是残缺，而是等待。每一段未完成的文字都是留给未来的一封信。',
      visualHint: '卷轴上的墨迹在特定角度下显现淡金色。某些字句会随时间浮现又消失。',
      arTriggerDescription: '扫描残卷上的可辨字迹，文字将重新显现。',
      emotionalNarrative: '被遗忘的文字会等来最后一个读者。'
    }),

    // ─── NODE 6: echo — 星痕池 ───
    Object.freeze({
      pointId: 'AQG_07',
      storyFragment: '一池静水，水面上仿佛漂浮着碎裂的星光。池底的石头排列成古老的星图，但大多已经偏移。',
      symbolicMeaning: '星痕是天上星辰在大地上的投影。池水映照的不仅是天空，还有逝去的时间。',
      visualHint: '水面平静时可见池底星图。某些石头会偶尔发出微光。',
      arTriggerDescription: '扫描水面，碎裂的星光将重新汇聚成完整星图。',
      emotionalNarrative: '星辰从未消失，它们只是沉入水中等待被捞起。'
    }),

    // ─── NODE 7: climax — 风语桥 ───
    Object.freeze({
      pointId: 'AQG_08',
      storyFragment: '一座古朴的石桥横跨溪流，桥栏上系着许多褪色的布条。风过时，布条轻轻飘动，像是在传递什么消息。',
      symbolicMeaning: '风是世上最古老的传信者。布条上的每一个结都代表一个未说完的故事。',
      visualHint: '布条在风中飘动的节奏各不相同。某些布条上有隐约的字迹。',
      arTriggerDescription: '扫描飘动的布条，风将把它承载的消息显现出来。',
      emotionalNarrative: '风会把你的话带到它该去的地方。'
    }),

    // ─── NODE 8: climax — 旧忆碑林 ───
    Object.freeze({
      pointId: 'AQG_09',
      storyFragment: '数十块石碑错落而立，每一块上都刻着不同的名字和日期。有些已经被藤蔓覆盖，有些仍然清晰。',
      symbolicMeaning: '石碑不是终点，而是标记。每一个名字都是一个曾经存在于世界上的回响。',
      visualHint: '藤蔓在石碑上生长成奇特的图案。某些碑文在雨中会变得更加清晰。',
      arTriggerDescription: '扫描被藤蔓覆盖的碑文，名字将重新显现并留下印记。',
      emotionalNarrative: '被记住的人不会真正消失。'
    }),

    // ─── NODE 9: void — 归真之门 ───
    Object.freeze({
      pointId: 'AQG_10',
      storyFragment: '一扇朴素的门立在径的尽头，门框上没有任何装饰。推开它，不是离开，而是回到开始的地方。',
      symbolicMeaning: '归真不是结束，而是圆满。门后不是新的世界，而是你已走过的路。',
      visualHint: '门在雾中若隐若现。门缝中透出的光与入口处的金光是同一种颜色。',
      arTriggerDescription: '扫描门缝中的光，完整的探索图谱将在你面前展开。',
      emotionalNarrative: '所有的旅途都是一次归家。'
    })
  ]),

  // ─── WORLD STATE NARRATIVES ───
  worldState: Object.freeze({
    atmosphereList: [
      '雾在缓慢流动',
      '金色微光从地面升起',
      '远处有回声传来',
      '星辰正在汇聚',
      '万物归于寂静'
    ],
    hintList: [
      '每一个角落都藏着未被发现的痕迹',
      '你的脚步正在唤醒沉睡的记忆',
      '风带来了远方的消息',
      '石刻上的文字正在等待被阅读',
      '水面下的星光从未熄灭'
    ],
    roleList: [
      '探索者',
      '寻迹者',
      '记忆旅人',
      '星辰观测者',
      '图谱编纂者'
    ]
  }),

  // ─── NETWORK MURMURS ───
  networkMurmurs: Object.freeze([
    '星链中传来微弱脉动',
    '遥远的节点正在苏醒',
    '某种连接正在形成',
    '残留的知觉在空气中漂荡',
    '世界树的根须在深处轻轻震动'
  ]),

  // ─── PHENOMENON ENRICHMENT ───
  phenomenonEnrichments: Object.freeze({
    'AQG_01': {
      phenomenon: '人群正在聚集——某种回声正在靠近',
      emotion: '入口处的封印正在松动'
    },
    'AQG_02': {
      phenomenon: '雾气深处传来未名的低语',
      emotion: '树木的记忆正在浮现'
    },
    'AQG_03': {
      phenomenon: '石径上的刻痕开始发光',
      emotion: '古老的脚步仍在回响'
    },
    'AQG_04': {
      phenomenon: '空气中残留的声音开始重新振动',
      emotion: '圆台中央的印记在共鸣'
    },
    'AQG_05': {
      phenomenon: '北斗七星的刻痕正在依次亮起',
      emotion: '星辰仍未回应，但在倾听'
    },
    'AQG_06': {
      phenomenon: '残卷上的墨迹正在重新显现',
      emotion: '文字尚未完整，但在汇聚'
    },
    'AQG_07': {
      phenomenon: '水面下的星光正在上升',
      emotion: '光点正在重新排列'
    },
    'AQG_08': {
      phenomenon: '桥上的布条开始同时飘动',
      emotion: '风中的消息正在传递'
    },
    'AQG_09': {
      phenomenon: '藤蔓覆盖下的碑文开始显现',
      emotion: '被遗忘的名字正在回到世界'
    },
    'AQG_10': {
      phenomenon: '门缝中的光与入口处共鸣',
      emotion: '归途已经显现'
    }
  })
});

module.exports = EXPLORE_WORLD_SEED;
