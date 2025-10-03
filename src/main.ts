import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'

if (import.meta.env.DEV) {
  console.log('Is now running in development mode')
}

const app = createApp(App)
app.use(router)

app.mount('#app')
