<template>
	<x-dialog
		:title="`${isUpdate ? '修改' : '新增'}`"
		:visible.sync="visible"
		width="500px"
		height="400px"
		top="5vh"
	>
		<form-config
			ref="dataForm"
			v-model="dataForm"
			:fields="fields"
			:alone-rules="false"
			:disabled-fields="['code']"
		></form-config>
		<template slot="footer">
			<el-button
				class="btn-custom"
				type="primary"
				size="mini"
				icon="el-icon-check"
				v-prevent-click
				@click="handleSubmit()"
			>
				确定
			</el-button>
			<el-button
				class="btn-custom"
				type="primary"
				size="mini"
				@click="visible = false"
			>
				取消
			</el-button>
		</template>
	</x-dialog>
</template>

<script>
import DialogMixin from '@/mixins/dialog';
import { dictForm } from './models';
import { getFormFields } from './formFields';
import { getDict, add, update } from '@/apis/system/dict';

export default {
	mixins: [DialogMixin],
	data() {
		return {
			fields: getFormFields(this),
			dataForm: {
				...dictForm,
			},
		};
	},
	computed: {
		isUpdate() {
			return !!this.dataForm.id;
		},
	},
	methods: {
		init(parent, data = {}) {
			this.dataForm = { ...dictForm, ...data };
			if (parent && parent.id) {
				this.dataForm.code = parent.code;
				this.dataForm.parentId = parent.id;
				this.dataForm.parentName = parent.dictValue;
			}
		},
		addChild(data) {
			this.dataForm.code = data.code;
			this.dataForm.parentId = data.id;
			this.dataForm.parentName = data.dictValue;
		},
		getDetail(id) {
			getDict(id).then(({ data }) => {
				this.dataForm = { ...dictForm, ...data };
			});
		},
		handleSubmit() {
			const { id, ...params } = this.dataForm;
			if (this.isUpdate) {
				params.id = id;
			}
			const pending = this.isUpdate ? update(params) : add(params);
			pending.then((res) => {
				this.visible = false;
				this.$emit('success');
				this.$message.success(res.msg);
			});
		},
	},
};
</script>

<style lang="scss" scoped></style>
