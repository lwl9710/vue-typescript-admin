<script lang="ts" setup>
import { Ref } from "vue";
import useSettingStore from "@/store/setting";
import SideMenu from "./SideMenu.vue";
const route = useRoute();
const store = useSettingStore();
const defaultActive: Ref<string> = ref("");
watch(route, () => {
  defaultActive.value = (route.name || "--") as string;
});
onMounted(() => {
  defaultActive.value = route.name as string;
});
</script>
<template>
<aside class="element-scroll-bar">
  <el-menu :collapse="store.isCollapse" class="custom-el-menu" text-color="#BFCBD9" :default-active="defaultActive">
    <SideMenu v-for="route in store.routes" :key="route.name" :menu="route">
    </SideMenu>
  </el-menu>
</aside>
</template>
<style lang="scss" scoped>
aside {
  user-select: none;
  overflow-y: auto;
  height: 100%;
  background-color: #304156;
  ::v-deep(.el-menu) {
    width: 210px;
    background-color: #304156;
    border-right: none;
    &.el-menu--collapse {
      width: calc(var(--el-menu-icon-width) + var(--el-menu-base-level-padding) * 2);
    }
  }
  ::v-deep(.el-menu-item:hover) {
    background-color: #263445;
  }
  ::v-deep(.el-sub-menu__title:hover) {
    background-color: #263445;
  }
}
</style>
