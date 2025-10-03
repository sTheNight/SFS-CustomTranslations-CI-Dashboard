import History from '@/views/History.vue'
import Main from '@/views/Main.vue'
import MainLayout from '@/layouts/MainLayout.vue'
import { createRouter, createWebHistory } from 'vue-router'
import NotFound from '@/views/NotFound.vue'

const routes = [
    {
        path: '/',
        component: MainLayout,
        children: [
            {
                path: '',
                name: 'Main',
                component: Main
            },
            {
                path: 'history',
                name: 'History',
                component: History
            }
        ]
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
