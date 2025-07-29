<template>
  <div v-show="ishide">
    <!-- 弹框 -->
    <div class="popup">
      <div @click="$emit('nohide')" class="shadow"></div>
      <div
        class="content"
        :style="{
          top: styles.top,
          left: styles.left,
          width: styles.width,
          height: styles.height,
          minHeight: styles.minHeight,
          maxHeight: styles.maxHeight
        }"
      >
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'popup',
  props: {
    ishide: {
      type: Boolean
    },
    styles: {
      type: Object
    }
  },
  mounted () {
  },
  methods: {
  }
}
</script>

<style scoped>
.popup {
  width: 100%;
  height: 100%;
  opacity: 1;
  position: fixed;
  top: 0px;
  left: 0px;
  z-index: 999;
}

.shadow {
  opacity: 0.2;
  background-color: black;
  position: absolute;
  width: 100%;
  min-height: 100vh;
}

.content {
  position: absolute;
  top: 25%;
  left: 50%;
  opacity: 1;
  width: 750px;
  background-color: #fff;
  transform: translateX(-50%);
  overflow: auto;
}
</style>