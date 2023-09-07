import { useDbStore } from "@/store/modules/dbStore/dbStore";
import { onMounted, reactive } from "vue";

// * code 展示
export const useDbEdit = (key: string, onlyRead?: boolean) => {
  const dbObj = reactive({
    dbObjectStore: <any> null,
    dbOverPromise: <Promise<any> | null> null
  })
  onMounted(() => {
    const dbStore = useDbStore()
    var transaction = dbStore.db.transaction([key], onlyRead ? "readonly" : "readwrite");
    dbObj.dbObjectStore = transaction.objectStore(key);
    dbObj.dbOverPromise = new Promise<any>((resolve, reject) => {
      transaction.oncomplete = function (event: any) {
        resolve(event)
      };
    })
  })
  return dbObj


}
