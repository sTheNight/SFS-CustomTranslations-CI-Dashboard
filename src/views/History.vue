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
    NScrollbar,
    NSpin
} from 'naive-ui'
import { computed, h, onMounted, ref } from 'vue'
import { Home, Refresh } from '@vicons/ionicons5'
import RawInfoDialog from './RawInfoDialog.vue'
import ArtifactListItem from '@/components/ArtifactListItem.vue'
import { router } from '@/router'
import type { HistoryArtifacts } from '@/model/HistoryArtifacts'

const URL = import.meta.env.DEV
    ? import.meta.env.VITE_API_URL_DEVELOPMENT
    : import.meta.env.VITE_API_URL_PRODUCTION

const modal = useModal();
const message = useMessage()

const currentPage = ref(1)
const artifactList = ref<HistoryArtifacts | undefined>()
const isLoading = ref(false)

const totalPage = computed(() => {
    if (artifactList.value) {
        return Math.ceil(artifactList.value.total_count / 10)
    } else {
        return 1
    }
})

async function loadPage(targetPage: number) {
    if (isLoading.value || targetPage < 1 || targetPage > totalPage.value) return

    try {
        isLoading.value = true
        if (!URL) throw new Error('Environment variable VITE_API_URL is not defined')

        const res = await axios.get(`${URL}/history?page=${targetPage}`)
        const data = res.data

        if (data.length <= 0) {
            message.info('没有更多历史构建了')
            return
        }

        currentPage.value = targetPage
        artifactList.value = data
    } catch (err) {
        console.error(err)
        message.error('获取历史构建失败')
        artifactList.value = undefined;
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
                rawInfo: JSON.stringify(artifactList.value?.artifacts?.find((item) => item.id === id)),
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
        <NCard class="root-card" :bordered="false">
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

            <div class="card-content">
                <div class="list-wrapper">
                    <NScrollbar class="list-scrollbar">
                        <Transition name="placeholder-fade" mode="out-in">
                            <div v-if="isLoading" class="loading-placeholder">
                                <NSpin size="small" />
                                <NText depth="3">正在加载...</NText>
                            </div>
                        </Transition>
                        <NList hoverable clickable>
                            <NListItem v-for="artifact in artifactList?.artifacts" :key="artifact.id">
                                <ArtifactListItem :artifact="artifact" @download="downloadArtifact"
                                    @show-raw="showRawInfo" />
                            </NListItem>
                        </NList>
                    </NScrollbar>
                </div>

                <div class="pagination-footer">
                    <NFlex justify="space-between" align="center">
                        <NButton @click="goToPrevPage" :disabled="currentPage === 1 || isLoading">
                            上一页
                        </NButton>

                        <NText v-if="totalPage">{{ currentPage }} / {{ totalPage }}</NText>

                        <NButton @click="goToNextPage" :disabled="isLoading || currentPage >= totalPage">
                            下一页
                        </NButton>
                    </NFlex>
                </div>
            </div>
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
    max-height: 100%;
    box-shadow: var(--n-box-shadow);
    border-radius: 16px;
}

.root-card :deep(.n-card__content) {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 0;
    overflow: hidden;
}

.card-content {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
    padding: 0 16px 16px;
    overflow: hidden;
}

.list-wrapper {
    flex: 1;
    min-height: 0;
    position: relative;
}

.list-scrollbar {
    height: 100%;
}

.pagination-footer {
    flex-shrink: 0;
    padding-top: 12px;
    border-top: 1px solid var(--n-border-color);
}

.loading-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
    justify-content: center;
    text-align: center;
    backdrop-filter: blur(4px);
    background-color: rgba($color: #fff, $alpha: 0.75);
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 10;
    top: 0;
    left: 0;
    row-gap: 8px;
}

.placeholder-fade-enter-active,
.placeholder-fade-leave-active {
    transition: opacity .2s;
}

.placeholder-fade-enter-from,
.placeholder-fade-leave-to {
    opacity: 0;
}
</style>