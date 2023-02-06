<script lang="ts" setup>
import { Column } from "../types";
import { initValue } from "../option";
import FormColumn from "./FormColumn.vue";
import { Ref } from "vue";
const enum DialogType {
  ADD = 1,
  EDIT = 2
}

const props = defineProps<{
  columns: Array<Column>
}>();
const emits = defineEmits<{
  (e: "add", rawData: any): void
  (e: "edit", rawData: any): void
}>();

const showDialog = ref(false);

const rowData = ref({} as StringObject);

const rules:Ref<Record<string, any>> = ref({});

const formRef: Ref = ref(null);

const mode = ref(DialogType.ADD);

const resetRowData = (currentRowData?: any) => {
  const newRules: Record<string, any> = {};
  const newRowData: any = {};
  switch (mode.value) {
    case DialogType.ADD:
      props.columns.forEach((column: Column) => {
        if(column.hideAdd !== true) {
          newRowData[column.prop] = initValue(column.dataType, column.multiple);
          if(column.rules) {
            newRules[column.prop] = column.rules;
          }
        }
      });
    break;
    case DialogType.EDIT:
      props.columns.forEach((column: Column) => {
        if(column.hideEdit !== true) {
          const value = (currentRowData || {})[column.prop];
          newRowData[column.prop] = value === undefined ? initValue(column.dataType) : value;
          if(column.rules) {
            newRules[column.prop] = column.rules;
          }
        }
      });
    break;
  }
  rowData.value = newRowData;
  rules.value = newRules;
}

const isShowColumn = (column: Column): boolean => {
  return (mode.value === DialogType.ADD && column.hideAdd !== true) || (mode.value === DialogType.EDIT && column.hideEdit !== true);
}

const clickConfirm = () => {
  (formRef.value?.validate)()
  .then(() => {
    const formData = JSON.parse(JSON.stringify(rowData.value));
    switch (mode.value) {
      case DialogType.ADD: return emits("add", formData);
      case DialogType.EDIT: return emits("edit", formData);
    }
  });
}

defineExpose<{ show(type: DialogType): void, hide(): void }>({
  show(newMode: DialogType, rowData?: any) {
    mode.value = newMode;
    resetRowData(rowData);
    showDialog.value = true;
  },
  hide() {
    showDialog.value = false;
  }
});
</script>
<template>
<el-dialog
  :title="mode === 1 ? '新增' : '编辑'"
  v-model="showDialog"
  :close-on-click-modal="false"
  :destroy-on-close="true"
  width="800px"
>
  <el-form ref="formRef" :model="rowData" :rules="rules">
    <ul class="form-container">
      <template v-for="(column, index) in props.columns">
        <li class="form-column" v-if="isShowColumn(column)" :key="index" :style="{ width: column.formWidth || 'calc(50% - 15px)' }">
          <el-form-item :label="column.label" :prop="column.prop">
            <FormColumn v-model="rowData[column.prop]" :column="column"></FormColumn>
          </el-form-item>
        </li>
      </template>
    </ul>
  </el-form>
  <template #footer>
    <el-button @click="showDialog = false">取消</el-button>
    <el-button @click="clickConfirm" type="primary">确定</el-button>
  </template>
</el-dialog>
</template>
<style lang="scss" scoped>
.form-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
</style>
