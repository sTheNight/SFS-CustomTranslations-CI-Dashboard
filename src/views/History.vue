<script setup lang="ts">
import axios from 'axios'
import { NCard, NList, NText, createDiscreteApi, lightTheme, NListItem, NFlex, NButton } from 'naive-ui'
import { h, onMounted, ref } from 'vue'
import RawInfoDialog from './RawInfoDialog.vue'
import ArtifactListItem from '@/components/ArtifactListItem.vue'
import type { ArtifactInfo } from '@/model/artifactInfo'

const URL = import.meta.env.DEV
    ? import.meta.env.VITE_API_URL_DEVELOPMENT
    : import.meta.env.VITE_API_URL_PRODUCTION

const { message, modal } = createDiscreteApi(['message', 'modal'], {
    configProviderProps: {
        theme: lightTheme,
    },
})

const currentPage = ref(1)
const artifactList = ref<Array<ArtifactInfo>>([])
const isLoading = ref(false)

async function loadPage(targetPage: number) {
    if (isLoading.value || targetPage < 1) return

    try {
        isLoading.value = true
        if (!URL) throw new Error('Environment variable VITE_API_URL is not defined')

        const res = await axios.get(`${URL}/history?page=${targetPage}`)
        const data = res.data as Array<ArtifactInfo>

        if (data.length <= 0) {
            message.info('没有更多历史构建了')
            return
        }

        currentPage.value = targetPage
        artifactList.value = data
    } catch (err) {
        console.error(err)
        message.error('获取历史构建失败')
        artifactList.value = []
    } finally {
        isLoading.value = false
    }
}

function goToNextPage() {
    loadPage(currentPage.value + 1)
}

function goToPrevPage() {
    loadPage(currentPage.value - 1)
}

onMounted(() => {
    loadPage(1)
})

function showRawInfo(id?: string) {
    if (!id) return
    modal.create({
        title: 'Raw',
        class: 'raw-modal',
        preset: 'card',
        content: () => h(RawInfoDialog, { rawInfo: JSON.stringify(artifactList.value.find(item => item.id === id)) })
    })
}

function downloadArtifact(id?: string) {
    if (!id) return
    window.open(`${URL}/artifact/${id}`, '_blank')
}
</script>

<template>
    <div class="container">
        <NCard class="root-card" :bordered="false">
            <template #header>
                <NText type="primary">历史构建</NText>
            </template>

            <div v-if="isLoading && artifactList.length === 0" class="loading-placeholder">
                <NText depth="3">正在加载...</NText>
            </div>

            <template v-else>
                <NList hoverable :loading="isLoading">
                    <NListItem v-for="artifact in artifactList" :key="artifact.id">
                        <ArtifactListItem :artifact="artifact" @download="downloadArtifact" @show-raw="showRawInfo" />
                    </NListItem>
                </NList>

                <NFlex justify="space-between" align="center" style="margin-top: 12px;">
                    <NButton @click="goToPrevPage" :disabled="currentPage === 1 || isLoading" :loading="isLoading">
                        Previous
                    </NButton>

                    <NText>第 {{ currentPage }} 页</NText>

                    <NButton @click="goToNextPage" :disabled="isLoading" :loading="isLoading">
                        Next
                    </NButton>
                </NFlex>
            </template>
        </NCard>
    </div>
</template>

<style scoped lang="scss">
.container {
    min-height: 100vh;
    box-sizing: border-box;
    width: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    padding: 24px;
}

.root-card {
    width: min(100%, 500px);
    box-shadow: var(--n-box-shadow);
    border-radius: 16px;
}

.loading-placeholder,
.error-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
    text-align: center;
}

.error-placeholder {
    .n-button {
        margin-top: 8px;
    }
}
</style>