<template>
  <div class="home">
    <k-ckeditor
      id="editor"
      v-model="data"
    ></k-ckeditor>
    <div></div>
  </div>
</template>

<script>

import KCkeditor from '@/components/ckeditor/KCkeditor.vue'

export default {
  name: 'Home',
  components: {
    KCkeditor
  },
  data: function () {
    return {
      data: '测试的时候'
    }
  },
  mounted: function () {
    this.getData()
  },
  methods: {
    getData () {
      return '123'
    }
  }
}
</script>
<style scoped></style>
