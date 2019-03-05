<template>
  <div class="container" v-loading.fullscreen.lock="$apollo.loading">
    <div class="columns">
      <div class="column">
        <div class="columns is-centered">
          <el-button
            type="danger"
            @click="spin"
            class="fas fa-compass"
            :disabled="options.length === 0"> GO</el-button>
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
              :visible.sync="selectMemberVisible"
              width="600px"
              center>
              <el-button
                class="fas fa-user-edit"
                style="margin: 0.5em;"
                @click="editMemberVisible = true" circle/>
              <el-dialog
                width="600px"
                title="メンバー管理"
                :visible.sync="editMemberVisible"
                append-to-body
                center>
                <el-form :inline="true" @submit.native.prevent>
                  <el-form-item>
                    <el-input
                      v-model="addMemberName"
                      size="mini"
                      placeholder="Input member name"/>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="handleAddMember">Add</el-button>
                  </el-form-item>
                </el-form>
                <el-table
                  :data="members"
                  style="width: 100%">
                  <el-table-column
                    type="index">
                  </el-table-column>
                  <el-table-column
                    label="Name"
                    prop="name">
                  </el-table-column>
                  <el-table-column
                    align="right">
                    <template slot-scope="scope">
                      <el-button
                        size="mini"
                        type="danger"
                        @click="handleMemberDelete(scope.row)">Delete</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-dialog>
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
              :visible.sync="selectItemVisible"
              width="600px"
              center>
              <el-button
                class="fas fa-user-edit"
                style="margin: 0.5em;"
                @click="editItemVisible = true" circle/>
              <el-dialog
                width="600px"
                title="賞品管理"
                :visible.sync="editItemVisible"
                append-to-body
                center>
                <el-form :inline="true" @submit.native.prevent>
                  <el-form-item>
                    <el-input
                      v-model="addItemName"
                      size="mini"
                      placeholder="Input item name"/>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="handleAddItem">Add</el-button>
                  </el-form-item>
                </el-form>
                <el-table
                  :data="items"
                  style="width: 100%">
                  <el-table-column
                    type="index">
                  </el-table-column>
                  <el-table-column
                    label="Name"
                    prop="name">
                  </el-table-column>
                  <el-table-column
                    align="right">
                    <template slot-scope="scope">
                      <el-button
                        size="mini"
                        type="danger"
                        @click="handleItemDelete(scope.row)">Delete</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-dialog>
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
            <el-button
              type="success"
              @click="selectMemberVisible = true"
              class="fas fa-address-card"
              circle/>
            <el-button
              type="warning"
              @click="selectItemVisible = true"
              class="fas fa-gift"
              circle/>
          </div>
        </div>
        <div class="columns is-multiline" v-if="options.length > 0">
          <div class="column">
            <h1 class="title">候補</h1>
            <el-popover
              placement="bottom"
              width="200"
              trigger="hover"
              v-for="o in options" :key="o.id">
              <el-input-number
                v-model="o.weight"
                :min="1"
                :max="100"
                @change="handleChangeWeight"
                label="倍率">
              </el-input-number>
              <el-tag
                slot="reference"
                style="margin: 0.5em;"
                @close="removeOptions(o.id)"
                closable>{{ o.name }}
              </el-tag>
            </el-popover>
          </div>
        </div>
        <div class="columns is-multiline" v-if="gotOptions.length > 0">
          <div class="column">
            <h1 class="title">当選</h1>
              <el-tag v-for="o in gotOptions" :key="o.id"
                style="margin: 0.5em;"
                type="danger"
                @close="removeGotOptions(o.id)"
                closable>{{ o.name }}
              </el-tag>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { MembersQuery, ItemsQuery } from '../graphql/query';
import {
  createMemberMutation,
  createItemMutation,
  deleteMemberMutation,
  deleteItemMutation,
} from '../graphql/mutaion';

export default {
  apollo: {
    members: {
      query: MembersQuery,
    },
    items: {
      query: ItemsQuery,
    },
  },
  data() {
    return {
      selectMemberVisible: false,
      editMemberVisible: false,
      selectItemVisible: false,
      editItemVisible: false,
      addMemberName: null,
      addItemName: null,
      selectedMembers: [],
      selectedItems: [],
      members: [],
      items: [],
      options: [],
      gotOptions: [],
      startAngle: 0,
      startAngleStart: 0,
      spinTimeout: null,
      spinArcStart: 10,
      spinTime: 0,
      spinTimeTotal: 0,
      ctx: null,
    };
  },
  computed: {
    arc() {
      return Math.PI / (this.options.reduce(
        (acc, cur) => ({ weight: acc.weight + cur.weight }),
      ).weight / 2);
    },
  },
  mounted() {
    this.drawRouletteWheel();
  },

  methods: {
    async handleAddMember() {
      await this.$apollo.mutate({
        // Query
        mutation: createMemberMutation,
        // Parameters
        variables: {
          name: this.addMemberName,
          weight: 1,
        },
      });
      await this.$apollo.queries.members.refetch();
      this.addMemberName = '';
    },
    async handleMemberDelete(row) {
      await this.$apollo.mutate({
        // Query
        mutation: deleteMemberMutation,
        // Parameters
        variables: {
          id: row.id,
        },
      });
      await this.$apollo.queries.members.refetch();
    },
    handleMemberChange(selectedKeys) {
      this.options = [];
      this.selectedItems = [];
      selectedKeys.forEach((key) => {
        this.options.push(this.members.find(m => m.id === key));
      });
      this.drawRouletteWheel();
    },
    async handleAddItem() {
      await this.$apollo.mutate({
        // Query
        mutation: createItemMutation,
        // Parameters
        variables: {
          name: this.addItemName,
          weight: 1,
        },
      });
      await this.$apollo.queries.items.refetch();
      this.addItemName = '';
    },
    async handleItemDelete(row) {
      await this.$apollo.mutate({
        // Query
        mutation: deleteItemMutation,
        // Parameters
        variables: {
          id: row.id,
        },
      });
      await this.$apollo.queries.items.refetch();
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
    removeGotOptions(id) {
      this.gotOptions = this.gotOptions.filter(option => option.id !== id);
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

        let { startAngle } = this;
        for (let i = 0; i < this.options.length; i += 1) {
          const weightArc = this.arc * this.options[i].weight;
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
          this.ctx.translate(250 + Math.cos(startAngle + weightArc / 2) * textRadius,
            250 + Math.sin(startAngle + weightArc / 2) * textRadius);
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
        this.ctx.lineTo(250 + 0, 250 - (outsideRadius - 13));
        this.ctx.lineTo(250 - 9, 250 - (outsideRadius - 5));
        this.ctx.lineTo(250 - 4, 250 - (outsideRadius - 5));
        this.ctx.lineTo(250 - 4, 250 - (outsideRadius + 5));
        this.ctx.fill();
      }
    },
    spin() {
      if (this.options.length === 0) {
        return;
      }
      this.spinAngleStart = Math.random() * 1000 + 10;
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
      const weightOptions = [];
      this.options.forEach((option) => {
        for (let i = 0; i < option.weight; i += 1) {
          weightOptions.push(option);
        }
      });
      const gotOption = weightOptions[index];
      this.gotOptions.push(gotOption);
      this.ctx.fillText(
        gotOption.name,
        250 - this.ctx.measureText(gotOption.name).width / 2, 250 + 10,
      );
      this.ctx.restore();

      setTimeout(() => {
        this.removeOptions(gotOption.id);
      }, 2000);
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
