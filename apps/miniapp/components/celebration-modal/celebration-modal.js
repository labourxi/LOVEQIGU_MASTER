Component({
  properties: {
    visible: {
      type: Boolean,
      value: false
    },
    title: {
      type: String,
      value: ''
    },
    message: {
      type: String,
      value: ''
    },
    rewardName: {
      type: String,
      value: ''
    },
    rewardLabel: {
      type: String,
      value: ''
    },
    confirmText: {
      type: String,
      value: '知道了'
    },
    showParticles: {
      type: Boolean,
      value: true
    }
  },

  methods: {
    onConfirm() {
      this.triggerEvent('close');
    },

    noop() {}
  }
});
