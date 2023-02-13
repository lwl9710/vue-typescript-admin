<script name="CrudTable" lang="ts" setup>
import { Column, Option } from "./types";
import { DEFAULT_ALIGN ,formatDateTime } from "./option";
import { Ref } from "vue";
import RowChangeDialog from "./components/RowChangeDialog.vue";
import TableSearch from "./components/TableSearch.vue";

interface Emits {
  (e: "select" | "select-all" | "selection-change", v: any): void;
  (e: "search" | "reset", v: any): void;
  (e: "current-change" | "size-change" | "update:current-page" | "update:page-size", v: number): void;
  (e: "add-row" | "edit-row" | "del-row", rawData: any): void;
}

interface Props {
  data: Array<StringObject>;
  option: Option;
  pagination?: boolean;
  total?: number,
  pageSize?: number,
  pageSizes?: Array<number>,
  currentPage?: number
}
let $index = -1;

const emits = defineEmits<Emits>();
const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  option: () => ({ border: true, columns: [] }),
  pagination: true,
  total: 0,
  pageSize: 10,
  currentPage: 1,
  pageSizes: () => [10, 20, 50, 100]
});
const tableRef = ref({});
// 表格Prop
const tableProp = computed(() => {
  const { clearable, align, border, showEdit, showAdd, showDel, columns, selection, leftSlot, emptyValue, selectable, ...rest  } = props.option;
  return {
    ...rest,
    data: props.data,
    border: border === undefined ? true : border
  }
});
const showOperator = computed(() => {
  return props.option.showDel || props.option.showEdit;
});
const tableColumns = computed(() => {
  let columns = JSON.parse(JSON.stringify(props.option.columns)) as Array<Column>;
  let operatorColumnIndex: number = columns.findIndex(column => column.prop === 'operator');
  if(operatorColumnIndex === -1) {
    // 不存在
    if(showOperator.value) {
      columns = columns.concat({label: "操作", prop: "operator", width: "180px", hideEdit: true, hideAdd: true});
    }
  } else {
    columns[operatorColumnIndex] = Object.assign({hideAdd: true, hideEdit: true}, columns[operatorColumnIndex]);
  }
  return columns.map((column) => {
    return Object.assign({
      align: props.option.align || DEFAULT_ALIGN,
      dataType: "string",
      clearable: props.option.clearable !== false,
      dicData: column.selectList?.reduce((o, next) => {
        o[next.value] = next.label;
        return o
      }, {} as StringObject)
    }, column);
  });
});
const emptyValue = computed(() => {
  return props.option.emptyValue === undefined ? "--" : props.option.emptyValue;
});
const getTableColumnProp = (column: Column) => {
  return {
    label: column.label,
    prop: column.prop,
    align: column.align,
    width: column.width,
    type: column.type
  }
}
const rowDialog: Ref = ref(null);
const clickAddRow = () => {
  rowDialog.value?.show(1);
}
const clickEditRow = (slotProps: any) => {
  rowDialog.value?.show(2, slotProps.row);
  $index = slotProps.$index;
};
const clickConfirm = (eventType: "add-row" | "edit-row", data: any) => {
  const eventData: any = {
    data,
    done() {
      rowDialog.value?.hide();
    }
  }
  if(eventType === "edit-row") {
    eventData.$index = $index;
  }
  emits(eventType, eventData);
}
const onCurrentPageUpdate = (currentPage: number) => {
  emits("update:current-page", currentPage);
  emits("current-change", currentPage);
}
const onPageSizeUpdate = (pageSize: number) => {
  emits("update:page-size", pageSize);
  emits("size-change", pageSize);
}
defineExpose({ tableRef: tableRef });
</script>
<template>
<div class="crud-table">
  <TableSearch :columns="tableColumns" @search="emits('search', $event)" @reset="emits('reset', $event)"></TableSearch>
  <div class="crud-operator" v-if="props.option.showAdd || props.option.leftSlot">
    <el-button v-if="props.option.showAdd" icon="plus" type="success" @click="clickAddRow">新增</el-button>
    <slot v-if="props.option.leftSlot" name="tableLeft"></slot>
  </div>
  <el-table
    ref="tableRef"
    v-bind="tableProp"
    @select="emits('select', $event)"
    @select-all="emits('select-all', $event)"
    @selection-change="emits('selection-change', $event)"
  >
    <el-table-column v-if="props.option.selection" type="selection" :selectable="props.option.selectable"></el-table-column>
    <template v-for="(column, index) in tableColumns" :key="index">
      <el-table-column v-if="column.hide !== true" v-bind="getTableColumnProp(column)">
        <template v-if="column.headerSlot" #header="{ name, ...slotProps }">
          <slot :name="column.prop + '-header'"></slot>
        </template>

        <template v-if="column.slot" #default="{ name, ...slotProps }">
          <slot :name="column.prop" v-bind="slotProps"></slot>
        </template>
        <template v-else-if="showOperator && column.prop === 'operator'" #default="{ name, ...slotProps }">
          <el-button v-if="props.option.showEdit" @click="clickEditRow(slotProps)" icon="edit" link type="primary">编辑</el-button>
          <el-button v-if="props.option.showDel" @click="emits('del-row', slotProps)" icon="delete" link type="danger">删除</el-button>
          <slot name="operator" v-bind="slotProps"></slot>
        </template>
        <template v-else-if="column.dataType === 'datetime'" #default="{ row }">{{ formatDateTime(row[column.prop], column.valueFormat) || emptyValue }}</template>
        <template v-else-if="column.selectList && column.multiple" #default = "{ row }">
          {{ row[column.prop].map(key => column.dicData[key]).join(",") || emptyValue }}
        </template>
        <template v-else-if="column.selectList && !column.multiple" #default = "{ row }">
          {{ column.dicData[row[column.prop]] || emptyValue }}
        </template>
      </el-table-column>
    </template>
  </el-table>
  <div v-if="pagination" class="crud-pagination">
    <el-pagination
      background
      :current-page="props.currentPage"
      :page-size="props.pageSize"
      @update:current-page="onCurrentPageUpdate"
      @update:page-size="onPageSizeUpdate"
      :page-sizes="props.pageSizes"
      layout="total, sizes, prev, pager, next, jumper"
      :total="props.total"
    />
  </div>
  <RowChangeDialog
      ref="rowDialog"
      :columns="tableColumns"
      @add="clickConfirm('add-row', $event)"
      @edit="clickConfirm('edit-row', $event)"
  ></RowChangeDialog>
</div>
</template>
<style lang="scss" scoped>
.crud-table {
  .crud-operator {
    padding-bottom: 20px;
  }
  ::v-deep(.el-table) {
    th.el-table__cell {
      color: #000000d9;
      background-color: #fafafa
    }
  }
}
.crud-pagination {
  padding-top: 20px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
</style>
