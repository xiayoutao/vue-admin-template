<template>
	<x-dialog title="弹窗表单" :visible.sync="visible">
		<form-config
			ref="dataForm"
			v-model="dataForm"
			:fields="fields"
			:alone-rules="false"
			:disabled-fields="disabledFields"
		></form-config>
		<template #footer>
			<el-button type="primary" icon="el-icon-check" @click="handleSubmit()">
				提交
			</el-button>
			<el-button
				type="primary"
				icon="el-icon-refresh-left"
				@click="handleCancel()"
			>
				取消
			</el-button>
		</template>
	</x-dialog>
</template>

<script>
import { getFields } from './fields';

export default {
	props: {
		show: Boolean,
	},
	data() {
		return {
			visible: false,
			dataForm: {
				id: 'sssssss',
				title: '2222',
				switch: false,
				file: [{ name: 'food.jpeg' }, { name: 'food.jpeg' }],
			},
			disabledFields: [],
			fields: getFields(this),
		};
	},
	methods: {
		handleSubmit() {
			this.$refs.dataForm.validate((valid) => {
				if (valid) {
					// 表单验证通过
				} else {
				}
			});
		},
		handleCancel() {
			this.visible = false;
		},
	},
	watch: {
		show(val) {
			this.visible = val;
		},
		visible(val) {
			this.$emit('update:show', val);
		},
	},
};
</script>

<style></style>
