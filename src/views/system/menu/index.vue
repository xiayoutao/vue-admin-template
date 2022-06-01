<template>
	<div class="page-menu">
		<div ref="filterBox" class="filter-box">
			<x-filters :config="tableSearch" @change="getDataList"></x-filters>
		</div>
		<div ref="toolbarBox" class="toolbar-box">
			<el-button
				type="primary"
				icon="el-icon-plus"
				@click="handleAdd()"
				v-if="getBtnAuth('menu.add')"
			>
				新增
			</el-button>
			<el-button
				type="danger"
				icon="el-icon-delete"
				@click="handleDelete()"
				v-if="getBtnAuth('menu.delete')"
			>
				删除
			</el-button>
		</div>
		<el-table
			ref="table"
			class="menu-table"
			:data="dataList"
			row-key="id"
			border
			lazy
			:load="load"
			:height="tableHeight"
			@selection-change="handleSelectionChange"
		>
			<el-table-column type="selection" align="center"></el-table-column>
			<el-table-column type="index" align="center"></el-table-column>
			<el-table-column
				label="菜单名称"
				prop="name"
				width="200"
			></el-table-column>
			<el-table-column
				label="路由地址"
				prop="path"
				width="160"
			></el-table-column>
			<el-table-column
				label="菜单图标"
				prop="source"
				align="center"
				width="100"
			>
				<template slot-scope="scope">
					<span :class="scope.row.source"></span>
				</template>
			</el-table-column>
			<el-table-column
				label="菜单编号"
				prop="code"
				align="center"
				width="120"
			></el-table-column>
			<el-table-column
				label="菜单别名"
				prop="alias"
				align="center"
				width="120"
			></el-table-column>
			<el-table-column label="新窗口" prop="isOpen" width="100" align="center">
				<template slot-scope="scope">
					{{ scope.row.isOpen === 1 ? '否' : '是' }}
				</template>
			</el-table-column>
			<el-table-column
				label="菜单排序"
				prop="sort"
				width="100"
				align="center"
			></el-table-column>
			<el-table-column
				label="菜单备注"
				prop="remark"
				width="180"
				show-overflow-tooltip
			></el-table-column>
			<el-table-column label="操作" width="220" align="center" fixed="right">
				<template slot-scope="scope">
					<el-button
						type="primary"
						size="mini"
						@click="handleUpdate(scope.row)"
						v-if="getBtnAuth('menu.edit')"
					>
						编辑
					</el-button>
					<el-button
						type="danger"
						size="mini"
						@click="handleDelete(scope.row)"
						v-if="getBtnAuth('menu.delete')"
					>
						删除
					</el-button>
					<el-button
						type="warnging"
						size="mini"
						@click="handleAddSub(scope.row)"
						v-if="getBtnAuth('menu.add')"
					>
						新增子菜单
					</el-button>
				</template>
			</el-table-column>
		</el-table>
		<add-or-update
			ref="addOrUpdate"
			:show.sync="addOrUpdateVisible"
			@success="getChildList"
			@reload="reload"
		></add-or-update>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import AddOrUpdate from './dialog-add-update.vue';
import { getLazyList, remove } from '@/apis/system/menu';

export default {
	name: 'sysmenu',
	components: {
		AddOrUpdate,
	},
	data() {
		return {
			addOrUpdateVisible: false, // 新增编辑弹窗
			maps: new Map(),
			tableSearch: [
				{
					type: 'input',
					label: '菜单名称',
					key: 'name',
					width: '120px',
				},
				{
					type: 'input',
					label: '菜单编号',
					key: 'code',
					width: '120px',
				},
				{
					type: 'input',
					label: '菜单别名',
					key: 'alias',
					width: '120px',
				},
			],
			dataList: [],
			tableSelection: [],
			tableHeight: 0,
		};
	},
	computed: {
		...mapGetters(['pageHeight']),
	},
	created() {
		this.getDataList();
	},
	mounted() {
		this.$nextTick(() => {
			this.getTableHeight();
		});
	},
	methods: {
		async getDataList(params = {}) {
			const res = await getLazyList({
				...params,
				parentId: 0,
			});
			this.dataList = res.data;
		},
		async getChildList(parentId) {
			const res = await getLazyList({
				parentId,
			});
			this.dataList = res.data;
		},
		load(tree, treeNode, resolve) {
			this.maps.set(tree.CLASSIFICATIONOFDOCUMENTS_ID, {
				tree,
				treeNode,
				resolve,
			}); //将信息放入map
			getLazyList({
				parentId: tree.id,
			}).then(({ data }) => {
				resolve(data);
			});
		},
		// 每次增删改查都重新加载菜单
		reload(parentId) {
			const { tree, treeNode, resolve } = this.maps.get(parentId);
			this.$set(this.$refs.table.store.states.lazyTreeNodeMap, parentId, []); //清空子菜单
			this.getList(); //重新加载主菜单
			this.load(tree, treeNode, resolve); //重新加载子菜单
		},
		handleAdd() {
			this.addOrUpdateVisible = true;
			this.$nextTick(() => {
				this.$refs.addOrUpdate.init();
			});
		},
		handleAddSub(data) {
			this.addOrUpdateVisible = true;
			this.$nextTick(() => {
				this.$refs.addOrUpdate.addSub(data.id);
			});
		},
		handleUpdate(data) {
			this.addOrUpdateVisible = true;
			this.$nextTick(() => {
				this.$refs.addOrUpdate.init(data.id);
			});
		},
		handleDelete(data) {
			this.$confirm('删除菜单，是否继续？', this.confirmTitle, {
				confirmButtonText: this.confirmButtonText,
				cancelButtonText: this.cancelButtonText,
				customClass: this.confirmCustomClass,
				type: 'warning',
			}).then(() => {
				remove(data.id).then(() => {
					this.getDataList();
					this.$message({
						type: 'success',
						message: '删除成功',
					});
				});
			});
		},
		handleSelectionChange(selection) {
			this.tableSelection = selection;
		},
		getTableHeight() {
			this.$nextTick(() => {
				const filterBoxHeight = this.$refs.filterBox.clientHeight;
				const toolbarBoxHeight = this.$refs.toolbarBox.clientHeight;
				this.tableHeight =
					this.pageHeight - filterBoxHeight - toolbarBoxHeight - 32;
			});
		},
	},
};
</script>

<style lang="scss" scoped>
.menu-table {
	margin-top: 10px;
}
</style>
