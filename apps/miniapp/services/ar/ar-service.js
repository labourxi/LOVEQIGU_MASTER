const EVENTS = [
  {
    id: 'ar_gate_open_v1',
    code: 'ar_gate_open_v1',
    name: '门阈开启',
    copy: '用于探索地图的 AR 预览入口。',
    camera_enabled: false,
    fake_ar_enabled: true
  },
  {
    id: 'ar_imprint_particles_v1',
    code: 'ar_imprint_particles_v1',
    name: '印痕粒子',
    copy: '用于章节节点的可视化预览。',
    camera_enabled: false,
    fake_ar_enabled: true
  }
];

function getAllArEvents() {
  return EVENTS.map((event) => ({ ...event }));
}

function getArEventById(id) {
  return getAllArEvents().find((event) => event.id === id) || null;
}

function getArEventByCode(code) {
  return getAllArEvents().find((event) => event.code === code) || null;
}

module.exports = {
  getAllArEvents,
  getArEventById,
  getArEventByCode
};
