<template>
	<x-dialog
		:title="`${isUpdate ? '修改' : '新增'}权限`"
		:visible.sync="visible"
		width="500px"
		height="340px"
	>
		<form-config
			ref="dataForm"
			v-model="dataForm"
			:fields="fields"
			:alone-rules="false"
			label-width="90px"
		></form-config>
		<template #footer>
			<el-button
				type="primary"
				icon="el-icon-check"
				v-prevent-click
				@click="handleSubmit()"
			>
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
import { add, update, getDetail } from '@/apis/system/role';

export default {
	mixins: [DialogMixin],
	data() {
		return {
			treeMenu: [],
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
			if (id) {
				this.getDetail(id);
			} else {
				this.dataForm = {
					status: 1,
				};
			}
		},
		getDetail(id) {
			getDetail(id).then(({ data }) => {
				this.dataForm = {
					...data,
				};
			});
		},
		handleSubmit() {
			this.$refs.dataForm.validate((valid) => {
				if (valid) {
					const { id, ...params } = this.dataForm;
					if (this.isUpdate) {
						params.id = id;
					}
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
	},
};
</script>

<style></style>
