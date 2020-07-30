<template>
  <transition name="confirm">
    <div class="confirm" v-show="show">
      <div class="confirm-wrapper">
        <div class="confirm-content">
          <p class="text">{{ text }}</p>
          <div class="operate">
            <div @click="cancle" class="operate-btn left">
              {{ cancleBtnText }}
            </div>
            <div @click="confirm" class="operate-btn">{{ confirmBtnText }}</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { reactive, toRefs, defineComponent } from "vue";
export default defineComponent({
  name: "BaseConfirm",
  props: {
    text: {
      type: String,
      default: "",
    },
    show: {
      type: Boolean,
      default: false,
    },
    confirmBtnText: {
      type: String,
      default: "确定",
    },
    cancleBtnText: {
      type: String,
      default: "取消",
    },
  },
  setup(props, { emit }) {
    const state = reactive({
      show: props.show,
    });
    function onShow() {
      state.show = true;
    }
    function onHide() {
      state.show = false;
    }
    function cancle() {
      onHide();
      emit("cancle");
    }
    function confirm() {
      onHide();
      emit("confirm");
    }
    return {
      ...toRefs(state),
      onShow,
      onHide,
      cancle,
      confirm,
    };
  },
});
</script>

<style lang="stylus" scoped>
@import "../styles/var.styl"

.confirm
  position fixed
  left 0
  right 0
  top 0
  bottom 0
  z-index 998
  background-color $grey1
  &.confirm-enter-active
    animation confirm-fadein 0.3s
    .confirm-content
      animation confirm-zoom 0.3s
  .confirm-wrapper
    position absolute
    top 50%
    left 50%
    transform translate(-50%, -50%)
    z-index 999
    .confirm-content
      width 270px
      border-radius 13px
      background $grey2
      .text
        padding 19px 15px
        line-height 22px
        text-align center
        font-size $font-xl
        color $green
      .operate
        display flex
        align-items center
        text-align center
        font-size $font-l
        .operate-btn
          flex 1
          line-height 22px
          padding 10px 0
          border-top 1px solid $green-dark
          color $green-dark
          &.left
            border-right 1px solid $green-dark

@keyframes confirm-fadein
  0%
    opacity 0
  100%
    opacity 1

@keyframes confirm-zoom
  0%
    transform scale(0)
  50%
    transform scale(1.1)
  100%
    transform scale(1)
</style>
