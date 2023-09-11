import { h } from 'vue'
import { NIcon } from 'naive-ui'
import screenfull from 'screenfull'
import throttle from 'lodash/throttle'
import Image_404 from '../assets/images/exception/image-404.png'
import html2canvas from 'html2canvas'
import { downloadByA } from './file'
import { toString } from './type'
import cloneDeep from 'lodash/cloneDeep'
import { WinKeyboard } from '@/enums/editPageEnum'
import { RequestHttpIntervalEnum, RequestParamsObjType } from '@/enums/httpEnum'
import { CreateComponentType, CreateComponentGroupType } from '@/packages/index.d'
import { excludeParseEventKeyList, excludeParseEventValueList } from '@/enums/eventEnum'
import { StorageEnum } from '@/enums/storageEnum'
import { useDbStore } from '@/store/modules/dbStore/dbStore'

/**
 * * 判断是否是开发环境
 * @return { Boolean }
 */
export const isDev = () => {
  return import.meta.env.DEV
}

/**
 * * 生成一个不重复的ID
 * @param { Number } randomLength
 */
export const getUUID = (randomLength = 10) => {
  return Number(Math.random().toString().substring(2, randomLength) + Date.now()).toString(36)
}

/**
 * * render 图标
 *  @param icon 图标
 *  @param set 设置项
 */
export const renderIcon = (icon: any, set = {}) => {
  return () => h(NIcon, set, { default: () => h(icon) })
}
/**
 * * render 语言
 *  @param lang 语言标识
 *  @param set 设置项
 *  @param tag 要渲染成的标签
 */
export const renderLang = (lang: string, set = {}, tag = 'span') => {
  return () => h(tag, set, { default: () => window['$t'](lang) })
}

/**
 * * 获取错误处理图片，默认 404 图
 * @returns url
 */
export const requireErrorImg = () => {
  return Image_404
}

/**
 * * 全屏操作函数
 * @param isFullscreen
 * @param isEnabled
 * @returns
 */
export const screenfullFn = (isFullscreen?: boolean, isEnabled?: boolean) => {
  // 是否是全屏
  if (isFullscreen) return screenfull.isFullscreen

  // 是否支持全屏
  if (isEnabled) return screenfull.isEnabled

  if (screenfull.isEnabled) {
    screenfull.toggle()
    return
  }
  // TODO lang
  window['$message'].warning('您的浏览器不支持全屏功能！')
}

/**
 * 修改元素位置
 * @param target 对象
 * @param x X轴
 * @param y Y轴
 */
export const setComponentPosition = (
  target: CreateComponentType | CreateComponentGroupType,
  x?: number,
  y?: number
) => {
  x && (target.attr.x = x)
  y && (target.attr.y = y)
}

/**
 * * 设置元素属性
 * @param HTMLElement 元素
 * @param key 键名
 * @param value 键值
 */
export const setDomAttribute = <K extends keyof CSSStyleDeclaration, V extends CSSStyleDeclaration[K]>(
  HTMLElement: HTMLElement,
  key: K,
  value: V
) => {
  if (HTMLElement) {
    HTMLElement.style[key] = value
  }
}

/**
 * * 判断是否是 mac
 * @returns boolean
 */
export const isMac = () => {
  return /macintosh|mac os x/i.test(navigator.userAgent)
}

/**
 * * file转url
 */
export const fileToUrl = (file: File): string => {
  const Url = URL || window.URL || window.webkitURL
  const ImageUrl = Url.createObjectURL(file)
  return ImageUrl
}

/**
 * * file转base64
 */
export const fileTobase64 = (file: File, callback: Function) => {
  let reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = function (e: ProgressEvent<FileReader>) {
    if (e.target) {
      let base64 = e.target.result
      callback(base64)
    }
  }
}

/**
 * * 挂载监听
 */
// eslint-disable-next-line no-undef
export const addEventListener = <K extends keyof WindowEventMap>(
  target: HTMLElement | Document,
  type: K,
  listener: any,
  delay?: number,
  // eslint-disable-next-line no-undef
  options?: boolean | AddEventListenerOptions | undefined
) => {
  if (!target) return
  target.addEventListener(
    type,
    throttle(listener, delay || 300, {
      leading: true,
      trailing: false
    }),
    options
  )
}

/**
 * * 卸载监听
 */
// eslint-disable-next-line no-undef
export const removeEventListener = <K extends keyof WindowEventMap>(
  target: HTMLElement | Document,
  type: K,
  listener: any
) => {
  if (!target) return
  target.removeEventListener(type, listener)
}

/**
 * * 截取画面为图片并下载
 * @param html 需要截取的 DOM
 */
export const canvasCut = (html: HTMLElement | null, callback?: Function) => {
  if (!html) {
    window['$message'].error('导出失败！')
    if (callback) callback()
    return
  }

  html2canvas(html, {
    backgroundColor: null,
    allowTaint: true,
    useCORS: true
  }).then((canvas: HTMLCanvasElement) => {
    window['$message'].success('导出成功！')
    downloadByA(canvas.toDataURL(), undefined, 'png')
    if (callback) callback()
  })
}

