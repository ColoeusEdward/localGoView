import { icon } from "@/plugins";
import { Warning } from "@vicons/ionicons5";
import { NButton, NIcon, NPopconfirm } from "naive-ui";
import { defineComponent } from "vue";
import { useRemoveKeyboard } from "../../hooks/useKeyboard.hook";
import { goHome } from "@/utils";

export default defineComponent({
  name: 'HomeBtn',
  setup(props, ctx) {
    const { HomeIcon, } = icon.ionicons5
    const goHomeHandle = () => {
      goHome()
      useRemoveKeyboard()
    }

    return () => {
      return (
        <NPopconfirm onPositiveClick={goHomeHandle} v-slots={{
          icon: () => <NIcon depth={2}><Warning /></NIcon>,
          trigger:() => (
            <NButton size="small"  quaternary v-slots={{
              icon: <NIcon depth={2}><HomeIcon></HomeIcon></NIcon>,
            }} ></NButton>
          )
        }} >
          确定要返回吗
        </NPopconfirm>
      )
    }
  }

})