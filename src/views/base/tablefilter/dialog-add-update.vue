<template>
	<x-dialog
		:title="`${isUpdate ? '修改' : '新增'}`"
		:visible.sync="visible"
		width="560px"
		height="400px"
	>
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
import DialogMixin from '@/mixins/dialog';
import { getMainFormFields } from './formFields';

const dataForm = {
	id: '',
	name: '',
	tel: '',
	email: '',
	age: '',
	address: '',
};

export default {
	mixins: [DialogMixin],
	data() {
		return {
			disabledFields: [], // 禁用的字段
			fields: getMainFormFields(this),
			dataForm: { ...dataForm },
		};
	},
	computed: {
		isUpdate() {
			return !!this.dataForm.id;
		},
	},
	methods: {
		init(data) {
			this.dataForm = { ...dataForm, ...data };
		},
		handleSubmit() {
			this.$refs.dataForm.validate((valid) => {
				if (valid) {
					// 表单验证通过
				}
			});
		},
	},
};
</script>

<style></style>
