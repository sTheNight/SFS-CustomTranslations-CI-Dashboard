<script setup lang="ts">
import axios from 'axios'
import {
    NCard,
    NLayout,
    NText,
    NButton,
    NSkeleton,
    NFlex,
    NTag,
    NIcon,
    NTable,
    NTbody
} from 'naive-ui'
import { ref, reactive, onMounted, h, computed } from 'vue'
import {
    LogoGithub,
    CheckmarkCircle,
    ArrowDown,
    Refresh,
    CloseCircle,
    InformationCircle,
    Code,
    Copy,
    BookmarksSharp
} from '@vicons/ionicons5'
import { createDiscreteApi, lightTheme } from 'naive-ui'
import AboutDialog from './AboutDialog.vue'
import RawInfoDialog from './RawInfoDialog.vue'
import { useRouter } from 'vue-router'
import Background from '@/components/Background.vue'
import { type ArtifactInfo } from '@/model/artifactInfo'
import { getFormatDate } from '@/utils'

const { modal, message } = createDiscreteApi(['modal', 'message'], {
    configProviderProps: {
        theme: lightTheme,
    },
})

const router = useRouter()

const URL = import.meta.env.DEV
    ? import.meta.env.VITE_API_URL_DEVELOPMENT
    : import.meta.env.VITE_API_URL_PRODUCTION

const isLoading = ref(true)
const sucessFetch = ref(false)

const buildInfo = reactive<ArtifactInfo>({})
const rawBuildInfo = ref('')

async function fetchData() {
    try {
        if (!URL) throw new Error('Environment variable VITE_API_URL is not defined')

        isLoading.value = true
        const res = await axios.get(`${URL}/info/latest`)

        buildInfo.id = res.data.id ?? 'Fetch failed'
        buildInfo.size_in_bytes = res.data.size_in_bytes ?? 0
        buildInfo.expired = (res.data.expired as boolean) ?? false
        buildInfo.created_at = res.data.created_at
        buildInfo.updated_at = res.data.updated_at
        buildInfo.expires_at = res.data.expires_at
        buildInfo.name = res.data.name ?? 'Fetch failed'
        buildInfo.digest = res.data.digest
        rawBuildInfo.value = JSON.stringify(res.data, null, 2)

        isLoading.value = false
        sucessFetch.value = true
    } catch (error) {
        message.error('获取构建信息失败')
        console.error(`Error fetching data: ${error}`)
        isLoading.value = false
        sucessFetch.value = false
    }
}

function handleDownload() {
    window.location.href = `${URL}/artifact/latest`
}

function openGithub() {
    window.open('https://github.com/youfeng11/SFS-CustomTranslations-Installer', '_blank')
}

function aboutButtonClick() {
    modal.create({
        title: 'About',
        content: () => h(AboutDialog),
        preset: 'card',
        class: 'raw-modal',
    })
}

function rowButtonClick() {
    modal.create({
        title: 'Raw',
        content: () => h(RawInfoDialog, { rawInfo: rawBuildInfo.value }),
        preset: 'card',
        class: 'raw-modal',
    })
}

function digestClick() {
    navigator.clipboard
        .writeText(buildInfo.digest ?? 'Null')
        .then(() => {
            message.success('复制成功')
        })
        .catch((error) => {
            console.log(`Failed to copy text: ${error}`)
            message.error('复制失败')
        })
}

const isAvailable = computed(() => {
    return sucessFetch.value && !isLoading.value && !buildInfo.expired
})

onMounted(fetchData)
</script>

<template>
    <NLayout embedded>
        <Background></Background>
        <div class="container">
            <NCard class="root-card" :bordered="false">
                <template #header>
                    <NText type="primary">最新构建</NText>
                </template>
                <template #header-extra>
                    <Transition name="fade" mode="out-in">
                        <!-- 这个 key 的写法也很傻逼 -->
                        <NTag round :bordered="false" :type="isAvailable ? 'success' : 'error'"
                            :key="isAvailable ? 't' : 'f'">
                            {{ isAvailable ? '可用' : buildInfo.expired ? '已过期' : '不可用' }}
                            <template #icon>
                                <NIcon :component="isAvailable ? CheckmarkCircle : CloseCircle" />
                            </template>
                        </NTag>
                    </Transition>
                </template>
                <NSkeleton height="285px" width="100%" v-if="isLoading" />
                <div v-else-if="!isLoading && sucessFetch">
                    <NTable :bordered="true" :single-line="false" striped style="table-layout: fixed">
                        <NTbody>
                            <tr>
                                <td>ID</td>
                                <td>{{ buildInfo.id }}</td>
                            </tr>
                            <tr>
                                <td>Size</td>
                                <td>{{ ((buildInfo.size_in_bytes ?? 0) / 1024 / 1024).toFixed(2) }} MB</td>
                            </tr>
                            <tr>
                                <td>Digest</td>
                                <td>
                                    <NButton @click="digestClick">
                                        <template #icon>
                                            <NIcon :component="Copy" />
                                        </template>
                                        Copy
                                    </NButton>
                                </td>
                            </tr>
                            <tr>
                                <td>Created at</td>
                                <td>
                                    {{ getFormatDate(buildInfo.created_at ?? '') }}
                                </td>
                            </tr>
                            <tr>
                                <td>Updated at</td>
                                <td>
                                    {{ getFormatDate(buildInfo.updated_at ?? '') }}
                                </td>
                            </tr>
                            <tr>
                                <td>Expires at</td>
                                <td>
                                    {{ getFormatDate(buildInfo.expires_at ?? '') }}
                                </td>
                            </tr>
                        </NTbody>
                    </NTable>
                </div>
                <div style="height: 285px; display: flex; align-items: center; justify-content: center" v-else>
                    获取构建信息失败
                </div>
                <NButton :disabled="isLoading || !sucessFetch || buildInfo.expired" type="primary"
                    class="download-button" @click="handleDownload" :loading="isLoading">
                    <template #icon>
                        <ArrowDown />
                    </template>
                    下载构建
                </NButton>
                <NFlex justify="space-between">
                    <NButton quaternary class="action-buttons" @click="rowButtonClick" style="flex: 1">
                        <template #icon>
                            <Code />
                        </template>
                        原始信息
                    </NButton>
                    <NButton quaternary class="action-buttons" @click="fetchData" style="flex: 1">
                        <template #icon>
                            <Refresh />
                        </template>
                        刷新信息
                    </NButton>
                </NFlex>
            </NCard>
            <NCard class="info-card" :bordered="false">
                <NFlex>
                    <NButton text @click="router.push('/history')">
                        <template #icon>
                            <BookmarksSharp />
                        </template>
                        历史构建
                    </NButton>
                    <NButton text @click="openGithub">
                        <template #icon>
                            <LogoGithub />
                        </template>
                        Github
                    </NButton>
                    <NButton text @click="aboutButtonClick">
                        <template #icon>
                            <InformationCircle />
                        </template>
                        关于
                    </NButton>
                </NFlex>
            </NCard>
        </div>
    </NLayout>
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

.info-card {
    margin-top: 16px;
    width: min(100%, 500px);
    box-shadow: var(--n-box-shadow);
    border-radius: 16px;
}

.download-button {
    width: 100%;
    margin: 12px 0;
}
</style>