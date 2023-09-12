import { defineAsyncComponent, AsyncComponentLoader } from 'vue'
import { AsyncLoading, AsyncSkeletonLoading } from '@/components/GoLoading'
import { fetchChartComponent, fetchConfigComponent } from '@/packages'
import { ConfigType } from '@/packages/index.d'

/**
 * * 动态注册组件
 */
export const componentInstall = <T> (key:string, node: T)  => {
  if(!window['$vue'].component(key) && node) {
    window['$vue'].component(key, node)
  }
}

//进入编辑页面时动态注册已有的组件
export const initInstallComp = (item: ConfigType) => {
  if (item.disabled) return
  componentInstall(item.chartKey, fetchChartComponent(item))
  componentInstall(item.conKey, fetchConfigComponent(item))
}



/**
 * * 异步加载组件
 * @param loader
 * @returns
 */
export const loadAsyncComponent = (loader: AsyncComponentLoader<any>) =>
  defineAsyncComponent({
    loader,
    loadingComponent: AsyncLoading,
    delay: 20,
  })
  
export const loadSkeletonAsyncComponent = (loader: AsyncComponentLoader<any>) =>
  defineAsyncComponent({
    loader,
    loadingComponent: AsyncSkeletonLoading,
    delay: 20,
  })
