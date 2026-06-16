Component({
  properties: {
    panel: {
      type: Object,
      value: {}
    }
  },

  methods: {
    onOpenPage(event) {
      const { path } = event.currentTarget.dataset;
      if (!path) {
        return;
      }
      this.triggerEvent('navigate', { path });
    }
  }
});
