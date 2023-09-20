import { Ref, ref } from 'vue'
import { ChartEnum, PreviewEnum } from '@/enums/pageEnum'
import { fetchPathByName, getUUID, hardCloneObj, routerTurnByPath, setLocalStorage, setSessionStorage } from '@/utils'
import { ChartList, Chartype } from '../../../index.d'
import { useIndexedStorageInfo } from '@/hooks/useIndexedStorageInfo'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
import { StorageEnum } from '@/enums/storageEnum'
import { useDbStore } from '@/store/modules/dbStore/dbStore'
import { useDbEdit } from '@/hooks/useDbEdit.hook'

const chartEditStore = useChartEditStore()
const {PUBLISH_PROJECT_KEY} = StorageEnum

export const useModalDataInit = (list?: Ref<ChartList>) => {
  const modalShow = ref<boolean>(false)
  const modalData = ref<Chartype | null>(null)

  // 关闭 modal
  const closeModal = () => {
    modalShow.value = false
    modalData.value = null
  }

  // 打开 modal
  const resizeHandle = (cardData: Chartype) => {
    if (!cardData) return
    modalShow.value = true
    modalData.value = cardData
  }

  // 打开 modal
  const editHandle = (cardData: Chartype) => {
    if (!cardData) return
    chartEditStore.setCurCardData(cardData)

    const path = fetchPathByName(ChartEnum.CHART_HOME_NAME, 'href')
    routerTurnByPath(path, [cardData.id], undefined, false,)

  }

  //预览model
  const previewHandle = (cardData: Chartype) => {
    console.log("🚀 ~ file: useModal.hook.ts:32 ~ previewHandle ~ cardData:", cardData)
    if (!cardData) return
    setSessionStorage(StorageEnum.GO_CHART_STORAGE_LIST, [{ ...cardData.info, id: cardData.id }])
    const path = fetchPathByName(PreviewEnum.CHART_PREVIEW_NAME, 'href')
    routerTurnByPath(path, [cardData.id], undefined, true)
  }

  const baseFromHandle = (cardData: Chartype) => {
    if (!cardData) return
    let cdata = { ...cardData, isTemplate: false, isFromTemplate: true }
    chartEditStore.setCurCardData(cdata)
    const path = fetchPathByName(ChartEnum.CHART_HOME_NAME, 'href')
    routerTurnByPath(path, [cdata.id], undefined, false,)
  }

  const sendHandle = (cardData: Chartype) => {
    if (!cardData) return
    useDbEdit('datav').then(({ dbObjectStore, dbOverPromise }) => {
      list?.value.forEach((item) => {
        if (item.id == cardData.id) return
        item.release = false
        dbObjectStore.put(hardCloneObj(item))
      })
      cardData.release = true
      dbObjectStore.put(hardCloneObj(cardData))
      setLocalStorage(PUBLISH_PROJECT_KEY,cardData.id)
      dbOverPromise?.then(() => {
        window['$message'].success('发布成功')
      })
    })

  }

  return {
    modalData,
    modalShow,
    closeModal,
    resizeHandle,
    editHandle,
    previewHandle,
    baseFromHandle, sendHandle
  }
}
