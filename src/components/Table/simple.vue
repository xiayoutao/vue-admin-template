<template>
	<div class="simple-table">
		<div ref="searchBox" class="search-wrapper" v-if="$slots && $slots.search">
			<slot name="search"></slot>
		</div>
		<div
			ref="toolbarBox"
			class="toolbar-wrapper"
			v-if="($slots && $slots.toolbar) || customButton"
		>
			<div class="tools-l">
				<slot name="toolbar"></slot>
			</div>
			<div class="tools-r" v-if="customButton">
				<div class="custom-table" @click="setCustomTable()">
					<span class="el-icon-setting"></span>
					自定义列表
				</div>
			</div>
		</div>
		<div class="table-wrapper" :class="{ 'is-yellow': isYellow }" @click.stop>
			<div class="table-header">
				<table cellspacing="0" cellpadding="0">
					<table-colgroup
						:columns="showColumns"
						:gutter="hasGutter"
					></table-colgroup>
					<thead>
						<tr>
							<th
								v-for="(column, index) in showColumns"
								:key="column.prop + index"
								:class="{ 'no-drag': column.fixed }"
							>
								<div
									class="cell"
									:class="{
										'is-center': column.headerAlign === 'center',
										'is-right': column.headerAlign === 'right',
									}"
								>
									<template v-if="column.type === 'selection'">
										<el-checkbox
											v-model="checkAllFlag"
											:indeterminate="indeterminate"
											@change="checkAll"
										></el-checkbox>
									</template>
									<template v-else>
										<span class="required" v-if="column.required">*</span>
										{{ column.label }}
									</template>
								</div>
							</th>
							<th class="col--gutter" v-if="hasGutter"></th>
						</tr>
					</thead>
				</table>
			</div>
			<div
				ref="tableBoby"
				class="table-body"
				:style="{
					height: `${tableHeight - 35}px`,
				}"
			>
				<table cellspacing="0" cellpadding="0">
					<table-colgroup :columns="showColumns"></table-colgroup>
					<tbody>
						<tr
							v-for="(item, index) in dataList"
							:key="index"
							:class="{ 'current-row': currentRowIndex === index }"
							@click="onTableTrClick(item, index)"
						>
							<template v-for="(column, idx) in showColumns">
								<td :key="column.prop + idx">
									<div
										class="cell"
										:class="{
											'is-center': column.align === 'center',
											'is-right': column.align === 'right',
											'is-overflow': column.tooltip,
										}"
									>
										<template v-if="column.type === 'selection'">
											<el-checkbox
												v-model="checkFlag[index]"
												@change="check($event, item, index)"
											></el-checkbox>
										</template>
										<cell-slot
											:index="idx"
											:row="item"
											:column="column"
											:render="column.render"
											v-else-if="isFunction(column.render)"
										></cell-slot>
										<template v-else>
											{{ formatCell(column, item) }}
										</template>
									</div>
								</td>
							</template>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
		<div
			ref="paginationBox"
			class="pagination-wrapper"
			v-if="$slots && $slots.pagination"
		>
			<slot name="pagination"></slot>
		</div>
		<dialog-custom-table
			ref="customTable"
			:show.sync="customTableVisible"
			:columns="columnList"
			:fixed-columns.sync="fixedColumns"
			:hide-columns.sync="hideColumns"
			:sort-columns.sync="sortColumns"
			@change="handleTableCustom"
		></dialog-custom-table>
	</div>
</template>

<script>
import TableMixin from './mixins/table';
import Sortable from 'sortablejs/modular/sortable.core.esm.js';
import TableColgroup from './components/TableColgroup';

