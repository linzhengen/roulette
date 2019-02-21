<template>
  <div class="container">
    <div class="columns">
      <div class="column">
        <div class="columns is-centered">
          <input
            type="button"
            class="button is-danger"
            value="SPIN ROULETTE"
            @click="spin"
          />
        </div>
        <div class="columns is-centered">
          <canvas ref="rouletteCanvas" width="500" height="500"></canvas>
        </div>
      </div>
      <div class="column">
        <div class="columns is-multiline">
          <div class="column">
            <el-dialog
              title="メンバーから追加"
              :visible.sync="addMemberVisible"
              width="600px"
              center>
              <el-transfer
                v-model="selectedMembers"
                :titles="['候補', '対象']"
                :props="{
                  key: 'id',
                  label: 'name'
                }"
                filterable
                @change="handleMemberChange"
                :data="members">
              </el-transfer>
            </el-dialog>
            <el-dialog
              title="賞品から追加"
              :visible.sync="addItemVisible"
              width="600px"
              center>
              <el-transfer
                v-model="selectedItems"
                :titles="['候補', '対象']"
                :props="{
                  key: 'id',
                  label: 'name'
                }"
                filterable
                @change="handleItemChange"
                :data="items">
              </el-transfer>
            </el-dialog>
            <el-button type="success" @click="addMemberVisible = true" round>メンバーから追加</el-button>
            <el-button type="warning" @click="addItemVisible = true" round>賞品から追加</el-button>
          </div>
        </div>
        <div class="columns is-multiline">
          <div class="column">
            <el-popover
              placement="bottom"
              width="320"
              trigger="click"
              v-for="o in options" :key="o.id">
              <el-form label-width="80px">
                <el-form-item label="倍率">
                  <el-input-number
                    v-model="o.weight"
                    :min="1"
                    :max="10"
                    @change="handleChangeWeight"
                    label="倍率">
                  </el-input-number>
                </el-form-item>
              </el-form>
              <el-tag
                slot="reference"
                style="margin: 0.5em;"
                @close="removeOptions(o.id)"
                closable>{{ o.name }}
              </el-tag>
            </el-popover>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { MembersQuery, ItemsQuery } from '../graphql/query';
// import { createItemMutation, createMemberMutation } from '../graphql/mutaion';

export default {
  data() {
    return {
      addMemberVisible: false,
      addItemVisible: false,
      options: [],
      selectedMembers: [],
      selectedItems: [],
      members: [],
      items: [],
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
      return Math.PI / (this.options.reduce(
        (acc, cur) => ({ weight: acc.weight + cur.weight }),
      ).weight / 2);
    },
  },
  async mounted() {
    this.members = (await this.$apollo.query({
      query: MembersQuery,
      loadingKey: 'loading',
    })).data.members;
    this.items = (await this.$apollo.query({
      query: ItemsQuery,
      loadingKey: 'loading',
    })).data.items;
    await this.drawRouletteWheel();
  },

  methods: {
    handleMemberChange(selectedKeys) {
      this.options = [];
      this.selectedItems = [];
      selectedKeys.forEach((key) => {
        this.options.push(this.members.find(m => m.id === key));
      });
      this.drawRouletteWheel();
    },
    handleItemChange(selectedKeys) {
      this.options = [];
      this.selectedMembers = [];
      selectedKeys.forEach((key) => {
        this.options.push(this.items.find(m => m.id === key));
      });
      this.drawRouletteWheel();
    },
    removeOptions(id) {
      this.options = this.options.filter(option => option.id !== id);
      this.selectedItems.splice(this.selectedItems.indexOf(id), 1);
      this.selectedMembers.splice(this.selectedMembers.indexOf(id), 1);
      this.drawRouletteWheel();
    },
    handleChangeWeight() {
      this.drawRouletteWheel();
    },
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
          const weightArc = this.arc * this.options[i].weight;
          const angle = this.startAngle + i * weightArc;
          // this.ctx.fillStyle = colors[i];
          this.ctx.fillStyle = this.getColor(i, this.options.length);

          this.ctx.beginPath();
          this.ctx.arc(250, 250, outsideRadius, angle, angle + weightArc, false);
          this.ctx.arc(250, 250, insideRadius, angle + weightArc, angle, true);
          this.ctx.stroke();
          this.ctx.fill();

          this.ctx.save();
          this.ctx.shadowOffsetX = -1;
          this.ctx.shadowOffsetY = -1;
          this.ctx.shadowBlur = 0;
          this.ctx.shadowColor = 'rgb(220,220,220)';
          this.ctx.fillStyle = 'black';
          this.ctx.translate(250 + Math.cos(angle + weightArc / 2) * textRadius,
            250 + Math.sin(angle + weightArc / 2) * textRadius);
          this.ctx.rotate(angle + weightArc / 2 + Math.PI / 2);
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
};
</script>
