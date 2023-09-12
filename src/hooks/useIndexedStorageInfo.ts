import { useChartEditStore } from "@/store/modules/chartEditStore/chartEditStore"
import { Chartype } from "@/views/project/items"
import { useDbEdit } from "./useDbEdit.hook"
const chartEditStore = useChartEditStore()

export const useIndexedStorageInfo = () => {
  // 根据路由 id 获取持久存储数据的信息
  const getIndexedStorageInfo = (idd?: string) => {
    const urlHash = document.location.hash
    const toPathArray = urlHash.split('/')
    let id = ''
    if (idd) {
      id = idd
    } else {
      id = toPathArray && toPathArray[toPathArray.length - 1]
    }
    return useDbEdit('datav').then((dbObj) => {
      const req = dbObj.dbObjectStore.get(id)
      return new Promise((resolve, reject) => {
        req.onsuccess = (event: any) => {
          let item: Chartype = event.target.result
          if (!item) {
            resolve(false)
            return
          }
          const { editCanvasConfig, requestGlobalConfig, componentList } = item.info
          chartEditStore.editCanvasConfig = editCanvasConfig
          chartEditStore.requestGlobalConfig = requestGlobalConfig
          chartEditStore.componentList = componentList
          resolve(true)
        }
      })
    })

  }

  return {
    getIndexedStorageInfo
  }
}