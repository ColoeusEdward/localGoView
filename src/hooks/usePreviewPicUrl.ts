
import { computed } from 'vue'
import { LangEnum } from '@/enums/styleEnum'
import { useLangStore } from '@/store/modules/langStore/langStore'
import { zhCN, enUS, dateEnUS, dateZhCN } from 'naive-ui'
import { useDbStore } from '@/store/modules/dbStore/dbStore'
import { StorageEnum } from '@/enums/storageEnum'


// 语言切换
export const usePreviewPicUrl = () => {
  const dbStore = useDbStore()
  const getPreviewPicUrl = (name: string) => {
    if (!name) return ''
    const { FILE_PROTOCOL_HEAD, PREVIEW_PIC_PATH } = StorageEnum
    const rootPath = dbStore.getRootPath
    console.log("🚀 ~ file: utils.ts:392 ~ getPreviewPicUrl ~ rootPath:", rootPath)
    return `${FILE_PROTOCOL_HEAD}${rootPath}${PREVIEW_PIC_PATH}/${name}`
  }

  return {
    getPreviewPicUrl
  }
}
