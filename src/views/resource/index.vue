<script setup>
import {ref, reactive, onMounted, toRefs} from 'vue'
import {Search, Grid} from '@element-plus/icons-vue'
import {selectTables, executedSql} from "@/api/resource";
import {chatAi} from "@/api/chat";

const data = [
  {
    label: '全部',
    children: [
      {
        label: 'mysql数据库',
      },
      {
        label: 'oracle数据库',
      },
    ],
  }
]

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const state = reactive({
  isShowResult: false,
  sql: '',
  content: '',
  tableNames: [],
  selectedTables: [],
  fieldNames: [],
  tableResultData: []
})
const {tableNames, selectedTables, sql, content, isShowResult} = toRefs(state);


const editableTabs = ref([
  {
    title: 'Tab 1',
    name: '1',
    content: 'Tab 1 content',
  },
  {
    title: 'Tab 2',
    name: '2',
    content: 'Tab 2 content',
  },
])




const handleNodeClick = (data) => {
  console.log(data)
}

const handleSearch = async () => {
  const {data} = await chatAi({content: state.content, tableNames: state.selectedTables, promptType: 'NL_2_SQL'})
  state.sql = data;
}

const tabClick = (name) => {
  console.log("targetName", name)
  state.isShowResult = false
}

const handlePage = async () => {
  // 发送数据到后端得到执行结果
  const {data} = await executedSql(state.sql, currentPage.value, pageSize.value);
  state.isShowResult = true
  state.fieldNames = data.fieldNames
  state.tableResultData = data.resultData
  total.value = data.total
}

const handleSizeChange = (val) => {
  pageSize.value = val;
  handlePage()
}
const handleCurrentChange = (val) => {
  currentPage.value = val;
  handlePage()
}


onMounted(async () => {
  const {data} = await selectTables();
  state.tableNames = data;

})
</script>
<template>
  <div class="app-container">
    <!--  左侧各种数据源列表  -->
    <!--  操作面板   -->
    <el-card>
      <el-row justify="space-between">
        <el-col :span="6">
          <el-tree
            style="max-width: 600px"
            :data="data"
            default-expand-all
            :props="{ children: 'children',label: 'label'}"
            @node-click="handleNodeClick"
          />
        </el-col>
        <el-col :span="18">
          <el-row>
            <el-col :span="10">
              <el-button type="primary" @click="handlePage">执行SQL</el-button>
            </el-col>
            <el-col :span="14">
              <el-input v-model="content" placeholder="请输入自然语言">
                <template #suffix>
                  <el-button type="primary" @click="handleSearch">自然语言转SQL</el-button>
                  <el-popover
                    placement="bottom-start"
                    :width="300"
                    trigger="hover"
                  >
                    <template #reference>
                      <el-button :icon="Grid" class="m-r--3"></el-button>
                    </template>
                    <el-select
                      v-model="selectedTables"
                      multiple
                      clearable
                      placeholder="请选择表"
                      :teleported="false"
                    >
                      <el-option
                        v-for="item in tableNames"
                        :key="item"
                        :label="item"
                        :value="item"
                      />
                    </el-select>
                  </el-popover>
                </template>
              </el-input>
            </el-col>
          </el-row>
          <el-form>
            <el-form-item>
              <el-input v-model="sql" type="textarea" rows="10" style="width: 100%;"
                        class="m-t-2"
                        placeholder="请输入sql语句进行执行"/>

            </el-form-item>
          </el-form>
          <el-tabs type="border-card"  closable  v-if="isShowResult" @click="tabClick">
            <el-tab-pane label="结果" :closable="true">
              <el-table :data="state.tableResultData" border style="width: 100%">
                <el-table-column v-for="item in state.fieldNames" :prop="item" :label="item"/>
              </el-table>
              <el-pagination
                v-model:current-page="currentPage"
                v-model:page-size="pageSize"
                :page-sizes="[10, 50, 100, 1000]"
                :small="small"
                :disabled="disabled"
                :background="background"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              />
            </el-tab-pane>
          </el-tabs>

        </el-col>
      </el-row>


    </el-card>


  </div>
</template>


<style scoped>

</style>
