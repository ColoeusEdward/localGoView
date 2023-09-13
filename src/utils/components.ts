import { defineAsyncComponent, AsyncComponentLoader } from 'vue'
import { AsyncLoading, AsyncSkeletonLoading } from '@/components/GoLoading'
// import { fetchChartComponent, fetchConfigComponent } from '@/packages'
// import { ConfigType } from '@/packages/index.d'
/**
 * * 动态注册组件
 */
export const componentInstall = <T> (key:string, node: T)  => {
  if(!window['$vue'].component(key) && node) {
    window['$vue'].component(key, node)
  }
}

// 为什么这里引入fetchChartComponent和fetchConfigComponent会报pinia未注入的错误而在useComInstall中就可以？ 估计是跟当前文件的引入时机有关，component.ts在比较早的时机会被引用(加载), 导致packages中的组件也被过早引用, component.ts 在 utils/utils.ts 中引入, utils.ts 在 main.ts 中引入, 引起连锁反应，因此util这类文件中应该只放副作用较低的函数
// //进入编辑页面时动态注册已有的组件
// export const initInstallComp = (item: ConfigType) => {
//   if (item.disabled) return
//   // componentInstall(item.chartKey, fetchChartComponent(item))
//   // componentInstall(item.conKey, fetchConfigComponent(item))
// }



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
