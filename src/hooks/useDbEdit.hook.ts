import { useDbStore } from "@/store/modules/dbStore/dbStore";

// * code 展示
const dbStore = useDbStore()
export const useDbEdit = (key: string,onlyRead?:boolean) => {
  var transaction = dbStore.db.transaction([key], onlyRead ? "readonly" : "readwrite");
  var dbObjectStore = transaction.objectStore(key);
  return {
    dbObjectStore,
    dbOverPromise: new Promise<any>((resolve, reject) => {
      transaction.oncomplete = function (event: any) {
        resolve(event)
      };
    })
  }
}
