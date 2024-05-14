import { request } from "@/utils/service"


export function chatAi(data:any) {
  return request({
    url: "chat/ai",
    method: "post",
    data
  })
}


