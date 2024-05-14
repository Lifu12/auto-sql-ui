import { request } from "@/utils/service"


export function selectTables() {
  return request({
    url: "resource/selectTables",
    method: "get"
  })
}

export function executedSql(sql:any,currentPage:any,pageSize:any) {
  return request({
    url: `resource/executedSql?sql=${sql}&currentPage=${currentPage}&pageSize=${pageSize}`,
    method: "get"
  })
}


