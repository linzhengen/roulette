<template>
  <div>
    <app-header/>
    <section class="section">
      <transition>
        <router-view></router-view>
      </transition>
    </section>
    <app-footer/>
  </div>
</template>

<script>
import AppHeader from '../components/AppHeader.vue';
import AppFooter from '../components/AppFooter.vue';

export default {
  name: 'Layout',
  comments: {
    AppHeader,
    AppFooter,
  },
};
</script>
