const { patchProgress } = require('./user-progress-store');

function ensureRight(progress, rightId) {
  let right = progress.rights.items.find((item) => item && item.right_id === rightId);
  if (!right) {
    right = {
      right_id: rightId,
      status: 'LOCKED',
      claimed_at: null,
      redeemed_at: null
    };
    progress.rights.items.push(right);
  }
  return right;
}

function claimRight(rightId) {
  if (!rightId) {
    return null;
  }
  return patchProgress((progress) => {
    const right = ensureRight(progress, rightId);
    right.status = 'CLAIMED';
    right.claimed_at = right.claimed_at || new Date().toISOString();
    return progress;
  });
}

function markRightRedeemed(rightId) {
  if (!rightId) {
    return null;
  }
  return patchProgress((progress) => {
    const right = ensureRight(progress, rightId);
    right.status = 'REDEEMED';
    right.redeemed_at = new Date().toISOString();
    return progress;
  });
}

module.exports = {
  claimRight,
  markRightRedeemed
};

