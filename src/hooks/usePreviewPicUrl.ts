

import { useDbStore } from '@/store/modules/dbStore/dbStore'
import { StorageEnum } from '@/enums/storageEnum'

const dbStore = useDbStore()

// 语言切换
export const usePreviewPicUrl = () => {
  const getPreviewPicUrl = (name: string) => {
    if (!name) return ''
    const { FILE_PROTOCOL_HEAD, PREVIEW_PIC_PATH } = StorageEnum
    const rootPath = dbStore.getRootPath
    console.log("🚀 ~ file: utils.ts:392 ~ getPreviewPicUrl ~ rootPath:", rootPath)
    return `${FILE_PROTOCOL_HEAD}${rootPath}${PREVIEW_PIC_PATH}/${name}?ts=${Date.now()}`
  }

  return {
    getPreviewPicUrl
  }
}
