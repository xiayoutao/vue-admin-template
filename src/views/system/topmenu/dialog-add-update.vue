<template>
	<x-dialog
		:title="`${isUpdate ? '修改' : '新增'}用户`"
		:visible.sync="visible"
		width="500px"
		height="480px"
		top="5vh"
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
		<menu-icon
			:show.sync="menuIconVisible"
			@selected="handleSelectIcon"
		></menu-icon>
	</x-dialog>
</template>

<script>
import DialogMixin from '@/mixins/dialog';
import MenuIcon from '../menu/dialog-menu-icon.vue';
import { getMainFormFields } from './formFields';
import { getDetail, add, update } from '@/apis/system/topmenu';

export default {
	mixins: [DialogMixin],
	components: {
		MenuIcon,
	},
	data() {
		return {
			menuIconVisible: false,
			disabledFields: [], // 禁用的字段
			fields: getMainFormFields(this),
			dataForm: {},
		};
	},
	computed: {
		isUpdate() {
			return !!this.dataForm.id;
		},
	},
	methods: {
		init(id) {
			this.getDetail(id);
		},
		getDetail(id) {
			if (!id) return;
			getDetail(id).then(({ data }) => {
				this.dataForm = { ...data };
			});
		},
		handleSubmit() {
			this.$refs.dataForm.validate((valid) => {
				if (valid) {
					const { id, ...params } = this.dataForm;
					if (this.isUpdate) {
						params.id = id;
					}
					// 表单验证通过
					const pending = this.isUpdate ? update(params) : add(params);
					pending.then(() => {
						this.visible = false;
						this.$emit('success');
						this.$message({
							type: 'success',
							message: `${this.isUpdate ? '修改' : '添加'}成功`,
						});
					});
				}
			});
		},
		handleSelectIcon(icon) {
			console.log('icon', icon);
			this.dataForm.source = icon;
		},
	},
};
</script>

<style></style>