//截取为blob文件
export const canvasCut2 = (html: HTMLElement | null, callback?: Function) => {
  if (!html) {
    window['$message'].error('导出失败！')
    if (callback) callback()
    return
  }

  html2canvas(html, {
    backgroundColor: null,
    allowTaint: true,
    useCORS: true
  }).then((canvas: HTMLCanvasElement) => {
    // window['$message'].success('导出成功！')
    canvas.toBlob((blob) => {
      if (callback) callback(blob)
    }, 'image/png')
  })
}

/**
 * * 函数过滤器
 * @param data 数据值
 * @param res 返回顶级对象
 * @param funcStr 函数字符串
 * @param isToString 是否转为字符串
 * @param errorCallBack 错误回调函数
 * @param successCallBack 成功回调函数
 * @returns
 */
export const newFunctionHandle = (
  data: any,
  res: any,
  funcStr?: string,
  isToString?: boolean,
  errorCallBack?: Function,
  successCallBack?: Function
) => {
  try {
    if (!funcStr) return data
    const fn = new Function('data', 'res', funcStr)
    const fnRes = fn(cloneDeep(data), cloneDeep(res))
    const resHandle = isToString ? toString(fnRes) : fnRes
    // 成功回调
    successCallBack && successCallBack(resHandle)
    return resHandle
  } catch (error) {
    // 失败回调
    errorCallBack && errorCallBack(error)
    return '函数执行错误'
  }
}

/**
 * * 处理请求事件单位
 * @param num 时间间隔
 * @param unit RequestHttpIntervalEnum
 * @return number 秒数
 */
export const intervalUnitHandle = (num: number, unit: RequestHttpIntervalEnum) => {
  switch (unit) {
    // 秒
    case RequestHttpIntervalEnum.SECOND:
      return num * 1000
    // 分
    case RequestHttpIntervalEnum.MINUTE:
      return num * 1000 * 60
    // 时
    case RequestHttpIntervalEnum.HOUR:
      return num * 1000 * 60 * 60
    // 天
    case RequestHttpIntervalEnum.DAY:
      return num * 1000 * 60 * 60 * 24
    default:
      return num * 1000
  }
}

/**
 * * 对象转换 cookie 格式
 * @param obj
 * @returns string
 */
export const objToCookie = (obj: RequestParamsObjType) => {
  if (!obj) return ''

  let str = ''
  for (const key in obj) {
    str += key + '=' + obj[key] + ';'
  }
  return str.substring(0, str.length - 1)
}

/**
 * * 设置按下键盘按键的底部展示
 * @param keyCode
 * @returns
 */
export const setKeyboardDressShow = (keyCode?: number) => {
  const code = new Map([
    [17, WinKeyboard.CTRL],
    [32, WinKeyboard.SPACE]
  ])

  const dom = document.getElementById('keyboard-dress-show')
  if (!dom) return
  if (!keyCode) {
    window.onKeySpacePressHold?.(false)
    dom.innerText = ''
    return
  }
  if (keyCode && code.has(keyCode)) {
    if (keyCode == 32) window.onKeySpacePressHold?.(true)
    dom.innerText = `按下了「${code.get(keyCode)}」键`
  }
}

/**
 * * JSON序列化，支持函数和 undefined
 * @param data
 */
export const JSONStringify = <T>(data: T) => {
  return JSON.stringify(
    data,
    (key, val) => {
      // 处理函数丢失问题
      if (typeof val === 'function') {
        return `${val}`
      }
      // 处理 undefined 丢失问题
      if (typeof val === 'undefined') {
        return null
      }
      return val
    },
    2
  )
}

export const evalFn = (fn: string) => {
  var Fun = Function // 一个变量指向Function，防止前端编译工具报错
  return new Fun('return ' + fn)()
}

/**
 * * JSON反序列化，支持函数和 undefined
 * @param data
 */
export const JSONParse = (data: string) => {
  return JSON.parse(data, (k, v) => {
    // 过滤函数字符串
    if (excludeParseEventKeyList.includes(k)) return v
    // 过滤函数值表达式
    if (typeof v === 'string') {
      const someValue = excludeParseEventValueList.some(excludeValue => v.indexOf(excludeValue) > -1)
      if (someValue) return v
    }
    // 还原函数值
    if (typeof v === 'string' && v.indexOf && (v.indexOf('function') > -1 || v.indexOf('=>') > -1)) {
      return evalFn(`(function(){return ${v}})()`)
    } else if (typeof v === 'string' && v.indexOf && v.indexOf('return ') > -1) {
      const baseLeftIndex = v.indexOf('(')
      if (baseLeftIndex > -1) {
        const newFn = `function ${v.substring(baseLeftIndex)}`
        return evalFn(`(function(){return ${newFn}})()`)
      }
    }
    return v
  })
}

/**
 * * 修改顶部标题
 * @param title
 */
export const setTitle = (title?: string) => {
  title && (document.title = title)
}

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const checkUtil = async (checkFn: Function, ms: number = 100) => {
  while (!checkFn()) {
    await sleep(ms)
  }
  return checkFn()
}

export const getPreviewPicUrl = (name: string) => {
  if(!name) return ''
  const { FILE_PROTOCOL_HEAD, PREVIEW_PIC_PATH } = StorageEnum
  const dbStore = useDbStore()
  const rootPath = dbStore.getRootPath
  console.log("🚀 ~ file: utils.ts:392 ~ getPreviewPicUrl ~ rootPath:", rootPath)
  return `${FILE_PROTOCOL_HEAD}${rootPath}${PREVIEW_PIC_PATH}/${name}`
}
