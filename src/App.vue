<template>
  <n-config-provider
    :theme="darkTheme"
    :hljs="hljsTheme"
    :locale="locale"
    :date-locale="dateLocale"
    :theme-overrides="overridesTheme">
    <go-app-provider>
      <I18n></I18n>
      <router-view></router-view>
    </go-app-provider>
  </n-config-provider>
</template>

<script lang="ts" setup>
import { NConfigProvider } from 'naive-ui'
import { GoAppProvider } from '@/components/GoAppProvider'
import { I18n } from '@/components/I18n'
import { useDarkThemeHook, useThemeOverridesHook, useCode, useLang } from '@/hooks'
import { useDbStore } from './store/modules/dbStore/dbStore';
import { StorageEnum } from '@/enums/storageEnum';

// 暗黑主题
const darkTheme = useDarkThemeHook()

// 主题配置
const overridesTheme = useThemeOverridesHook()

// 代码主题
const hljsTheme = useCode()

// 全局语言
const { locale, dateLocale } = useLang()

//开启indexedDb
const dbStore = useDbStore()
dbStore.initDb().then((db: any) => {

  let transaction = db.transaction([StorageEnum.DB_DATAV_NAME])
  var objectStore = transaction.objectStore(StorageEnum.DB_DATAV_NAME)
  var request = objectStore.getAll()
  request.onsuccess = function (event: any) {
    console.log("🚀 ~ file: App.vue:41 ~ dbStore.initDb ~ test:", event.target.result)
  }
})

if (window.ipc) {
  console.log("🚀 ~ file: index.tsx:12 ~ window.ipc.invoke ~ res:")
  window.ipc.invoke('getRootPath').then((res: string) => {
    console.log("🚀 ~ file: index.tsx:12 ~ window.ipc.invoke ~ res:", res)
  })
}


</script>
