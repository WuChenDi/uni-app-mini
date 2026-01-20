import path from 'node:path'
import process from 'node:process'
import Uni from '@uni-helper/plugin-uni'
import UniComponents from '@uni-helper/vite-plugin-uni-components'
import UniLayouts from '@uni-helper/vite-plugin-uni-layouts'
import UniManifest from '@uni-helper/vite-plugin-uni-manifest'
import UniPages from '@uni-helper/vite-plugin-uni-pages'
import UniPlatform from '@uni-helper/vite-plugin-uni-platform'
import UniOptimization from '@uni-ku/bundle-optimizer'
import UniKuRoot from '@uni-ku/root'
import vueJsx from '@vitejs/plugin-vue-jsx'
import UnoCSS from 'unocss/vite'
import { defineConfig, loadEnv } from 'vite'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  console.log('command, mode -> ', command, mode)
  console.log('UNI_PLATFORM -> ', process.env.UNI_PLATFORM)
  const env = loadEnv(mode, path.resolve(__dirname, 'env'))
  console.log('环境变量 env -> ', env)

  return defineConfig({
    envDir: './env',
    base: '/',
    plugins: [
      UniLayouts(),
      UniPlatform(),
      UniManifest(),
      UniComponents({
        extensions: ['vue'],
        deep: true, // 是否递归扫描子目录，
        directoryAsNamespace: false, // 是否把目录名作为命名空间前缀，true 时组件名为 目录名+组件名，
        dts: 'src/types/components.d.ts', // 自动生成的组件类型声明文件路径（用于 TypeScript 支持）
      }),
      UniPages({
        exclude: ['**/components/**/**.*', '**/sections/**/**.*'],
        // pages 目录为 src/pages，分包目录不能配置在pages目录下！！
        // 是个数组，可以配置多个，但是不能为pages里面的目录！！
        subPackages: [],
        dts: 'src/types/uni-pages.d.ts',
      }),
      // UniOptimization 插件需要 page.json 文件，故应在 UniPages 插件之后执行
      UniOptimization({
        enable: {
          optimization: true,
          'async-import': true,
          'async-component': true,
        },
        logger: false,
      }),
      // 若存在改变 pages.json 的插件，请将 UniKuRoot 放置其后
      UniKuRoot({
        excludePages: ['**/components/**/**.*', '**/sections/**/**.*'],
      }),
      Uni(),
      {
        // 临时解决 dcloudio 官方的 @dcloudio/uni-mp-compiler 出现的编译 BUG
        // 参考 github issue: https://github.com/dcloudio/uni-app/issues/4952
        // 自定义插件禁用 vite:vue 插件的 devToolsEnabled，强制编译 vue 模板时 inline 为 true
        name: 'fix-vite-plugin-vue',
        configResolved(config) {
          const plugin = config.plugins.find((p) => p.name === 'vite:vue')
          if (plugin && plugin.api && plugin.api.options) {
            plugin.api.options.devToolsEnabled = false
          }
        },
      },
      vueJsx(),
      UnoCSS(),
    ],
    resolve: {
      // 配置别名
      alias: {
        '@': path.resolve(__dirname, 'src')
      },
    },
    server: {
      host: '0.0.0.0',
      hmr: true,
    },
  })
})
