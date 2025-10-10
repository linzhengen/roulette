// Shared roulette core functionality
class RouletteCore {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.options = [];
    this.startAngle = 0;
    this.spinAngleStart = 0;
    this.spinTime = 0;
    this.spinTimeTotal = 0;
    this.spinTimeout = null;
  }

  setOptions(options) {
    this.options = options;
    this.drawRouletteWheel();
  }

  byte2Hex(n) {
    const nybHexString = '0123456789ABCDEF';
    return String(nybHexString.substr((n >> 4) & 0x0F, 1)) + nybHexString.substr(n & 0x0F, 1);
  }

  RGB2Color(r, g, b) {
    return `#${this.byte2Hex(r)}${this.byte2Hex(g)}${this.byte2Hex(b)}`;
  }

  getColor(item, maxitem) {
    const phase = 0;
    const center = 128;
    const width = 127;
    const frequency = Math.PI * 2 / maxitem;

    const red = Math.sin(frequency * item + 2 + phase) * width + center;
    const green = Math.sin(frequency * item + phase) * width + center;
    const blue = Math.sin(frequency * item + 4 + phase) * width + center;

    return this.RGB2Color(red, green, blue);
  }

  getArc() {
    const totalWeight = this.options.reduce((acc, cur) => acc + (cur.weight || 1), 0);
    return Math.PI / (totalWeight / 2);
  }

  drawRouletteWheel() {
    if (!this.canvas.getContext) return;

    const outsideRadius = 200;
    const textRadius = 160;
    const insideRadius = 125;

    this.ctx.clearRect(0, 0, 500, 500);
    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = 2;
    this.ctx.font = 'bold 12px Helvetica, Arial';

    let startAngle = this.startAngle;
    const arc = this.getArc();

    for (let i = 0; i < this.options.length; i += 1) {
      const weightArc = arc * (this.options[i].weight || 1);
      const endAngle = startAngle + weightArc;
      this.ctx.fillStyle = this.getColor(i, this.options.length);

      this.ctx.beginPath();
      this.ctx.arc(250, 250, outsideRadius, startAngle, endAngle, false);
      this.ctx.arc(250, 250, insideRadius, endAngle, startAngle, true);
      this.ctx.stroke();
      this.ctx.fill();

      this.ctx.save();
      this.ctx.shadowOffsetX = -1;
      this.ctx.shadowOffsetY = -1;
      this.ctx.shadowBlur = 0;
      this.ctx.shadowColor = 'rgb(220,220,220)';
      this.ctx.fillStyle = 'black';
      this.ctx.translate(
        250 + Math.cos(startAngle + weightArc / 2) * textRadius,
        250 + Math.sin(startAngle + weightArc / 2) * textRadius
      );
      this.ctx.rotate(startAngle + weightArc / 2 + Math.PI / 2);
      const text = this.options[i].name;
      this.ctx.fillText(text, -this.ctx.measureText(text).width / 2, 0);
      this.ctx.restore();

      startAngle = endAngle;
    }

    // Arrow
    this.ctx.fillStyle = 'black';
    this.ctx.beginPath();
    this.ctx.moveTo(250 - 4, 250 - (outsideRadius + 5));
    this.ctx.lineTo(250 + 4, 250 - (outsideRadius + 5));
    this.ctx.lineTo(250 + 4, 250 - (outsideRadius - 5));
    this.ctx.lineTo(250 + 9, 250 - (outsideRadius - 5));
    this.ctx.lineTo(250, 250 - (outsideRadius - 13));
    this.ctx.lineTo(250 - 9, 250 - (outsideRadius - 5));
    this.ctx.lineTo(250 - 4, 250 - (outsideRadius - 5));
    this.ctx.lineTo(250 - 4, 250 - (outsideRadius + 5));
    this.ctx.fill();
  }

  spin(onResult) {
    if (this.options.length === 0) return;

    this.spinAngleStart = Math.random() * 1000 + 10;
    this.spinTime = 0;
    this.spinTimeTotal = Math.random() * 3 + 4 * 1000;
    this.rotateWheel(onResult);
  }

  rotateWheel(onResult) {
    this.spinTime += 30;
    if (this.spinTime >= this.spinTimeTotal) {
      this.stopRotateWheel(onResult);
      return;
    }

    const spinAngle = this.spinAngleStart - this.easeOut(
      this.spinTime, 0, this.spinAngleStart, this.spinTimeTotal
    );
    this.startAngle += (spinAngle * Math.PI / 180);
    this.drawRouletteWheel();

    this.spinTimeout = setTimeout(() => {
      this.rotateWheel(onResult);
    }, 30);
  }

  stopRotateWheel(onResult) {
    clearTimeout(this.spinTimeout);
    const degrees = this.startAngle * 180 / Math.PI + 90;
    const arcd = this.getArc() * 180 / Math.PI;
    const index = Math.floor((360 - (degrees % 360)) / arcd);

    const weightOptions = [];
    this.options.forEach((option) => {
      for (let i = 0; i < (option.weight || 1); i += 1) {
        weightOptions.push(option);
      }
    });

    const gotOption = weightOptions[index];

    if (gotOption) {
      this.ctx.save();
      this.ctx.font = 'bold 30px Helvetica, Arial';
      this.ctx.fillText(
        gotOption.name,
        250 - this.ctx.measureText(gotOption.name).width / 2,
        250 + 10
      );
      this.ctx.restore();

      if (onResult) {
        onResult(gotOption);
      }
    }
  }

  easeOut(t, b, c, d) {
    const ts = (t /= d) * t;
    const tc = ts * t;
    return b + c * (tc + -3 * ts + 3 * t);
  }
}

// Make it available globally for React
window.RouletteCore = RouletteCore;
