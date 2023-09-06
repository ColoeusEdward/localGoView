import { defineStore } from 'pinia'
import { lang } from '@/settings/designSetting'
import { dbStateType } from './dbStore.d'
import { setLocalStorage, getLocalStorage, reloadRoutePage } from '@/utils'
import { StorageEnum } from '@/enums/storageEnum'

const { GO_LANG_STORE } = StorageEnum
const storageLang: dbStateType = getLocalStorage(GO_LANG_STORE)

// 语言
export const useDbStore = defineStore({
  id: 'useDbStore',
  state: (): dbStateType =>
    storageLang || {
      db: null,
      dbReq: null
    },
  getters: {
    getDb(): any {
      return this.db
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
    }
  }
})
