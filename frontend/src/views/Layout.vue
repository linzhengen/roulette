<template>
  <div>
    <app-header></app-header>
    <section class="section">
      <transition>
        <router-view></router-view>
      </transition>
    </section>
  </div>
</template>

<script>
import AppHeader from '../components/AppHeader.vue';

export default {
  name: 'Layout',
  components: { AppHeader },
};
</script>
