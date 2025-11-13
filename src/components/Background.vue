<script setup lang="ts"></script>
<template>
  <div class="background-overlay">
    <!-- 这个背景的写法也很傻逼 -->
    <div
      style="
        background: linear-gradient(#6be866, #65bee6);
        width: 300px;
        height: 300px;
        border-radius: 50%;
        position: absolute;
        top: -100px;
        left: -100px;
      "
    ></div>
    <div
      style="
        background: linear-gradient(#b3e866, #65e6d6);
        width: 300px;
        height: 300px;
        border-radius: 50%;
        position: absolute;
        bottom: -50px;
        right: -50px;
      "
    ></div>
    <div
      style="
        background: linear-gradient(#b3e866, #65e6d6);
        width: 300px;
        height: 300px;
        border-radius: 50%;
        position: absolute;
        bottom: 50%;
        right: 50%;
      "
    ></div>
    <span style="position: absolute; right: 0; top: 0"> 看不到我~看不到我~ </span>
  </div>
</template>
<style lang="scss" scoped>
.background-overlay {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 0;
  filter: blur(64px);
}
</style>
