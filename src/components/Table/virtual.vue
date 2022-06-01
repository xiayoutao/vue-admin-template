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
			<ux-grid
				ref="plxTable"
				v-bind="$attrs"
				border
				use-virtual
				column-key
				widthResize
				:sortConfig="{ trigger: 'cell', orders: ['asc', 'desc', null] }"
				:checkboxConfig="{
					checkMethod: getPropsByDefault('selectable', () => true),
					highlight: getPropsByDefault('highlight', true),
				}"
				:highlight-current-row="
					getPropsByDefault('highlight-current-row', false)
				"
				:data-changes-scroll-top="
					getPropsByDefault('data-changes-scroll-top', false)
				"
				:fixed-columns-roll="getPropsByDefault('fixed-columns-roll', true)"
				:show-overflow="getPropsByDefault('show-overflow', 'tooltip')"
				:beautify-table="false"
				:height="tableHeight"
				v-on="{
					...$listeners,
					'sort-change': handleTableSortChange,
					'filter-change': handleTableFilterChange,
				}"
			>
				<template v-for="(item, index) in showColumns">
					<ux-table-column
						:key="item.type + index"
						v-bind="item"
						:type="item.type === 'selection' ? 'checkbox' : item.type"
						width="48px"
						v-if="['selection', 'index', 'checkbox'].includes(item.type)"
					/>
					<!-- 自定义 begin -->
					<ux-table-column
						v-bind="item"
						:key="item.prop + index"
						:column-key="item.prop"
						:field="item.prop"
						:title="item.label"
						v-else-if="isFunction(item.render)"
					>
						<template slot-scope="scope">
							<cell-slot
								:index="scope.$index"
								:row="scope.row"
								:column="scope.column"
								:render="item.render"
							></cell-slot>
						</template>
						<template
							v-slot:filter="{ $panel, column }"
							v-if="item.filterCustom"
						>
							<!--column.filters就是去渲染的这个东西:filters="[{ data: '' }]，然后v-model绑定到了这个data属性啦-->
							<el-input
								v-for="(option, index) in column.filters"
								:key="index"
								v-model="option.data"
								@input="$panel.changeOption($event, option.data, option)"
							/>
						</template>
					</ux-table-column>
					<!-- 定义formatter格式化内容 -->
					<ux-table-column
						v-bind="item"
						:key="item.prop + index"
						:column-key="item.prop"
						:field="item.prop"
						:title="item.label"
						v-else-if="isFunction(item.formatter)"
					>
						<template
							v-slot:filter="{ $panel, column }"
							v-if="item.filterCustom"
						>
							<!--column.filters就是去渲染的这个东西:filters="[{ data: '' }]，然后v-model绑定到了这个data属性啦-->
							<el-input
								v-for="(option, index) in column.filters"
								:key="index"
								v-model="option.data"
								@input="$panel.changeOption($event, option.data, option)"
							/>
						</template>
					</ux-table-column>
					<!-- 自定义 end -->
					<ux-table-column
						v-bind="item"
						:key="item.prop + index"
						:column-key="item.prop"
						:field="item.prop"
						:title="item.label"
						v-else-if="!item.showType"
					>
						<template
							v-slot:filter="{ $panel, column }"
							v-if="item.filterCustom"
						>
							<!--column.filters就是去渲染的这个东西:filters="[{ data: '' }]，然后v-model绑定到了这个data属性啦-->
							<el-input
								v-for="(option, index) in column.filters"
								:key="index"
								v-model="option.data"
								@keydown.native.enter="
									() => {
										handleSetFilter($panel, option, item);
									}
								"
								@input="$panel.changeOption($event, option.data, option)"
							/>
						</template>
					</ux-table-column>
					<ux-table-column
						v-bind="item"
						:key="item.prop + index"
						:column-key="item.prop"
						:field="item.prop"
						:title="item.label"
						v-else
					>
						<template
							v-slot:filter="{ $panel, column }"
							v-if="item.filterCustom"
						>
							<!--column.filters就是去渲染的这个东西:filters="[{ data: '' }]，然后v-model绑定到了这个data属性啦-->
							<el-input
								v-for="(option, index) in column.filters"
								:key="index"
								v-model="option.data"
								@keydown.native.enter="
									() => {
										handleSetFilter($panel, option, item);
									}
								"
								@input="$panel.changeOption($event, option.data, option)"
							/>
						</template>
						<template slot-scope="scope">
							{{ formatCell(item, scope.row) }}
						</template>
					</ux-table-column>
				</template>
			</ux-grid>
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
		datas: {
			type: Array,
			default() {
				return [];
			},
		},
	},
	data() {
		return {
			tableType: 'virtual',
		};
	},
	mounted() {
		this.handleColumnDrag();
		this.$nextTick(() => {
			this.init();
			this.reloadData(this.datas);
		});
	},
	methods: {
		// 加载数据
		reloadData(data) {
			if (this.$refs.plxTable) {
				this.$refs.plxTable.reloadData(data);
			}
			if (this.isFunction(this.$listeners['selection-change'])) {
				this.$listeners['selection-change']([]);
			}
		},
		handleSetFilter($panel, option, item) {
			const plxTable = this.$refs.plxTable;
			// 回车执行筛选
			const column = plxTable.getColumnByField(item.prop);
			plxTable.setFilter(column, [
				{ value: option.data, data: option.data, checked: true },
			]);
			this.$nextTick(() => {
				$panel.confirmFilter();
			});
		},
		// 表格过滤值改变
		handleTableFilterChange(event) {
			const { filters } = event;
			filters.forEach((item) => {
				const column = this.columnsObj[item.property];
				if (!column) return;
				let filterData = this.isUndefined(item.datas[0])
					? item.values
					: item.datas;
				if (!column.filterMultiple) {
					filterData = filterData[0];
				}
				this.$set(this.tableParams, item.property, filterData);
			});
		},
		// 表格头部点击
		handleClickTableHeader(column, event) {
			if (column && column.sortable) {
				const order = this.isFunction(this.handleFilterMethod)
					? this.handleFilterMethod(column.order)
					: column.order;

				// if (this.singleSort) {
				this.tableSort = {
					[column.property]: order,
				};
				// }
				if (this.$refs.plxTable) {
					this.$refs.plxTable.sort(column.property, order);
				}
			}

			const headerClick = this.$listeners['header-click'];
			if (this.isFunction(headerClick)) {
				headerClick(column, event);
			}
		},
		// 表格列拖拽
		handleColumnDrag() {
			if (!this.drag) return;
			let plxTable = this.$refs.plxTable;
			const wrapperTr = plxTable.$el.querySelector(
				'.body--wrapper .elx-table--header .elx-header--row',
			); //获取dom节点
			this.sortable = Sortable.create(wrapperTr, {
				animation: 300,
				ghostClass: 'dragColbg',
				chosenClass: 'dragColbg',
				handle: '.elx-header--column:not(.col--fixed)',
				onEnd: ({ item, newIndex, oldIndex }) => {
					// fullColumn: 全量表头列   tableColumn: 当前渲染中的表头列
					let { fullColumn, tableColumn } = plxTable.getTableColumn();
					let targetThElem = item;
					let wrapperElem = targetThElem.parentNode;
					let newColumn = fullColumn[newIndex];
					if (newColumn.fixed) {
						// 错误的移动
						if (newIndex > oldIndex) {
							wrapperElem.insertBefore(
								targetThElem,
								wrapperElem.children[oldIndex],
							);
						} else {
							wrapperElem.insertBefore(
								wrapperElem.children[oldIndex],
								targetThElem,
							);
						}
						return this.$message({
							type: 'error',
							message: '固定列不允许拖动！',
						});
					}
					// 转换真实索引
					let oldColumnIndex = plxTable.getColumnIndex(tableColumn[oldIndex]);
					let newColumnIndex = plxTable.getColumnIndex(tableColumn[newIndex]);
					// 移动到目标列
					let currRow = fullColumn.splice(oldColumnIndex, 1)[0];
					fullColumn.splice(newColumnIndex, 0, currRow);
					plxTable.loadColumn(fullColumn); // 加载列

					const columnList = this.columnList;
					const oldKey = fullColumn[oldColumnIndex].property;
					const newKey = fullColumn[newColumnIndex].property;

					const realOldIndex = columnList.findIndex(
						(item) => item.prop === oldKey,
					);
					const realNewIndex = columnList.findIndex(
						(item) => item.prop === newKey,
					);
					const currColumn = columnList.splice(realOldIndex, 1)[0];
					columnList.splice(realNewIndex, 0, currColumn);

					// todo 拿到最新的列排序
					const sortColumns = [];
					columnList.forEach((item) => {
						if (item.prop) {
							sortColumns.push(item.prop);
						}
					});
					this.columnList = columnList;
					this.sortColumns = sortColumns;
				},
			});
		},
	},
	watch: {
		datas: {
			handler(val) {
				this.reloadData(val);
			},
			deep: true,
		},
	},
};
</script>

<style lang="scss" scoped>
@import './styles/virtual.scss';
</style>
