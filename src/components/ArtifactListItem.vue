<script setup lang="ts">
import { getFormatDate } from '@/utils'
import { NButton, NFlex, NTag, NText, NH3, NIcon } from 'naive-ui'
import { ArrowDown, Code } from '@vicons/ionicons5'
import { CheckmarkCircle, CloseCircle } from '@vicons/ionicons5'
const props = defineProps({
    artifact: { type: Object, required: true },
})
defineEmits(['download', 'show-raw'])
</script>

<template>
    <div class="list-item-box">
        <div class="list-item-title">
            <NH3 style="margin: 0">
                <NText type="primary">{{ artifact.name }}</NText>
            </NH3>
            <NTag round :bordered="false" :type="props.artifact.expired ? 'error' : 'success'"
                :key="props.artifact.expired ? 'f' : 't'">
                {{ props.artifact.expired ? '已过期' : '可用' }}
                <template #icon>
                    <NIcon :component="props.artifact.expired ? CloseCircle : CheckmarkCircle" />
                </template>
            </NTag>
        </div>
        <div class="list-item-content">
            <NFlex justify="space-between">
                <div>
                    <NText>ID: {{ artifact.id }}</NText>
                </div>
                <div>
                    <NText>Created at: {{ getFormatDate(artifact.created_at) }}</NText>
                </div>
            </NFlex>
            <NFlex justify="space-between" style="margin-top: 4px">
                <div>
                    <NText>Size: {{ ((artifact.size_in_bytes ?? 0) / 1024 / 1024).toFixed(2) }} MB</NText>
                </div>
                <div>
                    <NText>Expires at: {{ artifact.expires_at ? getFormatDate(artifact.expires_at) : 'Unknown' }}
                    </NText>
                </div>
            </NFlex>
        </div>
        <NFlex class="list-item-actions" justify="space-between">
            <NButton size="small" @click="$emit('show-raw', artifact.id)" quaternary>
                <template #icon>
                    <Code />
                </template>
                Raw
            </NButton>
            <NButton type="primary" @click="$emit('download', artifact.id)" size="small" :disabled="artifact.expired">
                <template #icon>
                    <ArrowDown />
                </template>
                下载
            </NButton>
        </NFlex>
    </div>
</template>

<style lang="scss" scoped>
.list-item-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.list-item-content {
    padding: 12px 0;
}

.list-item-box {
    cursor: default;
}
</style>
