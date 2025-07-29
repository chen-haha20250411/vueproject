<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default{
  name: 'App'
}
</script>


<!-- 在 App.vue 或布局组件中  20250717 update-->
<!-- <template>
  <div id="app">
    <keep-alive :include="cachedViews">
      <router-view :key="$route.fullPath"/>
    </keep-alive>
  </div>
</template>

<script>
export default {
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    }
  }
}
</script> -->