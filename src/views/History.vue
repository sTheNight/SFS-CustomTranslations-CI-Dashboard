<script setup lang="ts">
import axios from 'axios'
import {
    NCard,
    NList,
    NText,
    useModal,
    useMessage,
    NListItem,
    NFlex,
    NButton,
    NIcon,
    NScrollbar
} from 'naive-ui'
import { h, onMounted, ref } from 'vue'
import { Home, Refresh } from '@vicons/ionicons5'
import RawInfoDialog from './RawInfoDialog.vue'
import ArtifactListItem from '@/components/ArtifactListItem.vue'
import type { ArtifactInfo } from '@/model/artifactInfo'
import { router } from '@/router'

const URL = import.meta.env.DEV
    ? import.meta.env.VITE_API_URL_DEVELOPMENT
    : import.meta.env.VITE_API_URL_PRODUCTION

const modal = useModal();
const message = useMessage()

const currentPage = ref(1)
const artifactList = ref<Array<ArtifactInfo>>([])
const isLoading = ref(false)

async function loadPage(targetPage: number) {
    if (isLoading.value || targetPage < 1) return

    try {
        isLoading.value = true
        if (!URL) throw new Error('Environment variable VITE_API_URL is not defined')

        const res = await axios.get(`${URL}/history?page=${targetPage}`)
        const data = res.data.artifacts as Array<ArtifactInfo>

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
        content: () =>
            h(RawInfoDialog, {
                rawInfo: JSON.stringify(artifactList.value.find((item) => item.id === id)),
            }),
    })
}

function downloadArtifact(id?: string) {
    if (!id) return
    window.open(`${URL}/artifact/${id}`, '_blank')
}
</script>

<template>
    <div class="container">
        <NCard class="root-card" :bordered="false"
            content-style="display: flex; flex-direction: column; height: 100%; overflow: hidden; padding-right: 0;">
            <template #header>
                <NText type="primary">历史构建</NText>
            </template>
            <template #header-extra>
                <NButton quaternary circle @click="router.push('/')">
                    <template #icon>
                        <NIcon>
                            <Home />
                        </NIcon>
                    </template>
                </NButton>
                <NButton quaternary circle :disabled="isLoading" :loading="isLoading" @click="loadPage(currentPage)">
                    <template #icon>
                        <NIcon>
                            <Refresh />
                        </NIcon>
                    </template>
                </NButton>
            </template>

            <div v-if="isLoading && artifactList.length === 0" class="loading-placeholder">
                <NText depth="3">正在加载...</NText>
            </div>

            <template v-else>
                <div class="list-container">
                    <NScrollbar trigger="none">
                        <div style="padding-right: 24px;">
                            <NList hoverable :loading="isLoading">
                                <NListItem v-for="artifact in artifactList" :key="artifact.id">
                                    <ArtifactListItem :artifact="artifact" @download="downloadArtifact"
                                        @show-raw="showRawInfo" />
                                </NListItem>
                            </NList>
                        </div>
                    </NScrollbar>
                </div>

                <div class="pagination-footer">
                    <NFlex justify="space-between" align="center">
                        <NButton @click="goToPrevPage" :disabled="currentPage === 1 || isLoading" :loading="isLoading">
                            上一页
                        </NButton>

                        <NText>第 {{ currentPage }} 页</NText>

                        <NButton @click="goToNextPage" :disabled="isLoading" :loading="isLoading">
                            下一页
                        </NButton>
                    </NFlex>
                </div>
            </template>
        </NCard>
    </div>
</template>

<style scoped lang="scss">
.container {
    height: 100vh;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 24px;
    background-color: #f5f5f5;
    box-sizing: border-box;
    overflow: hidden;
}

.root-card {
    width: min(100%, 500px);
    height: 100%;
    box-shadow: var(--n-box-shadow);
    border-radius: 16px;
    display: flex;
    flex-direction: column;
}

.list-container {
    flex: 1;
    overflow: hidden;
    position: relative;
}

.pagination-footer {
    padding-top: 12px;
    padding-right: 24px;
    flex-shrink: 0;
}

.loading-placeholder,
.error-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    text-align: center;
}

.error-placeholder {
    .n-button {
        margin-top: 8px;
    }
}
</style>