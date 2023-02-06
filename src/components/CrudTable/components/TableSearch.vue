<script lang="ts" setup>
import { initValue } from "../option";
import FormColumn from "./FormColumn.vue";
import { Column } from "../types";
const props = defineProps<{
  columns: Array<Column>
}>();
const emits = defineEmits<{ (e: 'search' | 'reset', v: any): void }>();
let duplicate = {};
const searchContent = ref({} as StringObject);
const searchColumns = computed(() => {
  let columns = JSON.parse(JSON.stringify(props.columns))
      .filter((column: Column) => column.search)
      .map((column: Column) => Object.assign({ dataType: "string" }, column));
  duplicate = columns.reduce((o: StringObject, column: Column) => {
    o[column.prop] = initValue(column.dataType);
    return o;
  }, {} as StringObject);
  searchContent.value = JSON.parse(JSON.stringify(duplicate));
  return columns;
});
const clickResetSearch = () => {
  searchContent.value = JSON.parse(JSON.stringify(duplicate));
  emits("reset", JSON.parse(JSON.stringify(duplicate)));
}
</script>
<template>
<div v-if="searchColumns.length" class="table-search">
  <el-form inline>
    <el-form-item v-for="(column, index) in searchColumns" :key="index" :label="column.label">
      <FormColumn v-model="searchContent[column.prop]" :column="column"></FormColumn>
    </el-form-item>
    <el-form-item>
      <el-button icon="Refresh" @click="clickResetSearch" >重置</el-button>
      <el-button icon="Search" type="primary" @click="emits('search', JSON.parse(JSON.stringify(searchContent)))">搜索</el-button>
    </el-form-item>
  </el-form>
</div>
</template>
<style lang="scss" scoped>
.table-search {
  ::v-deep(.form-column-item) {
    .el-input {
      width: 214px;
    }
    .el-date-editor {
      width: var(--el-date-editor-width);
      > .el-input__wrapper {
        width: 100%;
      }
    }
  }
}
</style>
