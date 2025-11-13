<script setup lang="ts">
import Background from '@/components/Background.vue'
import { NLayout } from 'naive-ui'
</script>
<template>
  <NLayout embedded>
    <Background />
    <RouterView v-slot="{ Component }">
      <Transition name="fade" mode="out-in">
        <component :is="Component"></component>
      </Transition>
    </RouterView>
  </NLayout>
</template>
<style lang="scss" scoped></style>
