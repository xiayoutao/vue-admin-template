<template>
	<div class="vue-table">
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
		<div class="table-wrapper" @click.stop>
			<el-table
				ref="plxTable"
				v-bind="$attrs"
				:data="dataList"
				border
				fit
				:highlight-current-row="
					getPropsByDefault('highlight-current-row', false)
				"
				:header-cell-class-name="headerCellClassName"
				:height="tableHeight"
				v-on="{
					...$listeners,
					'sort-change': handleTableSortChange,
					'filter-change': handleTableFilterChange,
					'header-click': handleClickTableHeader,
				}"
			>
				<template v-for="(item, index) in showColumns">
					<el-table-column
						v-bind="item"
						:key="item.type + index"
						:type="item.type === 'checkbox' ? 'selection' : item.type"
						:selectable="
							(row, index) =>
								isFunction(item.selectable)
									? item.selectable(row, index, item)
									: () => true
						"
						width="50px"
						v-if="['selection', 'index', 'checkbox'].includes(item.type)"
					/>
					<!-- 自定义 begin -->
					<el-table-column
						v-bind="item"
						:key="item.prop + index"
						:column-key="item.prop"
						v-else-if="isFunction(item.render)"
					>
						<el-table-column
							:key="subindex"
							v-bind="subitem"
							:column-key="subitem.prop"
							:fixed="false"
							:sortable="false"
							v-for="(subitem, subindex) in item.children || []"
						>
							<template slot="header" v-if="subitem.required">
								<span class="required">*</span>
								{{ subitem.label }}
							</template>
						</el-table-column>
						<template slot="header" v-if="item.required">
							<span class="required">*</span>
							{{ item.label }}
						</template>
						<template
							slot-scope="scope"
							v-if="(item.children || []).length === 0"
						>
							<cell-slot
								:index="scope.$index"
								:row="scope.row"
								:column="scope.column"
								:render="item.render"
							></cell-slot>
						</template>
					</el-table-column>
					<!-- 定义formatter格式化内容 -->
					<el-table-column
						v-bind="item"
						:key="item.prop + index"
						:column-key="item.prop"
						v-else-if="isFunction(item.formatter)"
					>
						<template slot="header" v-if="item.required">
							<span class="required">*</span>
							{{ item.label }}
						</template>
						<el-table-column
							:key="subindex"
							v-bind="subitem"
							:column-key="subitem.prop"
							:fixed="false"
							:sortable="false"
							v-for="(subitem, subindex) in item.children || []"
						>
							<template slot="header" v-if="subitem.required">
								<span class="required">*</span>
								{{ subitem.label }}
							</template>
						</el-table-column>
					</el-table-column>
					<!-- 自定义 end -->
					<el-table-column
						v-bind="item"
						:key="item.prop + index"
						:column-key="item.prop"
						v-else-if="!item.showType"
					>
						<template slot="header" v-if="item.required">
							<span class="required">*</span>
							{{ item.label }}
						</template>
						<el-table-column
							:key="subindex"
							v-bind="subitem"
							:column-key="subitem.prop"
							:fixed="false"
							:sortable="false"
							v-for="(subitem, subindex) in item.children || []"
						>
							<template slot="header" v-if="subitem.required">
								<span class="required">*</span>
								{{ subitem.label }}
							</template>
						</el-table-column>
					</el-table-column>
					<el-table-column
						:key="item.prop + index"
						v-bind="item"
						:column-key="item.prop"
						v-else
					>
						<template slot="header" v-if="item.required">
							<span class="required">*</span>
							{{ item.label }}
						</template>
						<el-table-column
							:key="subindex"
							v-bind="subitem"
							:column-key="subitem.prop"
							:fixed="false"
							:sortable="false"
							v-for="(subitem, subindex) in item.children || []"
						>
							<template slot="header" v-if="subitem.required">
								<span class="required">*</span>
								{{ subitem.label }}
							</template>
						</el-table-column>
						<template
							slot-scope="scope"
							v-if="(item.children || []).length === 0"
						>
							{{ formatCell(item, scope.row) }}
						</template>
					</el-table-column>
				</template>
			</el-table>
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

export default {
	mixins: [TableMixin],
	props: {
		data: {
			type: Array,
			default() {
				return [];
			},
		},
	},
	data() {
		return {
			tableType: 'element',
		};
	},
	computed: {
		dataList() {
			return this.data;
		},
	},
	mounted() {
		this.$nextTick(() => {
			this.init();
			this.handleColumnDrag();
		});
	},
	methods: {
		// 表格头部点击
		handleClickTableHeader(column, event) {
			if (column && column.sortable) {
				// 处理排序方式
				if (!column.order) {
					column.order = 'ascending';
				} else if (column.order === 'ascending') {
					column.order = 'descending';
				} else if (column.order === 'descending') {
					column.order = null;
				}

				// if (this.singleSort) {
				this.tableSort = {
					[column.property]: column.order,
				};
				// }
				if (this.$refs.plxTable) {
					this.$refs.plxTable.sort(column.property, column.order);
				}
			}

			const headerClick = this.$listeners['header-click'];
			if (this.isFunction(headerClick)) {
				headerClick(column, event);
			}
		},
		// 表格过滤值改变
		handleTableFilterChange(filters) {
			Object.keys(filters || {}).forEach((item) => {
				const column = this.columnsObj[item];
				if (!column) return;
				let filterData = filters[item].values;
				if (!column.filterMultiple) {
					filterData = filters[item][0];
				}
				this.$set(this.tableParams, item, filterData);
			});
		},
		// 表格列拖拽
		handleColumnDrag() {
			if (!this.drag) return;
			const wrapperTr = document.querySelector('.el-table__header-wrapper tr'); //获取dom节点
			this.sortable = Sortable.create(wrapperTr, {
				forceFallback: false,
				animation: 300,
				ghostClass: 'dragColbg',
				chosenClass: 'dragColbg',
				handle: '.table-column:not(.no-drag)',
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
	},
};
</script>

<style lang="scss" scoped>
@import './styles/element.scss';
</style>
