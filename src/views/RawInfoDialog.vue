<script setup lang="ts">
import { computed } from 'vue'
import { NCode, NScrollbar, NConfigProvider } from 'naive-ui'
import hljs from 'highlight.js/lib/core'
import json from 'highlight.js/lib/languages/json'
hljs.registerLanguage('json', json)

const props = defineProps({
    rawInfo: {
        type: String,
        default: '{}',
    },
})

const formattedJson = computed(() => {
    if (!props.rawInfo?.trim()) return ''
    try {
        const obj = JSON.parse(props.rawInfo)
        return JSON.stringify(obj, null, 2)
    } catch (error) {
        return props.rawInfo
    }
})
</script>

<template>
    <NConfigProvider :hljs="hljs">
        <NScrollbar x-scrollable>
            <NCode :code="formattedJson" language="json" />
        </NScrollbar>
    </NConfigProvider>
</template>

<style scoped>
:deep(.n-code__pre) {
    white-space: pre !important;
    overflow-x: auto;
}
</style>
