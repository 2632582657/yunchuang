<template>
	<div id="app">
		<router-view v-if="isRouterAlive"></router-view>
	</div>
</template>

<script>
	export default {
		provide() {
			return {
				reload: this.reload
			}
		},
		data() {
			return {
				isRouterAlive: true,
			}
		},

		methods: {
			saveState() {
				sessionStorage.removeItem('state')
				sessionStorage.setItem('state', JSON.stringify(this.$store.state))
			},
			reload() {
				this.isRouterAlive = false;
				this.$nextTick(function () {
					this.isRouterAlive = true;
				})
			}
		},
		mounted() {
			if (window.addEventListener) {
				window.addEventListener('unload', this.saveState)
			} else if (window.attachEvent) {
				window.attachEvent('unload', this.saveState)
			}
		},
		beforeDestroy() {
			if (window.removeEventListener) {
				window.removeEventListener('unload', this.saveState)
			} else if (window.detachEvent) {
				window.detachEvent('unload', this.saveState)
			}

		},
		components: {}
	};
</script>
<style lang="scss" scoped>
	#app {
		height: 100%;
		width: 100%;
	}
</style>
