<template>
  <div v-if="isLoading">
    <div class="spinner">
      <div class="double-bounce1" :style="styles"></div>
      <div class="double-bounce2" :style="styles"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: true
    },
    color: {
      type: String,
      default: '#333'
    },
    width: {
      type: String,
      default: '40'
    },
    height: {
      type: String,
      default: '40'
    }
  },
  computed: {
    isLoading () {
      return this.loading
    },
    styles () {
      return {
        backgroundColor: this.color,
        width: this.width + 'px',
        height: this.height + 'px'
      }
    }
  },
  name: 'BounceSpinner'
}
</script>

<style scoped>
div {
  transition: background-color .5s;
}
.spinner {
  width: 40px;
  height: 40px;
  position: relative;
  margin: 100px auto;
}
.double-bounce1,
.double-bounce2 {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  opacity: 0.6;
  position: absolute;
  top: 0;
  left: 0;
  -webkit-animation: sk-bounce 2.0s infinite ease-in-out;
  animation: sk-bounce 2.0s infinite ease-in-out;
}
.double-bounce2 {
  -webkit-animation-delay: -1.0s;
  animation-delay: -1.0s;
}
@-webkit-keyframes sk-bounce {
  0%,
  100% {
    -webkit-transform: scale(0.0)
  }
  50% {
    -webkit-transform: scale(1.0)
  }
}
@keyframes sk-bounce {
  0%,
  100% {
    transform: scale(0.0);
    -webkit-transform: scale(0.0);
  }
  50% {
    transform: scale(1.0);
    -webkit-transform: scale(1.0);
  }
}
</style>
