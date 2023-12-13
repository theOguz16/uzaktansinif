import { reactive, ref, markRaw } from "vue";
import { addToast } from "@/store/widget/toast.js";

const box = {
  addError(title = "Hata", text = "İşlem başarısız", time = 3000) {
    addToast({
      cls: "response-message response-error",
      title: title,
      icon: "warning",
      iconCls: "error",
      text: text,
      time: time,
    });
  },

  addSuccess(title = "Başarılı", text = "İşlem başarılı", time = 3000) {
    addToast({
      cls: "response-message response-success",
      title: title,
      icon: "check",
      iconCls: "success",
      text: text,
      time: time,
    });
  },

  controlResponse(res) {
    if (!res.success) {
      box.addError();
    }
  },
};
export default box;
