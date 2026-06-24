const store = {
  userPose: {
    x: 0,
    y: 0,
    z: 0,
    rotation: 0
  },
  anchors: {}
};

function updateUserPose(pose) {
  store.userPose = {
    ...store.userPose,
    ...(pose || {})
  };
}

function addAnchor(id, position) {
  if (!id) {
    return null;
  }
  store.anchors[id] = {
    x: Number(position && position.x) || 0,
    y: Number(position && position.y) || 0,
    z: Number(position && position.z) || 0
  };
  return store.anchors[id];
}

function getAnchor(id) {
  return store.anchors[id];
}

function getAllAnchors() {
  return { ...store.anchors };
}

function getUserPose() {
  return { ...store.userPose };
}

function resetSpatialStore() {
  store.userPose = {
    x: 0,
    y: 0,
    z: 0,
    rotation: 0
  };
  store.anchors = {};
}

module.exports = {
  updateUserPose,
  addAnchor,
  getAnchor,
  getAllAnchors,
  getUserPose,
  resetSpatialStore
};
