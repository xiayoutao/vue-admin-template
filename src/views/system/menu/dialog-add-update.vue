<template>
	<x-dialog
		:title="`${isUpdate ? '修改' : '新增'}菜单`"
		:visible.sync="visible"
		width="880px"
		height="608px"
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
		<menu-icon
			:show.sync="menuIconVisible"
			@selected="handleSelectIcon"
		></menu-icon>
	</x-dialog>
</template>

<script>
import DialogMixin from '@/mixins/dialog';
import { getMainFormFields } from './formFields';
import MenuIcon from './dialog-menu-icon.vue';
import { add, update, getMenu } from '@/apis/system/menu';

export default {
	mixins: [DialogMixin],
	components: {
		MenuIcon,
	},
	data() {
		return {
			menuIconVisible: false,
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
					category: 1,
					sort: 1,
				};
			}
		},
		addSub(parentId) {
			this.dataForm.parentId = parentId;
			this.dataForm.sort = 1;
		},
		getDetail(id) {
			getMenu(id).then(({ data }) => {
				this.dataForm = {
					...data,
				};
			});
		},
		handleSubmit() {
			this.$refs.dataForm.validate((valid) => {
				if (valid) {
					// 表单验证通过
					const { id, ...params } = this.dataForm;
					if (this.isUpdate) {
						params.id = id;
					}
					const pending = this.isUpdate ? update(params) : add(params);
					pending.then(() => {
						this.visible = false;
						this.$emit('success', this.dataForm.parentId);
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
	watch: {
		'dataForm.category': {
			handler(val) {
				this.fields[5].rules[0].required = val === 1 && !this.dataForm.parentId;
				this.fields[2].rules[0].required = val === 1;
			},
			immediate: true,
		},
		'dataForm.parentId': {
			handler(val) {
				this.fields[5].rules[0].required = this.dataForm.category === 1 && !val;
			},
			immediate: true,
		},
	},
};
</script>

<style></style>
