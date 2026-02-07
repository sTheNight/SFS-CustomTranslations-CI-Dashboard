<script setup lang="ts">
import { NResult, NButton, NLayout, NFlex } from 'naive-ui'
import { useRouter } from 'vue-router'
const router = useRouter()
</script>
<template>
    <NLayout class="home-content-box">
        <NResult status="404" title="404 资源不存在" description="为什么总是求而不得呢？">

            <template #footer>
                <NFlex justify="center">
                    <NButton @click="router.back()">上一页</NButton>
                    <NButton @click="router.push('/')">回到主页</NButton>
                </NFlex>
            </template>
        </NResult>
    </NLayout>
</template>
<style scoped lang="scss">
.home-content-box {
    min-height: 100vh;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    padding: 24px;
}
</style>
