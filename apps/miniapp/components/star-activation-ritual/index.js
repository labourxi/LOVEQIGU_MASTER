const starRitualService = require('../../services/star-ritual-service.js');
const bus = require('../../services/xr/xr-event-bus.js');
const { generateRelic } = require('../../services/xr/relic-generator.js');
const { renderStarInRealSpace } = require('../../services/ar/world-renderer.js');

const STATE = {
  IDLE: 'idle',
  REVEAL: 'reveal',
  ACTIVE: 'active',
  COMPLETE: 'complete'
};

Component({
  properties: {
    visible: {
      type: Boolean,
      value: false
    },
    autoplay: {
      type: Boolean,
      value: false
    },
    title: {
      type: String,
      value: 'Star Ritual'
    },
    subtitle: {
      type: String,
      value: 'Canvas + state machine preview'
    },
    demoLabel: {
      type: String,
      value: 'Demo only, not the production path.'
    },
    targetIndex: {
      type: Number,
      value: 2
    }
  },

  data: {
    state: STATE.IDLE,
    anchorPosition: null,
    canvasWidth: 640,
    canvasHeight: 360,
    currentState: starRitualService.STATES.IDLE,
    currentLabel: 'Idle',
    currentCopy: 'Waiting for the ritual to start.',
    motionTitle: 'Motion preview',
    motionCopy: 'Canvas preview only.',
    motionFallback: true,
    canDraw: false,
    progressText: '0/0'
  },

  lifetimes: {
    attached() {
      this._subscriptions = [];
      this._pulseTimer = null;

      this.machine = starRitualService.createStateMachine({
        sceneOptions: {
          targetIndex: this.properties.targetIndex
        },
        onChange: (snapshot) => {
          const stepIndex = Math.max(0, snapshot.index);
          const totalSteps = starRitualService.getTimeline().length;
          this.setData({
            currentState: snapshot.state,
            currentLabel: snapshot.step ? snapshot.step.label : 'Complete',
            currentCopy: snapshot.scene.copy,
            motionTitle: snapshot.motion.title,
            motionCopy: snapshot.motion.note,
            motionFallback: snapshot.motion.fallback,
            progressText: `${Math.min(stepIndex + 1, totalSteps)}/${totalSteps}`
          });
          this.drawScene(snapshot.scene);
        },
        onComplete: (snapshot) => {
          this.triggerEvent('complete', { state: snapshot.state, snapshot });
        }
      });

      this._subscriptions.push(
        bus.on('XR_USER_TRIGGER', (payload) => {
          this.start(payload);
        })
      );

      this._subscriptions.push(
        bus.on('STAR_SPACE_ANCHOR', (data) => {
          const position = data && data.position ? data.position : null;
          this.setData({
            state: STATE.ACTIVE,
            currentState: starRitualService.STATES.ACTIVE,
            currentLabel: 'Active',
            currentCopy: 'Star is anchored in world space.',
            motionFallback: false,
            anchorPosition: position
          });
          this.renderStarAtPosition(position);
          renderStarInRealSpace({
            position,
            anchor: data && data.starId ? data.starId : null
          });
        })
      );

      this._subscriptions.push(
        bus.on('STAR_LIGHTED', (payload) => {
          const relic = generateRelic(
            payload && payload.id ? payload.id : 'star_unknown',
            payload && payload.position ? payload.position : null
          );
          bus.emit('RELIC_CREATED', relic);
        })
      );

      this._subscriptions.push(
        bus.on('RELIC_CREATED', (relic) => {
          this.setData({
            state: STATE.COMPLETE,
            currentState: starRitualService.STATES.COMPLETE,
            currentLabel: 'Complete',
            currentCopy: relic ? `Relic manifested: ${relic.id}` : 'Relic manifested.',
            motionFallback: false
          });
          this.triggerEvent('reliccreated', { relic });
        })
      );

      this.setData({
        canDraw: true
      });
      this.drawScene(this.machine.getSnapshot().scene);

      if (this.properties.autoplay) {
        this.startPreview();
      }
    },

    detached() {
      if (this._pulseTimer) {
        clearTimeout(this._pulseTimer);
        this._pulseTimer = null;
      }
      while (Array.isArray(this._subscriptions) && this._subscriptions.length > 0) {
        const off = this._subscriptions.pop();
        if (typeof off === 'function') {
          off();
        }
      }
    }
  },

  observers: {
    'targetIndex, visible': function () {
      if (!this.machine) {
        return;
      }
      this.machine.reset();
      this.drawScene(this.machine.getSnapshot().scene);
    }
  },

  methods: {
    start(data) {
      if (this._pulseTimer) {
        clearTimeout(this._pulseTimer);
        this._pulseTimer = null;
      }

      const payload = data || {};
      this.setData({
        state: STATE.REVEAL,
        currentState: STATE.REVEAL,
        currentLabel: 'Reveal',
        currentCopy: 'Star chart is opening.',
        motionFallback: true
      });

      if (this.machine) {
        this.machine.start();
      }

      this._pulseTimer = setTimeout(() => {
        if (!this.data.anchorPosition) {
          this.setData({
            state: STATE.ACTIVE,
            currentState: STATE.ACTIVE,
            currentLabel: 'Active',
            currentCopy: 'Star has entered active state.',
            motionFallback: false
          });
          bus.emit('STAR_LIGHTED', {
            id: payload.id || `star_${this.properties.targetIndex}`,
            position: payload.position || null
          });
        }
      }, 800);
    },

    startPreview() {
      if (!this.machine) {
        return;
      }
      this.machine.start();
    },

    renderStarAtPosition(position) {
      if (!position) {
        return;
      }
      this.setData({
        anchorPosition: {
          x: Number(position.x) || 0,
          y: Number(position.y) || 0,
          z: Number(position.z) || 0
        }
      });
    },

    resetPreview() {
      if (!this.machine) {
        return;
      }
      this.machine.reset();
      this.drawScene(this.machine.getSnapshot().scene);
    },

    stopPreview() {
      if (!this.machine) {
        return;
      }
      this.machine.stop();
    },

    drawScene(scene) {
      if (!scene || !this.data.canDraw || typeof wx === 'undefined' || !wx.createCanvasContext) {
        return;
      }

      const ctx = wx.createCanvasContext('star-ritual-canvas', this);
      const width = scene.width;
      const height = scene.height;
      const centerY = height * 0.48;

      ctx.setFillStyle(scene.background);
      ctx.fillRect(0, 0, width, height);

      ctx.setGlobalAlpha(0.14);
      ctx.setFillStyle('#D9C59A');
      ctx.fillRect(22, 22, width - 44, height - 44);
      ctx.setGlobalAlpha(1);

      ctx.setStrokeStyle('#A7A197');
      ctx.setLineWidth(1);
      ctx.beginPath();
      ctx.moveTo(82, centerY - 16);
      ctx.lineTo(width - 82, centerY - 16);
      ctx.stroke();

      ctx.setStrokeStyle('#D8C18A');
      ctx.setLineWidth(2);
      scene.lines.forEach(([start, end]) => {
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
      });

      if (this.data.anchorPosition) {
        const anchorX = width * 0.5 + (this.data.anchorPosition.x || 0) * 36;
        const anchorY = centerY + (this.data.anchorPosition.z || 0) * 24;
        ctx.setGlobalAlpha(0.24);
        ctx.setStrokeStyle('#B08A3D');
        ctx.setLineWidth(4);
        ctx.beginPath();
        ctx.arc(anchorX, anchorY, 28, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setGlobalAlpha(1);
      }

      ctx.setGlobalAlpha(0.18);
      ctx.setStrokeStyle('#C6A24F');
      ctx.setLineWidth(8);
      ctx.beginPath();
      ctx.arc(scene.glow.x, scene.glow.y, scene.glow.radius + 8, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setGlobalAlpha(1);

      ctx.setFillStyle('#B08A3D');
      ctx.setGlobalAlpha(scene.glow.opacity);
      ctx.beginPath();
      ctx.arc(scene.glow.x, scene.glow.y, scene.glow.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.setGlobalAlpha(1);

      scene.nodes.forEach((node) => {
        const radius = node.size + (node.active ? 6 : 0);
        ctx.setFillStyle(node.active ? '#B08A3D' : '#6E8A7A');
        ctx.setGlobalAlpha(node.active ? 1 : 0.75);
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.setGlobalAlpha(1);

        ctx.setFillStyle('#F6F1E8');
        ctx.setFontSize(16);
        ctx.fillText(node.label, node.x - 6, node.y - 14);
      });

      ctx.setFillStyle('#203A35');
      ctx.setFontSize(20);
      ctx.fillText('ART-02', 28, 42);
      ctx.setFontSize(16);
      ctx.setFillStyle('#4C514B');
      ctx.fillText('Star ritual preview', 28, 68);

      if (scene.showSeal) {
        ctx.setGlobalAlpha(scene.seal.opacity);
        ctx.setFillStyle('#A74B3A');
        ctx.beginPath();
        ctx.arc(scene.seal.x, scene.seal.y, scene.seal.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.setGlobalAlpha(1);

        ctx.setFillStyle('#F6F1E8');
        ctx.setFontSize(18);
        ctx.fillText('SEAL', scene.seal.x - 8, scene.seal.y + 6);
      }

      ctx.draw();
    }
  }
});
