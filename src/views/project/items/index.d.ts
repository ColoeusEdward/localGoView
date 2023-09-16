import type { ChartEditStorage } from "@/store/modules/chartEditStore/chartEditStore.d"

export type Chartype = {
  id: number | string
  title: string // 标题
  label: string // 标签
  release: boolean // 0未发布 | 1已发布
  pic?: string        // 截图图片名
  info?: ChartEditStorage,
  isTemplate?:boolean   //是否是模板
  isFromTemplate?:boolean  //是否从模板创建
}

export type ChartList = Chartype[]