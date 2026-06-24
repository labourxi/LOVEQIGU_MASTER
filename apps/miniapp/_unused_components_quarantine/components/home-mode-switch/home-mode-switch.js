Component({
  properties: {
    activeMode: {
      type: String,
      value: 'explore'
    },
    showCampaignTab: {
      type: Boolean,
      value: false
    }
  },

  methods: {
    onTapMode(event) {
      const { mode } = event.currentTarget.dataset;
      if (!mode || mode === this.data.activeMode) {
        return;
      }
      this.triggerEvent('change', { mode });
    }
  }
});