export default {
	mixins: [TableMixin],
	components: {
		TableColgroup,
	},
	props: {
		isYellow: Boolean,
		data: {
			type: Array,
			default() {
				return [];
			},
		},
	},
	data() {
		return {
			tableType: 'simple',
			hasGutter: false, // 表格body部分是否有滚动条，需要再header部分预留出17像素
			indeterminate: false, // checkAllFlag为false，indeterminate为true显示半选状态
			checkAllFlag: false, // 全选状态
			checkFlag: [], // 保存每条记录选中状态
			currentRow: {},
			currentRowIndex: -1,
		};
	},
	computed: {
		dataList() {
			return this.data;
		},
	},
	watch: {
		checkFlag: {
			handler(val) {
				const selected = val.filter((flag) => !!flag);
				if (selected.length === this.dataList.length) {
					this.checkAllFlag = true;
				} else if (selected.length > 0) {
					this.checkAllFlag = false;
					this.indeterminate = true;
				} else {
					this.checkAllFlag = false;
					this.indeterminate = false;
				}
			},
			deep: true,
		},
		tableSelection: {
			handler(val) {
				this.$emit('selection-change', val);
			},
			deep: true,
		},
	},
	created() {
		this.checkAllFlag = false;
		this.checkFlag = [];
		this.indeterminate = false;
		this.currentRow = {};
		this.currentRowIndex = -1;
		this.tableSelection = [];
	},
	mounted() {
		this.$nextTick(() => {
			this.init();
			this.checkGutter();
			this.handleColumnDrag();
		});
	},
	methods: {
		// 全选
		checkAll(flag) {
			if (flag) {
				this.indeterminate = false;
				this.checkFlag = new Array(this.dataList.length)
					.fill(0)
					.map(() => true);
				this.tableSelection = JSON.parse(JSON.stringify(this.dataList));
			} else {
				this.indeterminate = false;
				this.checkFlag = [];
				this.tableSelection = [];
			}
			this.checkAllFlag = flag;
			this.$emit('select-all', this.tableSelection);
		},
		// 单条选择
		check(flag, row, index) {
			this.checkFlag[index] = flag;
			this.tableSelection = this.dataList.filter(
				(item, index) => this.checkFlag[index],
			);
			this.$emit('select', this.tableSelection, row);
		},
		onTableTrClick(row, index) {
			this.$emit('current-change', { ...row }, { ...this.currentRow });
			this.currentRow = { ...row };
			this.currentRowIndex = index;
		},
		// 判断是否有滚动条
		async checkGutter() {
			await this.sleep(50);
			const tableBoby = this.$refs.tableBoby;
			this.hasGutter = tableBoby.scrollHeight > tableBoby.clientHeight;
		},
		// 表格列拖拽
		handleColumnDrag() {
			if (!this.drag) return;
			const wrapperTr = document.querySelector('.simple-table thead tr'); //获取dom节点
			this.sortable = Sortable.create(wrapperTr, {
				forceFallback: false,
				animation: 300,
				ghostClass: 'dragColbg',
				chosenClass: 'dragColbg',
				handle: 'th:not(.no-drag)',
				onEnd: (event) => {
					const { oldIndex, newIndex } = event;
					if (newIndex === oldIndex) {
						return;
					}
					const columnList = this.columnList;
					const oldColumn = this.showColumns[oldIndex]; // 旧列数据
					const newColumn = this.showColumns[newIndex]; // 新列数据
					const realOldIndex = columnList.findIndex(
						(item) => item.prop === oldColumn.prop,
					); // 实际上的旧索引
					const realNewIndex = columnList.findIndex(
						(item) => item.prop === newColumn.prop,
					); // 实际上的新索引
					const currRow = columnList.splice(realOldIndex, 1)[0];
					columnList.splice(realNewIndex, 0, currRow); // 替换新旧位置

					// todo 拿到最新的列排序
					const sortColumns = [];
					columnList.forEach((item) => {
						if (item.prop) {
							sortColumns.push(item.prop);
						}
					});
					this.columnList = columnList;
					this.sortColumns = sortColumns;
					this.doLayout();
				},
			});
		},
		doLayout() {
			this.checkGutter();
		},
	},
};
</script>

<style lang="scss" scoped>
@import './styles/simple.scss';
</style>
