<template>
	<x-dialog
		:title="`${isUpdate ? '修改' : '新增'}`"
		:visible.sync="visible"
		width="500px"
		height="400px"
	>
		<form-config
			ref="dataForm"
			v-model="dataForm"
			:fields="fields"
			:alone-rules="false"
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
				保存
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
			fields: getFormFields(this).filter((item) => item.prop !== 'dictKey'),
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
		init(id) {
			if (id) {
				this.getDetail(id);
			} else {
				this.dataForm = { ...dictForm, dictKey: '-1' };
			}
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
