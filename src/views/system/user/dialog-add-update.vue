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
	</x-dialog>
</template>

<script>
import DialogMixin from '@/mixins/dialog';
import { getMainFormFields } from './formFields';
import { getUser, add, update } from '@/apis/system/user';

export default {
	mixins: [DialogMixin],
	data() {
		return {
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
			if (id) {
				this.getDetail(id);
			}
		},
		getDetail(id) {
			getUser(id).then(({ data }) => {
				this.dataForm = {
					...data,
					fileList: data.avatar
						? [
								{
									url: data.avatar,
								},
						  ]
						: [],
					sex: data.sex + '',
				};
			});
		},
		handleSubmit() {
			this.$refs.dataForm.validate((valid) => {
				if (valid) {
					const { id, fileList, ...params } = this.dataForm;
					if (fileList && fileList.length) {
						params.avatar = fileList[0].url;
					}
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
				} else {
				}
			});
		},
	},
};
</script>

<style></style>
