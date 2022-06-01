import { isUndefined, isFunction } from 'lodash';
import { isDeFined } from '@/utils/types';

/**
 * 列信息格式化
 * @param {*} item 传入的列数据
 * @param {*} tableType 表格类型，virtual虚拟表格，element饿了么表格，simple原生表格
 * @param {*} fixedKeys 固定列
 * @returns
 */
export function formatTableColumn(item, tableType, fixedKeys = []) {
	let fixed = false;
	if (item.type === 'operate') {
		fixed = 'right';
	} else if (['selection', 'index', 'expand', 'checkbox'].includes(item.type)) {
		fixed = 'left';
	}
	if (fixedKeys.indexOf(item.prop) >= 0) {
		fixed = 'left';
	} else {
		fixed = item.fixed;
	}

	const tooltip = isDeFined(item.tooltip)
		? item.tooltip
		: isFunction(item.render)
		? false
		: true;

	const isShowNumber = [
		'number',
		'colorNumber',
		'totalNumber',
		'amount',
	].includes(item.showType);

	function virtualTableFilter({ option, row }) {
		return row[item.prop].indexOf(option.data) >= 0;
	}
	function elementTableFilter(value, row, column) {
		return row[column.property].indexOf(value) >= 0;
	}

	const filterMethod = isFunction(item['filter-method'])
		? item['filter-method']
		: tableType === 'virtual'
		? virtualTableFilter
		: tableType === 'element' && (item.filters || []).length > 0
		? elementTableFilter
		: null;

	return {
		...item,
		sortable: item.sortable, // bugfix: 2021-12-25 如果开启表格内过滤则不允许排序
		fixed,
		minWidth:
			isUndefined(item.width) && isUndefined(item.maxWidth)
				? isUndefined(item.minWidth)
					? 100
					: item.minWidth
				: 100,
		// 表头水平对齐方式，优先级 headerAlign、align。都没设置则默认居中
		headerAlign: isUndefined(item.headerAlign)
			? isUndefined(item.align)
				? 'center'
				: item.align
			: item.headerAlign,
		align: isShowNumber
			? 'right'
			: isUndefined(item.align)
			? 'center'
			: item.align,
		'show-overflow-tooltip': tooltip,
		tooltip: tooltip,
		prop:
			item.type === 'operate' ? `operate${new Date().getTime()}` : item.prop,
		'class-name': `table-column ${
			['selection', 'index'].includes(item.type) || item.fixed
				? 'no-drag'
				: 'col-drag'
		}`,
		resizable: isUndefined(item.resizable) ? true : Boolean(item.resizable),
		'filter-method': filterMethod,
		filters:
			(item.filters || []).length === 0
				? null
				: (item.filters || []).map((filter) => {
						if (tableType === 'virtual') {
							return {
								...filter,
							};
						} else {
							return {
								text: filter.label,
								value: filter.value,
							};
						}
				  }),
	};
}
