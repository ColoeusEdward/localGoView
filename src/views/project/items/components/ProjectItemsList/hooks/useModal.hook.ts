import { ref } from 'vue'
import { ChartEnum, PreviewEnum } from '@/enums/pageEnum'
import { fetchPathByName, routerTurnByPath } from '@/utils'
import { Chartype } from '../../../index.d'
import { useIndexedStorageInfo } from '@/hooks/useIndexedStorageInfo'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'

const chartEditStore = useChartEditStore()

export const useModalDataInit = () => {
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
    const path = fetchPathByName(PreviewEnum.CHART_PREVIEW_NAME, 'href')
    routerTurnByPath(path, [cardData.id], undefined, true,{prePageMark:'project'})
  }

  return {
    modalData,
    modalShow,
    closeModal,
    resizeHandle,
    editHandle,
    previewHandle
  }
}
