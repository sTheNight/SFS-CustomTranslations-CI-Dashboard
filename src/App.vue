<script setup lang="ts">
import { NConfigProvider } from 'naive-ui';
</script>

<template>
    <NConfigProvider>
        <RouterView v-slot="{ Component }">
            <Transition name="fade" mode="out-in">
                <component :is="Component"></component>
            </Transition>
        </RouterView>
    </NConfigProvider>
</template>

<style lang="scss">
.fade-enter-active,
.fade-leave-active {
    transition: all .2s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    filter: blur(16px);
}

.fade-enter-to,
.fade-leave-from {
    opacity: 1;
    filter: blur(0);
}

body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.raw-modal {
    width: min(500px, 100vw) !important;
}
</style>
