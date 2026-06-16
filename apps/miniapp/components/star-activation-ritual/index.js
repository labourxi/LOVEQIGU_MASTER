const starRitualService = require('../../services/star-ritual-service');

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
      value: 'ART-02 星图点亮'
    },
    subtitle: {
      type: String,
      value: 'Canvas + Lottie hybrid preview'
    },
    demoLabel: {
      type: String,
      value: '仅用于演示，不接入正式路径。'
    },
    targetIndex: {
      type: Number,
      value: 2
    }
  },

  data: {
    canvasWidth: 640,
    canvasHeight: 360,
    currentState: starRitualService.STATES.IDLE,
    currentLabel: '待机',
    currentCopy: '等待触发星图点亮预览。',
    motionTitle: '轻量回退',
    motionCopy: '当前未播放 Lottie 资源，采用 Canvas 轻量回退。',
    motionFallback: true,
    canDraw: false,
    progressText: '0/9'
  },

  lifetimes: {
    attached() {
      this.machine = starRitualService.createStateMachine({
        sceneOptions: {
          targetIndex: this.properties.targetIndex
        },
        onChange: (snapshot) => {
          const stepIndex = Math.max(0, snapshot.index);
          const totalSteps = starRitualService.getTimeline().length;
          this.setData({
            currentState: snapshot.state,
            currentLabel: snapshot.step ? snapshot.step.label : '完成',
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

      this.setData({
        canDraw: true
      });
      this.drawScene(this.machine.getSnapshot().scene);

      if (this.properties.autoplay) {
        this.startPreview();
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
    startPreview() {
      if (!this.machine) {
        return;
      }
      this.machine.start();
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
      if (!scene || !this.data.canDraw) {
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
      ctx.fillText('星图点亮预览', 28, 68);

      if (scene.showSeal) {
        ctx.setGlobalAlpha(scene.seal.opacity);
        ctx.setFillStyle('#A74B3A');
        ctx.beginPath();
        ctx.arc(scene.seal.x, scene.seal.y, scene.seal.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.setGlobalAlpha(1);

        ctx.setFillStyle('#F6F1E8');
        ctx.setFontSize(18);
        ctx.fillText('印', scene.seal.x - 8, scene.seal.y + 6);
      }

      ctx.draw();
    }
  }
});
