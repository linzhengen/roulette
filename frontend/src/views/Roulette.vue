<template>
  <div class="container" id="app">
    <div class="columns">
      <div class="column">
        <div class="columns is-centered">
          <input
            type="button"
            class="button is-danger"
            value="SPIN ROULETTE"
            v-on:click="spin"
          />
        </div>
        <div class="columns is-centered">
          <canvas ref="rouletteCanvas" width="500" height="500"></canvas>
        </div>
      </div>
      <div class="column">
        <div class="columns is-multiline">
          <div class="column is-half">
            <div class="field">
              <input
                class="input"
                type="text"
                placeholder="Input More Prize"
                v-model="new_option"
                v-on:keyup.enter="addOptions"
              >
            </div>
          </div>
          <div class="column is-half">
            <button class="button is-primary" v-on:click="addOptions">Add</button>
          </div>
          <div class="buttons">
            <div class="button is-danger is-outlined"
                 v-for="o in options" :key="o.id">
              <span> {{ o.name }} </span>
              <span class="icon is-small" v-on:click="removeOptions(o.id)">
              <i class="fas fa-times"></i>
            </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { OptionsQuery } from '../graphql/query';
import { createOptionMutation } from '../graphql/mutaion';

export default {
  apollo: {
    options: {
      query: OptionsQuery,
      loadingKey: 'loading',
    },
  },
  data() {
    return {
      options: [],
      new_option: '',
      startAngle: 0,
      startAngleStart: 0,
      spinTimeout: null,
      spinArcStart: 10,
      spinTime: 0,
      spinTimeTotal: 0,
      ctx: '',
    };
  },
  computed: {
    arc() {
      return Math.PI / (this.options.length / 2);
    },
  },

  methods: {
    byte2Hex(n) {
      const nybHexString = '0123456789ABCDEF';
      /* eslint-disable no-bitwise */
      return String(nybHexString.substr((n >> 4) & 0x0F, 1)) + nybHexString.substr(n & 0x0F, 1);
    },

    RGB2Color(r, g, b) {
      return `#${this.byte2Hex(r)}${this.byte2Hex(g)}${this.byte2Hex(b)}`;
    },

    getColor(item, maxitem) {
      const phase = 0;
      const center = 128;
      const width = 127;
      const frequency = Math.PI * 2 / maxitem;

      const red = Math.sin(frequency * item + 2 + phase) * width + center;
      const green = Math.sin(frequency * item + 0 + phase) * width + center;
      const blue = Math.sin(frequency * item + 4 + phase) * width + center;

      return this.RGB2Color(red, green, blue);
    },

    async addOptions() {
      await this.$apollo.mutate({
        mutation: createOptionMutation,
        // Parameters
        variables: {
          name: this.new_option,
          weight: 1,
        },
      });
      this.new_option = '';
      await this.$apollo.queries.options.refetch();
      await this.drawRouletteWheel();
    },

    removeOptions(id) {
      this.options = this.options.filter(option => option.id !== id);
      this.drawRouletteWheel();
    },

    drawRouletteWheel() {
      const canvas = this.$refs.rouletteCanvas;
      if (canvas.getContext) {
        const outsideRadius = 200;
        const textRadius = 160;
        const insideRadius = 125;

        this.ctx = canvas.getContext('2d');
        this.ctx.clearRect(0, 0, 500, 500);

        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 2;

        this.ctx.font = 'bold 12px Helvetica, Arial';

        for (let i = 0; i < this.options.length; i += 1) {
          const angle = this.startAngle + i * this.arc;
          // this.ctx.fillStyle = colors[i];
          this.ctx.fillStyle = this.getColor(i, this.options.length);

          this.ctx.beginPath();
          this.ctx.arc(250, 250, outsideRadius, angle, angle + this.arc, false);
          this.ctx.arc(250, 250, insideRadius, angle + this.arc, angle, true);
          this.ctx.stroke();
          this.ctx.fill();

          this.ctx.save();
          this.ctx.shadowOffsetX = -1;
          this.ctx.shadowOffsetY = -1;
          this.ctx.shadowBlur = 0;
          this.ctx.shadowColor = 'rgb(220,220,220)';
          this.ctx.fillStyle = 'black';
          this.ctx.translate(250 + Math.cos(angle + this.arc / 2) * textRadius,
            250 + Math.sin(angle + this.arc / 2) * textRadius);
          this.ctx.rotate(angle + this.arc / 2 + Math.PI / 2);
          const text = this.options[i].name;
          this.ctx.fillText(text, -this.ctx.measureText(text).width / 2, 0);
          this.ctx.restore();
        }

        // Arrow
        this.ctx.fillStyle = 'black';
        this.ctx.beginPath();
        this.ctx.moveTo(250 - 4, 250 - (outsideRadius + 5));
        this.ctx.lineTo(250 + 4, 250 - (outsideRadius + 5));
        this.ctx.lineTo(250 + 4, 250 - (outsideRadius - 5));
        this.ctx.lineTo(250 + 9, 250 - (outsideRadius - 5));
        this.ctx.lineTo(250 + 0, 250 - (outsideRadius - 13));
        this.ctx.lineTo(250 - 9, 250 - (outsideRadius - 5));
        this.ctx.lineTo(250 - 4, 250 - (outsideRadius - 5));
        this.ctx.lineTo(250 - 4, 250 - (outsideRadius + 5));
        this.ctx.fill();
      }
    },

    spin() {
      this.spinAngleStart = Math.random() * 10 + 10;
      this.spinTime = 0;
      this.spinTimeTotal = Math.random() * 3 + 4 * 1000;
      this.rotateWheel();
    },

    rotateWheel() {
      this.spinTime += 30;
      if (this.spinTime >= this.spinTimeTotal) {
        this.stopRotateWheel();
        return;
      }
      const spinAngle = this.spinAngleStart - this.easeOut(
        this.spinTime, 0, this.spinAngleStart, this.spinTimeTotal,
      );
      this.startAngle += (spinAngle * Math.PI / 180);
      this.drawRouletteWheel();

      const that = this;
      this.spinTimeout = setTimeout(() => {
        that.rotateWheel();
      }, 30);
    },

    stopRotateWheel() {
      clearTimeout(this.spinTimeout);
      const degrees = this.startAngle * 180 / Math.PI + 90;
      const arcd = this.arc * 180 / Math.PI;
      const index = Math.floor((360 - (degrees % 360)) / arcd);
      this.ctx.save();
      this.ctx.font = 'bold 30px Helvetica, Arial';
      const text = this.options[index].name;
      console.log(index, text, this.options);
      this.ctx.fillText(text, 250 - this.ctx.measureText(text).width / 2, 250 + 10);
      this.ctx.restore();
    },

    easeOut(t, b, c, d) {
      /* eslint-disable no-param-reassign */
      const ts = (t /= d) * t;
      const tc = ts * t;
      return b + c * (tc + -3 * ts + 3 * t);
    },
  },

  async mounted() {
    await this.$apollo.queries.options.refetch();
    await this.drawRouletteWheel();
  },
};
</script>
