import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { router } from './router'

if (import.meta.env.DEV) {
  console.log('Is now running in development mode')
}

const app = createApp(App)
app.use(router)
// 我好像根本就没用上 Pinia
app.use(createPinia())

app.mount('#app')
