import { mapGetters } from 'vuex';
import CellSlot from '../components/cellSlot';
import DialogCustomTable from '../components/dialog-custom-table.vue';
import { formatTableColumn } from '../utils/util';
import { toFixed } from '@/utils/format';

export default {
	components: {
		CellSlot,
		DialogCustomTable,
	},
	props: {
		tid: String, // 表格ID
		version: {
			// 表格版本，用来判断列的隐藏、排序、固定等信息是否重置
			type: String,
			default: '1',
		},
		calcHeight: Boolean, // 是否计算表格高度
		columns: {
			type: Array,
			default() {
				return [];
			},
		},
		height: [Number, String],
		customButton: {
			// 是否自定义表格按钮
			type: Boolean,
			default: true,
		},
		drag: {
			// 是否可拖拽表格列
			type: Boolean,
			default: true,
		},
		// singleSort: {
		// 	// 是否只能一列进行排序
		// 	type: Boolean,
		// 	default: true,
		// },
	},
	data() {
		return {
			customTableVisible: false, // 自定义表格弹窗显示
			isSetFixedColumns: false,
			fixedColumns: [], // 固定的列
			hideColumns: [], // 隐藏的列
			sortColumns: [], // 列排序
			columnsObj: {}, // 根据列的prop值存储
			columnList: [], // 最终显示的列
			tableSelection: [], // 选择的数据
			tableParams: {}, // 表格过滤参数
			tableSort: {}, // 表格排序参数
			tableHeight: 0, // 表格高度
		};
	},
	computed: {
		...mapGetters(['pageHeight']),
		tableId() {
			return `${this.tid || this.$route.path}_${this.version}`;
		},
		showColumns() {
			return this.columnList.filter(
				(subitem) => this.hideColumns.indexOf(subitem.prop) < 0,
			);
		},
	},
	beforeDestroy() {
		if (this.sortable) {
			this.sortable.destroy();
		}
	},
	methods: {
		init() {
			const isSetFixedColumns =
				localStorage.getItem(`${this.tableId}_fixed_isSet`) || ''; // 是否设置过固定列
			const localFixed =
				localStorage.getItem(`${this.tableId}_fixed_columns`) || '';
			const localHide =
				localStorage.getItem(`${this.tableId}_hide_columns`) || '';
			const localSort =
				localStorage.getItem(`${this.tableId}_sort_columns`) || '';
			let fixedColumns = !localFixed ? [] : localFixed.split(',');
			let hideColumns = !localHide ? [] : localHide.split(',');
			let sortColumns = !localSort ? [] : localSort.split(',');
			let columnList = [];
			for (let i = 0, len = this.columns.length; i < len; i++) {
				const item = this.columns[i];
				const column = formatTableColumn(item, this.tableType);
				if (item.prop) {
					this.columnsObj[item.prop] = column;
				}
				if (
					!['operate', 'selection', 'index', 'checkbox'].includes(item.type)
				) {
					if (
						localFixed.length === 0 &&
						item.fixed === 'left' &&
						isSetFixedColumns !== '1'
					) {
						fixedColumns.push(item.prop);
					}
					if (item.hide && localHide.length === 0) {
						hideColumns.push(item.prop);
					}
				}
				columnList.push({ ...column });
			}
			this.isSetFixedColumns = isSetFixedColumns === '1';
			this.fixedColumns = fixedColumns;
			this.hideColumns = hideColumns;
			this.sortColumns = sortColumns;
			this.columnList = columnList.sort((prev, next) => {
				return (
					this.sortColumns.length === 0 ||
					this.sortColumns.indexOf(prev.prop) -
						this.sortColumns.indexOf(next.prop)
				);
			});
			this.callTableFn('reloadColumn', this.columnList);
		},
		getSelection() {
			return this.tableSelection;
		},
		setCustomTable() {
			this.customTableVisible = true;
		},
		// 表头单元格 className 回调
		headerCellClassName({ row, column, rowIndex, columnIndex }) {
			const headerCellClassName = this.$attrs['header-cell-class-name'];
			// if (!this.singleSort) {
			// 	Object.keys(this.tableSort).forEach((item) => {
			// 		if (item === column.property) {
			// 			column.order = this.tableSort[item];
			// 		}
			// 	});
			// }
			if (this.isFunction(headerCellClassName)) {
				return headerCellClassName({
					row,
					column,
					rowIndex,
					columnIndex,
				});
			} else if (typeof headerCellClassName === 'string') {
				return headerCellClassName;
			}
		},
		getSearchData(sort, params) {
			const _sort = {};
			const _params = JSON.parse(JSON.stringify(params));
			Object.keys(sort).forEach((item) => {
				const order = sort[item] || '';
				_sort[item] =
					order.indexOf('asc') >= 0
						? 'asc'
						: order.indexOf('desc') >= 0
						? 'desc'
						: null;
			});
			return {
				sort: _sort,
				params: _params,
			};
		},
		formatCell(item, row) {
			if (item.showType === 'amount') {
				return toFixed(row[item.prop], item.showDigit || 2);
			} else if (item.showType === 'number') {
				return toFixed(row[item.prop], item.showDigit || 0);
			} else if (item.showType === 'totalNumber') {
				return row[item.prop] ? parseFloat(row[item.prop]) : '';
			} else if (item.showType === 'colorNumber' && item.showDigit >= 0) {
				return toFixed(row[item.prop], item.showDigit);
			} else if (item.showType === 'select') {
				return (
					(
						(item.renderFormat || []).find(
							(rItem) => rItem.value == row[item.prop],
						) || {}
					).name || row[item.prop]
				);
			} else if (item.showType === 'radio') {
				return item.renderFormat.length === 2
					? item.renderFormat[0].value === row[item.prop]
						? item.renderFormat[0].name
						: item.renderFormat[1].name
					: row[item.prop];
			} else {
				return row[item.prop];
			}
		},
		// 获取单元格文字样式
		getCellTextStyle(data, column) {
			if (column.showType === 'colorNumber') {
				return {
					color: data[column.prop] < 0 ? column.showColor || '#F56C6C' : '',
				};
			}
			return {};
		},
		// 表格排序参数改变
		handleTableSortChange({ prop, order }) {
			this.$set(this.tableSort, prop, order);
		},
		handleTableCustom({ hideColumns, fixedColumns }) {
			this.hideColumns = hideColumns;
			this.fixedColumns = fixedColumns;
			this.doLayout(true);
			this.$nextTick(async () => {
				this.callTableFn('refreshColumn');
				await this.sleep(50);
				this.callTableFn('pagingScrollTopLeft', 0, 1); // fix: 修复虚拟表格去掉固定列样式问题
			});
		},
		// 获取表格参数
		getPropsByDefault(key, defaultValue) {
			return this.isUndefined(this.$attrs[key])
				? defaultValue
				: this.$attrs[key];
		},
		// 调用组件方法
		callTableFn(name) {
			const args = [].slice.call(arguments); // 转数组
			if (this.$refs.plxTable && this.isFunction(this.$refs.plxTable[name])) {
				this.$refs.plxTable[name].apply(this, args.slice(1, args.length));
			}
		},
		doLayout() {
			if (this.$refs.plxTable) {
				this.$refs.plxTable.doLayout();
			}
		},
	},
	watch: {
		tableParams: {
			handler(val) {
				const parmas = JSON.parse(JSON.stringify(val));
				this.$emit('on-params', parmas);
				this.$emit('update:params', parmas);
			},
			deep: true,
		},
		tableSort: {
			handler(val) {
				const sort = {};
				Object.keys(val).forEach((item) => {
					const order = val[item] || '';
					sort[item] =
						order.indexOf('asc') >= 0
							? 'asc'
							: order.indexOf('desc') >= 0
							? 'desc'
							: null;
				});
				this.$emit('on-sort', sort);
				this.$emit('update:sort', sort);
			},
			deep: true,
		},
		// 监听固定列改变
		fixedColumns: {
			handler(val) {
				if (val && val.length > 0) {
					localStorage.setItem(this.tableId + '_fixed_columns', val); // 缓存到本地
				} else {
					localStorage.removeItem(this.tableId + '_fixed_columns'); // 缓存到本地
				}
				let columnList = [];
				for (let i = 0, len = this.columns.length; i < len; i++) {
					const item = this.columns[i];
					columnList.push(formatTableColumn(item, this.tableType, val));
				}
				this.columnList = columnList.sort((prev, next) => {
					return (
						this.sortColumns.length === 0 ||
						this.sortColumns.indexOf(prev.prop) -
							this.sortColumns.indexOf(next.prop)
					);
				});
			},
			deep: true,
		},
		// 监听隐藏列改变
		hideColumns: {
			handler(val) {
				if (val && val.length > 0) {
					localStorage.setItem(this.tableId + '_hide_columns', val); // 缓存到本地
				} else {
					localStorage.removeItem(this.tableId + '_hide_columns'); // 缓存到本地
				}
				this.callTableFn('refreshColumn');
				this.doLayout();
			},
			deep: true,
		},
		// 监听列排序改变
		sortColumns: {
			handler(val) {
				if (val && val.length > 0) {
					localStorage.setItem(this.tableId + '_sort_columns', val); // 缓存到本地
				} else {
					localStorage.removeItem(this.tableId + '_sort_columns'); // 缓存到本地
				}
				this.callTableFn('refreshColumn');
				this.doLayout();
			},
			deep: true,
		},
		pageHeight: {
			handler(val) {
				if (!this.calcHeight) return;
				if (!val) {
					this.tableHeight = '';
					return;
				}
				this.$nextTick(() => {
					let searchHeight = 0;
					let toolbarHeight = 0;
					let paginationHeight = 0;
					if (this.$refs.searchBox) {
						searchHeight = this.$refs.searchBox.clientHeight || 0;
					}
					if (this.$refs.toolbarBox) {
						toolbarHeight = this.$refs.toolbarBox.clientHeight || 0;
					}
					if (this.$refs.paginationBox) {
						paginationHeight = this.$refs.paginationBox.clientHeight || 0;
					}
					this.tableHeight =
						val - searchHeight - toolbarHeight - paginationHeight - 30;
				});
			},
			immediate: true,
		},
		height: {
			handler(val) {
				if (this.calcHeight) return;
				// this.tableHeight = val;
				if (!val) {
					this.tableHeight = '';
					return;
				}
				this.$nextTick(() => {
					let searchHeight = 0;
					let toolbarHeight = 0;
					let paginationHeight = 0;
					if (this.$refs.searchBox) {
						searchHeight = this.$refs.searchBox.clientHeight || 0;
					}
					if (this.$refs.toolbarBox) {
						toolbarHeight = this.$refs.toolbarBox.clientHeight || 0;
					}
					if (this.$refs.paginationBox) {
						paginationHeight = this.$refs.paginationBox.clientHeight || 0;
					}
					this.tableHeight =
						val - searchHeight - toolbarHeight - paginationHeight - 30;
				});
			},
			immediate: true,
		},
	},
};
