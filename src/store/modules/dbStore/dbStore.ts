import { defineStore } from 'pinia'
import { lang } from '@/settings/designSetting'
import { dbStateType } from './dbStore.d'
import { setLocalStorage,  getLocalStorage } from '@/utils/storage'
import { StorageEnum } from '@/enums/storageEnum'
import { watch } from 'vue'
import { watchOnce } from '@vueuse/core'

const { GO_LANG_STORE, ROOT_PATH_KEY } = StorageEnum
const storageLang: dbStateType = getLocalStorage(GO_LANG_STORE)
const storageRootPath: dbStateType['rootPath'] = getLocalStorage(ROOT_PATH_KEY)
// 语言
export const useDbStore = defineStore({
  id: 'useDbStore',
  state: (): dbStateType =>
    storageLang || {
      db: null,
      dbReq: null,
      rootPath: storageRootPath || '',  //项目根目录路径
    },
  getters: {
    getDb(): any {
      return this.db
    },
    getRootPath(): dbStateType['rootPath'] {
      console.log("🚀 ~ file: dbStore.ts:27 ~ getRootPath ~ this.rootPath:", this.rootPath)
      return this.rootPath
    },
    getDbPromise(): Promise<any> {
      return new Promise((resolve) => {
        if (!this.db) {
          watchOnce(() => this.db, (db) => {
            resolve(db)
          }, {})
        }else{
          resolve(this.db)
        }
      })
    }
  },
  actions: {
    initDb() {
      let _this = this
      let request = window.indexedDB.open('nt');
      var db
      //@ts-ignore
      this.dbReq = request
      return new Promise((resolve, reject) => {
        request.onsuccess = function (event) {  //数据库已在主项目中创建
          //@ts-ignore
          db = event.target.result;
          console.log('Database opened successfully');
          _this.db = db
          resolve(db)
        }
      })
    },
  }
})
