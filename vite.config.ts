import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import Uni from '@uni-helper/plugin-uni'
import vueJsx from '@vitejs/plugin-vue-jsx'
import UnoCSS from 'unocss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [Uni(), vueJsx(), UnoCSS()],
  resolve: {
    // 配置别名
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
})
