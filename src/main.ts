import { createSSRApp } from 'vue'
import App from './App.vue'
import { routeInterceptor } from './router/interceptor'

import '@/style/index.scss'
import 'virtual:uno.css'

export function createApp() {
  const app = createSSRApp(App)
  app.use(routeInterceptor)

  return {
    app,
  }
}
