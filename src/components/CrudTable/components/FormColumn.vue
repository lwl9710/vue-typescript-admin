<script lang="ts" setup>
import { Column } from "../types";

const props = defineProps<{
  modelValue: any;
  column: Column
}>();

const getPlaceholder = (column: Column, prefix: string = "请输入") => {
  return column.placeholder || (prefix + column.label);
}

const emits = defineEmits<{ (e: "update:modelValue", value: any): void }>();
</script>
<template>
<div class="form-column-item">
  <el-input
    v-if="column.dataType === 'string'"
    :clearable="column.clearable"
    :modelValue="props.modelValue"
    @update:modelValue="emits('update:modelValue', $event)"
    :placeholder="getPlaceholder(column)"
    :type="column.nativeType"
    :minlength="column.minlength"
    :maxlength="column.maxlength"
    :show-word-limit="column.showWordLimit"
    :resize="column.resize"
  ></el-input>
  <el-date-picker
      :clearable="column.clearable"
      v-else-if="column.dataType === 'datetime'"
      :modelValue="props.modelValue"
      @update:modelValue="emits('update:modelValue', $event)"
      :type="column.pickerType || column.dataType"
      :format="column.format"
      :value-format="column.valueFormat"
      :placeholder="getPlaceholder(column, '选择')"
      :start-placeholder="column.startPlaceHolder || '请选择开始时间'"
      :end-placeholder="column.endPlaceHolder || '请选择结束时间'"
  />
  <el-select
    v-else-if="column.dataType === 'select'"
    :multiple="column.multiple"
    :clearable="column.clearable"
    :modelValue="props.modelValue"
    @update:modelValue="emits('update:modelValue', $event)"
    style="width: 100%"
    :placeholder="getPlaceholder(column, '选择')"
  >
    <el-option v-for="item in column.selectList" :key="item.value" v-bind="item" />
  </el-select>
  <el-radio-group
    v-else-if="column.dataType === 'radio'"
    :modelValue="props.modelValue"
    @update:modelValue="emits('update:modelValue', $event)"
  >
    <el-radio v-for="item in column.selectList" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
  </el-radio-group>
  <el-upload
      v-else-if="column.dataType === 'file'"
      class="avatar-uploader"
      :name="column.name || 'file'"
      :headers="column.headers"
      :data="column.data"
      :accept="column.accept || '*'"
      :action="column.action"
      :show-file-list="false"
  >
    <img v-if="props.modelValue" :src="props.modelValue" class="avatar" />
    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
  </el-upload>
</div>
</template>
<style lang="scss" scoped>
.form-column-item {
  width: 100%;
  ::v-deep(.el-date-editor) {
    box-sizing: border-box;
    width: 100%;
    > .el-input__wrapper{
      display: flex;
      box-sizing: border-box;
      width: 100%;
    }
  }
  ::v-deep(.el-upload) {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
    &:hover {
      border-color: var(--el-color-primary);
    }
  }
  $UPLOAD_SIZE: 120px;
  ::v-deep(.el-icon.avatar-uploader-icon) {
    color: #8c939d;
    width: $UPLOAD_SIZE;
    height: $UPLOAD_SIZE;
    text-align: center;
    font-size: 28px;
  }
  .avatar-uploader .avatar {
    display: block;
    width: $UPLOAD_SIZE;
    height: $UPLOAD_SIZE;
  }
}
</style>
