<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    avatarLink: string
    name: string
    href: string
    leftPadding?: number
  }>(),
  {
    leftPadding: 2,
  },
)
import { NElement, NAvatar } from 'naive-ui'
</script>

<template>
  <NElement
    tag="a"
    class="avatar-link"
    :href="href"
    :style="{ '--left-padding': `${leftPadding}px` }"
  >
    <NAvatar class="user-avatar" :size="18" round :src="avatarLink" />
    {{ name }}
  </NElement>
</template>

<style lang="scss" scoped>
.avatar-link {
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
  gap: 4px;
  color: var(--primary-color);
  text-decoration: none;
  padding: 0 6px 0 var(--left-padding);
  border-radius: 50px;
  border: 1px solid var(--n-border-color);
  outline: 0;
  transition: all 0.15s;

  &:hover,
  &:focus {
    border-color: var(--primary-color);
  }
}
</style>
