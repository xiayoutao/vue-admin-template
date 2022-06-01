<template>
	<div class="page-dashboard">
		<el-button icon="iconfont icon-phone_fill" @click="dialogVisible = true">
			表单弹窗
		</el-button>
		<el-button icon="iconfont icon-phone_fill" @click="tabsVisible = true">
			标签弹窗
		</el-button>
		<div style="height: 1200px"></div>
		<x-dialog title="弹窗" :visible.sync="tabsVisible">
			<el-button @click="tabsVisible2 = true">打开弹窗</el-button>
		</x-dialog>
		<dialog-form ref="dialogForm" :show.sync="dialogVisible"></dialog-form>
	</div>
</template>

<script>
import DialogForm from './dialog-form.vue';

export default {
	name: 'formPage',
	components: {
		DialogForm,
	},
	data() {
		return {
			dialogVisible: false,
			tabsVisible: false,
			tabsVisible2: false,
		};
	},
};
</script>

<style lang="scss" scoped></style>
