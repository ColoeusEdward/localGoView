import { ref } from 'vue'
import { checkUtil, goDialog } from '@/utils'
import { DialogEnum } from '@/enums/pluginEnum'
import { ChartList, Chartype } from '../../..'
import { useDbEdit } from '@/hooks/useDbEdit.hook'
import { StorageEnum } from '@/enums/storageEnum'
import { ChartEditStoreEnum, EditCanvasConfigEnum } from '@/store/modules/chartEditStore/chartEditStore.d'
import { useRoute } from 'vue-router'
// 数据初始化
export const useDataListInit = () => {
  // const chartEditStore = useChartEditStore()
  const { path } = useRoute()
  const list = ref<ChartList>([
    // {
    //   id: 1,
    //   title: '物料1-假数据不可用',
    //   release: true,
    //   label: '官方案例'
    // },
    // {
    //   id: 2,
    //   title: '物料2-假数据不可用',
    //   release: false,
    //   label: '官方案例'
    // },
    // {
    //   id: 3,
    //   title: '物料3-假数据不可用',
    //   release: false,
    //   label: '官方案例'
    // },
    // {
    //   id: 4,
    //   title: '物料4-假数据不可用',
    //   release: false,
    //   label: '官方案例'
    // },
    // {
    //   id: 5,
    //   title: '物料5-假数据不可用',
    //   release: false,
    //   label: '官方案例'
    // }
  ])
  const dbObjPromise = useDbEdit('datav')
  dbObjPromise.then((dbObj) => {
    let getReq = dbObj.dbObjectStore.getAll()
    getReq.onsuccess = (e: any) => {
      const res: ChartList = e.target.result
      console.log("🚀 ~ file: index.vue:69 ~ saveHandle ~ res:", res)
      if (res) {
        // 保存到本地
        list.value = path.search('template') > -1 ? res.filter(item => item.isTemplate) : res.filter(item => !item.isTemplate)
      }
    }
  })



  // 删除
  const deleteHandle = (cardData: Chartype, index: number) => {
    goDialog({
      type: DialogEnum.DELETE,
      promise: true,
      onPositiveCallback: () =>
        new Promise((resolve, reject) => {
          const dbObjPromise = useDbEdit('datav')
          dbObjPromise.then((dbObj) => {
            dbObj.dbObjectStore.delete(cardData.id)
            dbObj.dbOverPromise?.then((res) => {
              console.log("🚀 ~ file: useData.hook.ts:66 ~ dbObj.dbOverPromise?.then ~ res:", res)
              if (cardData.pic) {  //删除预览图文件
                let val = { name: cardData.pic, path: StorageEnum.BG_PIC_PATH }
                window.ipc.invoke('delPic', val)
                let val2 = { fullPath: cardData.info![ChartEditStoreEnum.EDIT_CANVAS_CONFIG][EditCanvasConfigEnum.BACKGROUND_IMAGE] }
                window.ipc.invoke('delPic', val2)   //删除背景图
              }
              resolve(res)
            })
          })
        }),
      promiseResCallback: (e: any) => {
        window.$message.success('删除成功')
        list.value.splice(index, 1)
      }
    })
  }

  return {
    list,
    deleteHandle
  }
}
