import { defineStore } from 'pinia'
import { lang } from '@/settings/designSetting'
import { dbStateType } from './dbStore.d'
import { setLocalStorage,  getLocalStorageNew } from '@/utils'
import { StorageEnum } from '@/enums/storageEnum'
import { watchOnce } from '@vueuse/core'

const { GO_LANG_STORE, ROOT_PATH_KEY } = StorageEnum
const storageRootPath: dbStateType['rootPath'] = getLocalStorageNew(ROOT_PATH_KEY)
// 语言
export const useDbStore = defineStore({
  id: 'useDbStore',
  state: (): dbStateType => ({
      db: null,
      dbReq: null,
      rootPath: storageRootPath || '',  //项目根目录路径
    }),
  getters: { //想使用this就不能用箭头函数
    getDb(): any {
      return this.db
    },
    getRootPath(): dbStateType['rootPath'] {
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
