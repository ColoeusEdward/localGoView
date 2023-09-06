declare module '*.vue' {
  import { defineComponent, DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  // const component: ReturnType<typeof DefineComponent>
  export default component
}

declare module 'lodash/*'
declare module 'dom-helpers'
declare module '@iconify/vue'