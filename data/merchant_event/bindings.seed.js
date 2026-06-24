module.exports = {
  activity_id: 'event_loveqigu_first_event_v1',
  event_code: 'LOVEQIGU_FIRST_EVENT_CASE_V1',
  event_name: '鐖变紒璋峰垵瑙佸瀹濊妭',
  activity_to_exploration_points: [
    'point_entrance_plaza',
    'point_loveqigu_cafe',
    'point_loveqigu_bookstore',
    'point_loveqigu_craft_hall',
    'point_central_plaza'
  ],
  activity_to_tasks: [
    'task_entrance_checkin',
    'task_cafe_scan',
    'task_book_quiz',
    'task_craft_collect',
    'task_center_finish'
  ],
  activity_to_relics: [
    'relic_qigu_first_mark',
    'relic_cafe_stamp',
    'relic_bookmark',
    'relic_craft_mark',
    'relic_central_seal'
  ],
  activity_to_merchants: [
    'merchant_loveqigu_cafe_01',
    'merchant_loveqigu_book_01',
    'merchant_loveqigu_craft_01'
  ],
  activity_to_coupon_templates: [
    'coupon_loveqigu_cafe_01',
    'coupon_loveqigu_book_01',
    'coupon_loveqigu_craft_01'
  ],
  exploration_point_task_bindings: [
    {
      point_id: 'point_entrance_plaza',
      task_id: 'task_entrance_checkin'
    },
    {
      point_id: 'point_loveqigu_cafe',
      task_id: 'task_cafe_scan'
    },
    {
      point_id: 'point_loveqigu_bookstore',
      task_id: 'task_book_quiz'
    },
    {
      point_id: 'point_loveqigu_craft_hall',
      task_id: 'task_craft_collect'
    },
    {
      point_id: 'point_central_plaza',
      task_id: 'task_center_finish'
    }
  ],
  task_relic_bindings: [
    {
      task_id: 'task_entrance_checkin',
      relic_id: 'relic_qigu_first_mark'
    },
    {
      task_id: 'task_cafe_scan',
      relic_id: 'relic_cafe_stamp'
    },
    {
      task_id: 'task_book_quiz',
      relic_id: 'relic_bookmark'
    },
    {
      task_id: 'task_craft_collect',
      relic_id: 'relic_craft_mark'
    },
    {
      task_id: 'task_center_finish',
      relic_id: 'relic_central_seal'
    }
  ],
  merchant_coupon_bindings: [
    {
      merchant_id: 'merchant_loveqigu_cafe_01',
      coupon_id: 'coupon_loveqigu_cafe_01'
    },
    {
      merchant_id: 'merchant_loveqigu_book_01',
      coupon_id: 'coupon_loveqigu_book_01'
    },
    {
      merchant_id: 'merchant_loveqigu_craft_01',
      coupon_id: 'coupon_loveqigu_craft_01'
    }
  ]
};
