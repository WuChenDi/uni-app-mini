import type {
  Preset,
} from 'unocss'
import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders'
import { presetUni } from '@uni-helper/unocss-preset-uni'
import { presetLegacyCompat } from '@unocss/preset-legacy-compat'
import {
  defineConfig,
  presetIcons,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  presets: [
    presetUni({
      attributify: false,
    }),
    presetIcons({
      scale: 1.2,
      warn: true,
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
      },
      collections: {
        // 注册本地 SVG 图标集合, 从本地文件系统加载图标
        // 在 './src/static/my-icons' 目录下的所有 svg 文件将被注册为图标，
        // my-icons 是图标集合名称，使用 `i-my-icons-图标名` 调用
        'my-icons': FileSystemIconLoader(
          './src/static/my-icons',
          // 可选的，你可以提供一个 transform 回调来更改每个图标
          (svg) => {
            let svgStr = svg

            // 如果 SVG 文件未定义 `fill` 属性，则默认填充 `currentColor`, 这样图标颜色会继承文本颜色，方便在不同场景下适配
            svgStr = svgStr.includes('fill="') ? svgStr : svgStr.replace(/^<svg /, '<svg fill="currentColor" ')

            // 如果 svg 有 width, 和 height 属性，将这些属性改为 1em，否则无法显示图标
            svgStr = svgStr.replace(/(<svg.*?width=)"(.*?)"/, '$1"1em"').replace(/(<svg.*?height=)"(.*?)"/, '$1"1em"')

            return svgStr
          },
        ),
      },
    }),
    presetLegacyCompat({
      commaStyleColorFunction: true,
      legacyColorSpace: true,
    }) as Preset,
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  shortcuts: [
    {
      center: 'flex justify-center items-center',
    },
  ],
  safelist: ['i-carbon-code', 'i-carbon-home', 'i-carbon-user'],
  rules: [
    [
      'p-safe',
      {
        padding:
          'env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)',
      },
    ],
    ['pt-safe', { 'padding-top': 'env(safe-area-inset-top)' }],
    ['pb-safe', { 'padding-bottom': 'env(safe-area-inset-bottom)' }],
  ],
  theme: {
    colors: {
      primary: 'var(--wot-color-theme,#0957DE)',
    },
    fontSize: {
      '2xs': ['20rpx', '28rpx'],
      '3xs': ['18rpx', '26rpx'],
    },
  },
})
