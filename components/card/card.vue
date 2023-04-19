<template>
	<div class="w-100 h-100 position-fixed " style="z-index: 999;top: 0;left: 0;right: 0;bottom: 0;" v-if="cardShow">
		<div class="w-100 h-100 d-flex a-center j-center" style=" background: rgba(0,0,0,0.3);">
			<div class="animation-target aaa" :style="{width: width}">
				<el-card class="box-card">
					<div slot="header" class="d-flex a-center j-sb">
						<span>{{ cardName }}</span>
            <div class="">
              <el-button style="" type="text" @click="closeCard">关闭</el-button>
            </div>

					</div>
					<div class="text item">
						<slot></slot>
					</div>
				</el-card>
			</div>

		</div>
	</div>
</template>

<script>
	export default {
		props: {
			cardName: {
				type: String,
				default: "卡片"
			},
			cardShow: {
				type: Boolean,
				default: false
			},
			width:{
				type: String,
				default: "700px"
			}
		},
		data() {
			return {

			}
		},
		methods: {
			// 关闭按钮触发事件
			closeCard() {
				this.$emit("closeCard")
			}
		}
	}
</script>

<style scoped>
	.box-card >>> .el-card__body{
		padding: 0 !important;
	}
</style>
