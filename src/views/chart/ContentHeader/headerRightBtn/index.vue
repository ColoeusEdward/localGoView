<template>
  <n-space class="go-mt-0">
    <n-button v-for="item in comBtnList" :key="item.title" :type="item.type" :loading="item.title=='保存' && saveLoading" ghost @click="item.event">
      <template #icon>
        <component :is="item.icon"></component>
      </template>
      <span>{{ item.title }}</span>
    </n-button>
  </n-space>
</template>

<script setup lang="ts">
import { computed, ref, toRaw } from 'vue'
import { renderIcon, goDialog, fetchPathByName, routerTurnByPath, setSessionStorage, getLocalStorage, setLocalStorage, canvasCut2 } from '@/utils'
import { PreviewEnum } from '@/enums/pageEnum'
import { StorageEnum } from '@/enums/storageEnum'
import { useRoute } from 'vue-router'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
import { syncData } from '../../ContentEdit/components/EditTools/hooks/useSyncUpdate.hook'
import { icon } from '@/plugins'
import { cloneDeep } from 'lodash'
import { useDbEdit } from '@/hooks/useDbEdit.hook'
import { Chartype } from '@/views/project/items/index'


const { BrowsersOutlineIcon, SendIcon, AnalyticsIcon, SaveIcon } = icon.ionicons5
const chartEditStore = useChartEditStore()
// const dbObj = useDbEdit('datav')
const saveLoading = ref(false)
const routerParamsInfo = useRoute()

// 预览
const previewHandle = () => {
  const path = fetchPathByName(PreviewEnum.CHART_PREVIEW_NAME, 'href')
  if (!path) return
  const { id } = routerParamsInfo.params
  // id 标识
  const previewId = typeof id === 'string' ? id : id[0]
  const storageInfo = chartEditStore.getStorageInfo
  const sessionStorageInfo = getLocalStorage(StorageEnum.GO_CHART_STORAGE_LIST) || []

  if (sessionStorageInfo?.length) {
    const repeateIndex = sessionStorageInfo.findIndex((e: { id: string }) => e.id === previewId)
    // 重复替换
    if (repeateIndex !== -1) {
      sessionStorageInfo.splice(repeateIndex, 1, { id: previewId, ...storageInfo })
      setSessionStorage(StorageEnum.GO_CHART_STORAGE_LIST, sessionStorageInfo)
    } else {
      sessionStorageInfo.push({
        id: previewId,
        ...storageInfo
      })
      setSessionStorage(StorageEnum.GO_CHART_STORAGE_LIST, sessionStorageInfo)
    }
  } else {
    setSessionStorage(StorageEnum.GO_CHART_STORAGE_LIST, [{ id: previewId, ...storageInfo }])
  }
  // 跳转
  routerTurnByPath(path, [previewId], undefined, true)
}

const saveHandle = () => {
  const { id } = routerParamsInfo.params
  // id 标识
  const previewId = typeof id === 'string' ? id : id[0]
  const storageInfo = chartEditStore.getStorageInfo
  // 导出图片
  const range = document.querySelector('.go-edit-range') as HTMLElement
  let picName = ''
  saveLoading.value = true
  let val = { blob:<Blob|null> null, name: '' }
  let val2 = { blob:<ArrayBuffer|undefined> undefined, name: '' }
  new Promise<typeof val>((resolve, reject) => {
    canvasCut2(range, (blob: Blob) => {
      picName = previewId + '.png'
      val = { blob, name: picName }
      resolve(val)
    })
  }).then((val) => {
    return val.blob?.arrayBuffer()
  }).then((buffer) => {
    val2.blob = buffer
    val2.name = picName
  })
  .then((val) => {
    console.log("🚀 ~ file: index.vue:77 ~ newPromise ~ val:", val2)
    if(!window.ipc) return new Promise((resolve, reject) => {
      resolve(true)
    })
    return window.ipc.invoke('savePreviewPic', val2)
  })
  .then((res) => {
    // window['$message'].success('保存成功！')
    if (!res) return

    return useDbEdit('datav')
  }).then((dbObj) => {
    const sdata: Chartype = {
      id: previewId,
      title: document.title,
      label: '',
      release: false,
      pic: picName,
      info: toRaw(storageInfo),
    }
    console.log("🚀 ~ file: index.vue:73 ~ saveHandle ~ sdata:", sdata)
    const dbObjectStore = dbObj?.dbObjectStore
    dbObjectStore.put(sdata)
    return dbObj?.dbOverPromise
  }).then((res) => {
    console.log("🚀 ~ file: index.vue:69 ~ dbEditPromise.then ~ res.target.result:", res.target.result)
    window['$message'].success('保存成功！')
    if (res.target.result) {

    } else {

    }
  })
  .finally(() => {
    saveLoading.value = false
  })


  // dbObjectStore.put
  // let keyRange = IDBKeyRange.only(previewId);
  // let getReq = dbObjectStore.getAll(keyRange)
  // getReq.onsuccess = (e:any) => {
  //   const res = e.target.result
  //   console.log("🚀 ~ file: index.vue:69 ~ saveHandle ~ res:", res)
  //   if (res) {
  //     // 保存到本地
  //   }
  // }

  // const sessionStorageInfo = getLocalStorage(StorageEnum.GO_CHART_STORAGE_LIST) || []

  // if (sessionStorageInfo?.length) {
  //   const repeateIndex = sessionStorageInfo.findIndex((e: { id: string }) => e.id === previewId)
  //   // 重复替换
  //   if (repeateIndex !== -1) {
  //     sessionStorageInfo.splice(repeateIndex, 1, { id: previewId, ...storageInfo })
  //     setLocalStorage(StorageEnum.GO_CHART_STORAGE_LIST, sessionStorageInfo)
  //   } else {
  //     sessionStorageInfo.push({
  //       id: previewId,
  //       ...storageInfo
  //     })
  //     setLocalStorage(StorageEnum.GO_CHART_STORAGE_LIST, sessionStorageInfo)
  //   }
  // } else {
  //   setLocalStorage(StorageEnum.GO_CHART_STORAGE_LIST, [{ id: previewId, ...storageInfo }])
  // }
}

// 发布
const sendHandle = () => {
  goDialog({
    message: '想体验发布功能，请前往查看: https://demo.mtruning.club/#/login。源码需切换到：master-fetch 分支。',
    positiveText: '了然',
    closeNegativeText: true,
    onPositiveCallback: () => { }
  })
}

const btnList = [
  {
    select: true,
    title: '同步内容',
    type: 'primary',
    icon: renderIcon(AnalyticsIcon),
    event: syncData
  },
  {
    select: true,
    title: '预览',
    icon: renderIcon(BrowsersOutlineIcon),
    event: previewHandle
  },
  {
    select: true,
    title: '保存',
    icon: renderIcon(SaveIcon),
    event: saveHandle
  },
  // {
  //   select: true,
  //   title: '发布',
  //   icon: renderIcon(SendIcon),
  //   event: sendHandle
  // }
]

const comBtnList = computed(() => {
  if (chartEditStore.getEditCanvas.isCodeEdit) {
    return btnList
  }
  const cloneList = cloneDeep(btnList)
  cloneList.shift()
  return cloneList
})
</script>

<style lang="scss" scoped>
.align-center {
  margin-top: -4px;
}
</style>
