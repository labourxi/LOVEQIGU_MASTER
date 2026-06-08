const ECHOES = [
  {
    echo_id: 'ar_v2_echo_receive',
    title: 'Echo Receive',
    source: 'Approved CH01 response path',
    copy: 'Uses the existing receive echo reference only.',
    next_path: '/pages/digital-collectible/index'
  },
  {
    echo_id: 'ar_v2_echo_settle',
    title: 'Echo Settle',
    source: 'Approved CH01 completion path',
    copy: 'Uses the existing settle echo reference only.',
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
