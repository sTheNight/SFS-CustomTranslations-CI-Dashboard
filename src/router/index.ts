import History from '@/views/History.vue'
import Main from '@/views/Main.vue'
import { createRouter, createWebHistory } from 'vue-router'
import NotFound from '@/views/NotFound.vue'

const routes = [
    {
        path: '/',
        component: Main,
    },
    {
        path: '/history',
        component: History,
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: NotFound
    }
]

export const router = createRouter({
    history: createWebHistory(),
    routes,
})
