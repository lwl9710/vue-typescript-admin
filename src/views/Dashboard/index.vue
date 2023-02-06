<script name="Dashboard" lang="ts" setup>
import { TABLE_OPTION } from "./option";
const tableOption = ref(TABLE_OPTION);
const tableData = ref([
  {
    name: "小明",
    avatar: "https://img2.baidu.com/it/u=1385559459,94521354&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1675098000&t=21386f6dfa6bd270796954b514ba58f4",
    gender: 0,
    age: 23,
    createTime: Date.now()
  },
  {
    name: "小明",
    avatar: "https://img2.baidu.com/it/u=1385559459,94521354&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1675098000&t=21386f6dfa6bd270796954b514ba58f4",
    gender: 1,
    age: 25,
    createTime: Date.now()
  }
]);
const pagination = ref({
  total: 2,
  pageSize: 10,
  currentPage: 1
});
const onSearch = (data: any) => {
  console.log("触发搜索", data);
}
const onDelRow = (data: any) => {
  ElMessageBox.confirm("你确定要删除吗?")
  .then(() => {
    console.log("删除行", data);
  });
}

const onEditRow = ({ data, done }: any) => {
  console.log("编辑行", data);
  done();
}

function onAddRow({ data, done }: any) {
  console.log("添加行: ", data);
  done();
}
function onSizeChange() {
  console.log("页面变更");
}
function onSelectChange(rows: any) {
  console.log("选中改变", rows);
}
function onCurrentChange() {
  console.log("页码改变");
};
onMounted(() => {
  ElMessage.success("页面加载成功");
});
</script>
<template>
<BasicContainer>
  <crud-table
    :data="tableData"
    :option="tableOption"
    v-model:total="pagination.total"
    v-model:page-size="pagination.pageSize"
    v-model:current-page="pagination.currentPage"
    @delRow="onDelRow"
    @editRow="onEditRow"
    @addRow="onAddRow"
    @current-change="onCurrentChange"
    @sizeChange="onSizeChange"
    @search="onSearch"
    @selection-change="onSelectChange"
  >
    <template #avatar="{ row }">
      <img style="width: 50px; height: 50px" :src="row.avatar" alt="">
    </template>
  </crud-table>
</BasicContainer>
</template>
