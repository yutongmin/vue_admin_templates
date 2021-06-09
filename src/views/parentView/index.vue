<template>
  <div style="padding:10px;">
    <transition name="fade" mode="out-in">
      <!-- <keep-alive :include="cachedViews"> -->
        <router-view></router-view>
      <!-- </keep-alive> -->
    </transition>
  </div>
</template>
<script>
export default {
  name: 'ParentView',
  data() {
    return {
      value: ""
    }
  },
  computed: {
    // cachedViews() {
    //   return this.$store.state.tagsView.cachedViews
    // },
  }

}
</script>