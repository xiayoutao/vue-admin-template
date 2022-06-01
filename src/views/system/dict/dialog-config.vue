<template>
	<x-dialog
		:title="`【${parentForm.dictValue}】字典配置`"
		:visible.sync="visible"
		width="880px"
		height="606px"
		top="5vh"
	>
		<x-filters :config="tableSearch" @change="getDataList"></x-filters>
		<el-row style="padding: 0 0 10px; text-align: left">
			<el-button
				type="primary"
				class="btn-custom"
				icon="el-icon-plus"
				size="mini"
				@click="handleAdd()"
				v-if="getBtnAuth('dict.add')"
			>
				新增
			</el-button>
			<!-- <el-button type="error" class="btn-custom" icon="el-icon-plus" size="mini" :loading="addAndChangeLoading2" @click="toDelete()">删除</el-button> -->
		</el-row>
		<el-table
			border
			:data="childrenData"
			row-key="id"
			:tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
			@selection-change="handleSelectionChange"
		>
			<el-table-column
				type="selection"
				width="55"
				fixed="left"
			></el-table-column>
			<el-table-column
				prop="code"
				label="字典编号"
				width="120"
			></el-table-column>
			<el-table-column prop="dictValue" label="字典名称"></el-table-column>
			<el-table-column prop="dictKey" label="字典键值"></el-table-column>
			<el-table-column prop="sort" label="字典排序"></el-table-column>
			<el-table-column prop="isSealed" label="状态">
				<template slot-scope="scope">
					<span
						v-if="scope.row.isSealed == 1"
						style="color: rgb(245, 108, 108)"
					>
						封存
					</span>
					<span v-else>启用</span>
				</template>
			</el-table-column>
			<el-table-column label="操作" fixed="right">
				<template slot-scope="scope">
					<el-button
						type="primary"
						size="mini"
						@click="handleUpdate(scope.row)"
						v-if="getBtnAuth('dict.edit')"
					>
						改
					</el-button>
					<el-button
						type="danger"
						size="mini"
						@click="handleDelete(scope.row)"
						v-if="getBtnAuth('dict.delete')"
					>
						删
					</el-button>
				</template>
			</el-table-column>
		</el-table>
		<add-or-update-config
			ref="addOrUpdateConfig"
			:show.sync="addOrUpdateConfigVisible"
			@success="getDataList()"
		></add-or-update-config>
	</x-dialog>
</template>

<script>
import DialogMixin from '@/mixins/dialog';
import AddOrUpdateConfig from './dialog-add-update-config.vue';
import { getChildList, remove } from '@/apis/system/dict';

export default {
	mixins: [DialogMixin],
	components: {
		AddOrUpdateConfig,
	},
	data() {
		return {
			addOrUpdateConfigVisible: false,
			tableSearch: [
				{
					type: 'input',
					label: '字典编号',
					key: 'code',
					width: '130px',
				},
				{
					type: 'input',
					label: '字典名称',
					key: 'dictValue',
					width: '130px',
				},
			],
			tableSelection: [],
			childrenData: [],
			parentForm: {},
			dataForm: {
				parentId: '',
				code: '',
				dictValue: '',
			},
		};
	},
	methods: {
		init(data) {
			this.parentForm = { ...data };
			this.getDataList();
		},
		getDataList(params = {}) {
			getChildList({
				...params,
				parentId: this.parentForm.id,
			}).then(({ data }) => {
				this.childrenData = data || [];
				this.tableSelection = [];
			});
		},
		handleAdd() {
			this.addOrUpdateConfigVisible = true;
			this.$nextTick(() => {
				this.$refs.addOrUpdateConfig.init(this.parentForm);
			});
		},
		// 新增修改字典值
		handleUpdate(data) {
			this.addOrUpdateConfigVisible = true;
			this.$nextTick(() => {
				this.$refs.addOrUpdateConfig.init(this.parentForm, data);
			});
		},
		handleDelete(data) {
			this.$confirm(
				`删除【${data.dictValue}】字典，是否继续？`,
				this.confirmTitle,
				{
					confirmButtonText: this.confirmButtonText,
					cancelButtonText: this.cancelButtonText,
					customClass: this.confirmCustomClass,
					type: 'warning',
				},
			).then(() => {
				remove(data.id).then(() => {
					this.getDataList(true);
					this.$message({
						type: 'success',
						message: '删除成功',
					});
				});
			});
		},
		handleSelectionChange(val) {
			this.tableSelection = val;
		},
	},
};
</script>

<style lang="scss" scoped></style>
