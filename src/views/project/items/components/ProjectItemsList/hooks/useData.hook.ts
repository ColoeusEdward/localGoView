import { ref } from 'vue'
import { checkUtil, goDialog } from '@/utils'
import { DialogEnum } from '@/enums/pluginEnum'
import { ChartList, Chartype } from '../../..'
import { useDbEdit } from '@/hooks/useDbEdit.hook'
// 数据初始化
export const useDataListInit = () => {
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
      const res = e.target.result
      console.log("🚀 ~ file: index.vue:69 ~ saveHandle ~ res:", res)
      if (res) {
        // 保存到本地
        list.value = res
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
