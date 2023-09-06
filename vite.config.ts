import { defineConfig, UserConfig, UserConfigExport } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { OUTPUT_DIR, brotliSize, chunkSizeWarningLimit, terserOptions, rollupOptions, libRollupOptions } from './build/constant'
import viteCompression from 'vite-plugin-compression'
import { viteMockServe } from 'vite-plugin-mock'
import monacoEditorPlugin from 'vite-plugin-monaco-editor'

function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir)
}
export default defineConfig(({ mode }) => {
  let config: UserConfig = {
    base: './',
    // 路径重定向
    resolve: {
      alias: [
        {
          find: /\/#\//,
          replacement: pathResolve('types')
        },
        {
          find: '@',
          replacement: pathResolve('src')
        },
        {
          find: 'vue-i18n',
          replacement: 'vue-i18n/dist/vue-i18n.cjs.js', //解决i8n警告
        }
      ],
      dedupe: ['vue']
    },
    // 全局 css 注册
    css: {
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true,
          additionalData: `@import "src/styles/common/style.scss";`
        }
      }
    },
    plugins: [
      vue(),
      // (mode == 'lib' ? (monacoEditorPlugin as any).default : monacoEditorPlugin)
      monacoEditorPlugin({
        languageWorkers: ['editorWorkerService', 'typescript', 'json', 'html']
      }),
      viteMockServe({
        mockPath: '/src/api/mock',
        // 开发打包开关
        localEnabled: true,
        // 生产打包开关
        prodEnabled: true,
        // 打开后，可以读取 ts 文件模块。 请注意，打开后将无法监视.js 文件
        supportTs: true,
        // 监视文件更改
        watchFiles: true
      }),
      // 压缩
      viteCompression({
        verbose: true,
        // disable: mode == 'lib' ? true : false,
        disable: true,
        threshold: 10240,
        algorithm: 'gzip',
        ext: '.gz'
      })
    ],
    build: {
      target: 'esnext',
      outDir: OUTPUT_DIR,
      // minify: 'terser', // 如果需要用terser混淆，可打开这两行
      // terserOptions: terserOptions,
      rollupOptions: rollupOptions,
      // brotliSize: brotliSize,
      chunkSizeWarningLimit: chunkSizeWarningLimit
    }
  }
  if (mode == 'lib') {
    config = {
      ...config,
      ...{
        build: {
          target: 'esnext',
          lib: {
            entry: resolve(__dirname, 'src/export.ts'),
            name: 'goViewLib',
            formats: ['es', 'umd'], // 打包模式，默认是es和umd都打
            fileName: `goViewLib`
          },
          rollupOptions: libRollupOptions
        }
      }
    }
  }
  console.log(config.build)
  return config
})


