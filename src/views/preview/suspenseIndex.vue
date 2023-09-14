<template>
  <div :class="`go-preview ${chartEditStore.editCanvasConfig.previewScaleType}`" @mousedown="dragCanvas">
    <template v-if="showEntity">
      <!-- 实体区域 -->
      <div ref="entityRef" class="go-preview-entity">
        <!-- 缩放层 -->
        <div ref="previewRef" class="go-preview-scale">
          <!-- 展示层 -->
          <div :style="previewRefStyle" v-if="show">
            <!-- 渲染层 -->
            <preview-render-list></preview-render-list>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <!-- 缩放层 -->
      <div ref="previewRef" class="go-preview-scale">
        <!-- 展示层 -->
        <div :style="previewRefStyle" v-if="show">
          <!-- 渲染层 -->
          <preview-render-list></preview-render-list>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { PreviewRenderList } from './components/PreviewRenderList'
import { getFilterStyle, setTitle } from '@/utils'
import { getEditCanvasConfigStyle, getSessionStorageInfo, keyRecordHandle, dragCanvas } from './utils'
import { useComInstall } from './hooks/useComInstall.hook'
import { useScale } from './hooks/useScale.hook'
import { useStore } from './hooks/useStore.hook'
import { PreviewScaleEnum } from '@/enums/styleEnum'
import type { ChartEditStorageType } from './index.d'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
import { useIndexedStorageInfo } from '@/hooks/useIndexedStorageInfo'
import { useRoute } from 'vue-router'

const { query } = useRoute()

const { getIndexedStorageInfo } = useIndexedStorageInfo()
let prePageMark = query.prePageMark?.toString() || ''
console.log("🚀 ~ file: suspenseIndex.vue:47 ~ prePageMark:", prePageMark)
// console.log("🚀 ~ file: suspenseIndex.vue:47 ~ prePath:", prePath)
if (prePageMark.search('project') > -1) {
  await getIndexedStorageInfo()
} else {
  await getSessionStorageInfo()
}
const chartEditStore = useChartEditStore() as unknown as ChartEditStorageType

setTitle(`预览-${chartEditStore.editCanvasConfig.projectName}`)

const previewRefStyle = computed(() => {
  return {
    ...getEditCanvasConfigStyle(chartEditStore.editCanvasConfig),
    ...getFilterStyle(chartEditStore.editCanvasConfig)
  }
})

const showEntity = computed(() => {
  const type = chartEditStore.editCanvasConfig.previewScaleType
  return type === PreviewScaleEnum.SCROLL_Y || type === PreviewScaleEnum.SCROLL_X
})

useStore(chartEditStore)
const { entityRef, previewRef } = useScale(chartEditStore)
const { show } = useComInstall(chartEditStore)

// 开启键盘监听
keyRecordHandle()
</script>

<style lang="scss" scoped>
@include go('preview') {
  position: relative;
  height: 100vh;
  width: 100vw;
  @include background-image('background-image');

  &.fit,
  &.full {
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;

    .go-preview-scale {
      transform-origin: center center;
    }
  }

  &.scrollY {
    overflow-x: hidden;

    .go-preview-scale {
      transform-origin: left top;
    }
  }

  &.scrollX {
    overflow-y: hidden;

    .go-preview-scale {
      transform-origin: left top;
    }
  }

  .go-preview-entity {
    overflow: hidden;
  }
}
</style>
