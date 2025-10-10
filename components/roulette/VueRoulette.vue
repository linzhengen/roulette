<template>
  <div class="roulette-container">
    <div class="columns">
      <div class="column">
        <div class="columns is-centered">
          <button
            class="button is-danger"
            @click="spin"
            :disabled="options.length === 0">
            <span class="icon">
              <i class="fas fa-compass"></i>
            </span>
            <span>GO</span>
          </button>
        </div>
        <div class="columns is-centered">
          <canvas ref="rouletteCanvas" width="500" height="500"></canvas>
        </div>
      </div>
      <div class="column">
        <div class="columns is-multiline">
          <div class="column">
            <div class="field is-grouped">
              <div class="control">
                <input
                  v-model="newOptionName"
                  class="input"
                  type="text"
                  placeholder="Add new option"
                  @keyup.enter="addOption"
                />
              </div>
              <div class="control">
                <button class="button is-primary" @click="addOption">
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="columns is-multiline" v-if="options.length > 0">
          <div class="column">
            <h1 class="title is-4">候補</h1>
            <div class="tags">
              <div
                v-for="option in options"
                :key="option.id"
                class="tag is-medium"
                :style="{ backgroundColor: getOptionColor(option.id) }"
              >
                {{ option.name }}
                <div class="field has-addons has-addons-centered" style="margin-left: 10px;">
                  <div class="control">
                    <input
                      v-model.number="option.weight"
                      class="input is-small"
                      type="number"
                      min="1"
                      max="100"
                      style="width: 60px;"
                      @change="updateWeight"
                    />
                  </div>
                </div>
                <button class="delete is-small" @click="removeOption(option.id)"></button>
              </div>
            </div>
          </div>
        </div>
        <div class="columns is-multiline" v-if="gotOptions.length > 0">
          <div class="column">
            <h1 class="title is-4">当選</h1>
            <div class="tags">
              <div
                v-for="option in gotOptions"
                :key="option.id"
                class="tag is-danger is-medium"
              >
                {{ option.name }}
                <button class="delete is-small" @click="removeGotOption(option.id)"></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import RouletteCore from './RouletteCore.js';

let optionIdCounter = 1;

function generateColor(id) {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ];
  return colors[id % colors.length];
}

export default {
  name: 'VueRoulette',
  setup() {
    const rouletteCanvas = ref(null);
    const newOptionName = ref('');
    const options = ref([]);
    const gotOptions = ref([]);
    const rouletteCore = ref(null);
    const optionColors = ref({});

    const loadFromLocalStorage = () => {
      const savedOptions = localStorage.getItem('rouletteOptions');
      if (savedOptions) {
        options.value = JSON.parse(savedOptions);
        // Ensure all options have IDs
        options.value.forEach(option => {
          if (!option.id) {
            option.id = optionIdCounter++;
          }
          if (!option.weight) {
            option.weight = 1;
          }
        });
      }
    };

    const saveToLocalStorage = () => {
      localStorage.setItem('rouletteOptions', JSON.stringify(options.value));
    };

    const getOptionColor = (id) => {
      if (!optionColors.value[id]) {
        optionColors.value[id] = generateColor(id);
      }
      return optionColors.value[id];
    };

    const addOption = () => {
      if (newOptionName.value.trim()) {
        const newOption = {
          id: optionIdCounter++,
          name: newOptionName.value.trim(),
          weight: 1
        };
        options.value.push(newOption);
        newOptionName.value = '';
        saveToLocalStorage();
      }
    };

    const removeOption = (id) => {
      options.value = options.value.filter(option => option.id !== id);
      saveToLocalStorage();
    };

    const removeGotOption = (id) => {
      gotOptions.value = gotOptions.value.filter(option => option.id !== id);
    };

    const updateWeight = () => {
      saveToLocalStorage();
    };

    const spin = () => {
      if (rouletteCore.value) {
        rouletteCore.value.spin((result) => {
          gotOptions.value.push(result);
          setTimeout(() => {
            removeOption(result.id);
          }, 2000);
        });
      }
    };

    onMounted(() => {
      loadFromLocalStorage();
      if (rouletteCanvas.value) {
        rouletteCore.value = new RouletteCore(rouletteCanvas.value);
      }
    });

    watch(options, (newOptions) => {
      if (rouletteCore.value) {
        rouletteCore.value.setOptions(newOptions);
      }
    }, { deep: true });

    return {
      rouletteCanvas,
      newOptionName,
      options,
      gotOptions,
      addOption,
      removeOption,
      removeGotOption,
      updateWeight,
      spin,
      getOptionColor
    };
  }
};
</script>

<style scoped>
.roulette-container {
  padding: 20px;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag {
  display: flex;
  align-items: center;
  gap: 5px;
}

.columns.is-centered {
  justify-content: center;
}
</style>