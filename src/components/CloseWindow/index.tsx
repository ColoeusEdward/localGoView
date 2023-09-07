import { NButton, NIcon } from "naive-ui";
import { defineComponent } from "vue";
import { icon } from '@/plugins'
const { CloseIcon } = icon.ionicons5

export default defineComponent({
  name: 'CloseWindow',
  setup(props, ctx) {
    const close = () => {
      window.ipc.send('closeWin')
      window.close()
    }
    const prop:any={
      title:'关闭'
    }
    return () => {
      return (
        <NButton quaternary onClick={close} {...prop} >
          <NIcon size="20" depth="1">
            <CloseIcon />
          </NIcon>
        </NButton>
      )
    }
  }

})