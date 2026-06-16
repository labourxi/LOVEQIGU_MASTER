const ECHOES = [
  {
    echo_id: 'ar_v2_echo_receive',
    title: '回响接收',
    source: '已定初觉回应路径',
    copy: '仅使用已定接收回响引用。',
    next_path: '/pages/digital-collectible/index'
  },
  {
    echo_id: 'ar_v2_echo_settle',
    title: '回响沉淀',
    source: '已定章成完成路径',
    copy: '仅使用已定沉淀回响引用。',
    next_path: '/pages/digital-collectible/index'
  }
];

function getAllEchoes() {
  return ECHOES.map((item) => ({ ...item }));
}

function getEchoById(id) {
  return getAllEchoes().find((item) => item.echo_id === id) || null;
}

module.exports = {
  getAllEchoes,
  getEchoById
};
