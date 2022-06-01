<template>
	<el-select
		ref="main"
		class="form-input"
		:value="labelShow"
		:loading-text="getPropsByDefault('loading-text', '努力加载中...')"
		:multiple="multiple"
		:multiple-limit="getPropsByDefault('multiple-limit', 1)"
		:collapse-tags="getPropsByDefault('collapse-tags', true)"
		:filterable="getPropsByDefault('filterable', false)"
		:clearable="getPropsByDefault('clearable', false)"
		:placeholder="getPropsByDefault('placeholder', '请选择')"
		:popper-class="getPropsByDefault('popper-class', '')"
		:popper-append-to-body="getPropsByDefault('popper-append-to-body', true)"
		:disabled="getPropsByDefault('disabled', false)"
		:size="getPropsByDefault('size', 'mini')"
		v-on="$listeners"
		@remove-tag="handleRemoveTag"
		@clear="handleClear"
		@click.native="initScroll"
		style="width: 100%"
	>
		<div v-if="filter" style="margin: 5px 0 0 0; padding: 0 10px">
			<el-input
				size="mini"
				:placeholder="filterText"
				v-model="filterValue"
			></el-input>
		</div>
		<el-option style="height: auto; padding: 0" :value="[]">
			<el-tree
				ref="tree"
				:data="treeList"
				:lazy="lazy"
				:load="handleTreeLoad"
				:node-key="nodeKey"
				:check-strictly="getPropsByDefault('check-strictly', false)"
				:show-checkbox="multiple"
				:props="treeProps"
				:default-expand-all="getPropsByDefault('default-expand-all', false)"
				:expand-on-click-node="getPropsByDefault('expand-on-click-node', true)"
				:highlight-current="!multiple"
				:current-node-key="multiple ? '' : text"
				:filter-node-method="filterNode"
				@check="handleNodeCheck"
				@node-click="handleNodeClick"
				:style="{ 'min-height': minHeight }"
			></el-tree>
		</el-option>
	</el-select>
</template>

<script>
import { cloneDeep, isNull } from 'lodash';

export default {
	props: {
		value: [String, Number, Array],
		list: Array,
		dataType: String,
		dataSource: String,
		dataLevel: {
			type: Number,
			default: 3,
		},
		minHeight: {
			type: String,
			default: '320px',
		},
		multiple: {
			type: Boolean,
			default: false,
		},
		lazy: {
			type: Boolean,
			default: false,
		},
		filter: {
			type: Boolean,
			default: true,
		},
		filterText: {
			type: String,
			default: '输入关键字进行过滤',
		},
		parent: {
			// 是否可以选择父级
			type: Boolean,
			default: true,
		},
		treeProps: {
			type: Object,
			default() {
				return {
					children: 'children',
					label: 'title',
				};
			},
		},
		nodeKey: {
			type: String,
			default: 'id',
		},
		leafOnly: {
			// 多选时，是否只能选中叶子节点
			type: Boolean,
			default: true,
		},
		treeLoad: Function,
		checked: Function,
		nodeClick: Function,
	},
	data() {
		return {
			loading: false,
			node: [],
			filterValue: '',
			text: '',
			treeList: [],
			typeformat: false,
		};
	},
	computed: {
		labelShow() {
			let result = [];
			let list = cloneDeep(this.node);
			if (this.typeformat) {
				result = list.map((ele) => this.getLabelText(ele));
			} else {
				result = list.map((ele) => ele[this.labelKey]);
			}
			if (this.multiple) {
				return result;
			} else {
				return result.join('');
			}
		},
		valueKey() {
			return this.treeProps.value || 'id';
		},
		labelKey() {
			return this.treeProps.label || 'title';
		},
		childrenKey() {
			return this.treeProps.children || 'children';
		},
		optionData() {
			if (
				this.isDeFined(this.dataType) &&
				this.dataType !== 'region' &&
				!this.dataSource
			) {
				return [];
			}
			if (this.dataType === 'dict') {
				return cloneDeep(
					this.$store.getters.getDictByCode(this.dataSource) || [],
				);
			} else if (this.dataType === 'store') {
				return cloneDeep(this.$store.getters[this.dataSource] || []);
			} else if (this.dataType === 'region') {
				return this.$store.getters.getRegion(this.dataLevel);
			} else {
				return cloneDeep(this.list);
			}
		},
	},
	watch: {
		value: {
			handler(val) {
				this.text = val;
			},
			deep: true,
			immediate: true,
		},
		text: {
			handler(val) {
				this.$emit('change', val);
				this.$emit('input', val);
				if (isNull(val)) this.clearHandle();
				this.init();
			},
			deep: true,
		},
		labelShow: {
			handler(val) {
				this.$emit('show-change', val);
			},
			deep: true,
		},
		list: {
			handler() {
				this.getList();
			},
			deep: true,
		},
		treeList: {
			handler() {
				this.init();
			},
			immediate: true,
		},
		filterValue(val) {
			this.$refs.tree.filter(val);
		},
		optionData: {
			handler() {
				this.getList();
			},
			deep: true,
			immediate: true,
		},
	},
	methods: {
		init() {
			this.$nextTick(() => {
				this.node = [];
				if (this.multiple) {
					let list = this.$refs.tree.getCheckedNodes(this.leafOnly, false);
					list.forEach((ele) => {
						this.node.push(ele);
					});
				} else {
					let node = this.$refs.tree.getNode(this.text);
					if (node) {
						let data = node.data;
						this.$refs.tree.setCurrentKey(data[this.valueKey]);
						this.node.push(data);
					}
				}
				// 是否禁止父类
				this.disabledParentNode(this.treeList, this.parent);
			});
		},
		// 初始化滚动条
		initScroll(event) {
			setTimeout(() => {
				this.$nextTick(() => {
					let scrollBar = document.querySelectorAll(
						'.el-scrollbar .el-select-dropdown__wrap',
					);
					scrollBar.forEach((ele) => {
						ele.scrollTop = 0;
					});
				});
			}, 0);
			if (this.isFunction(this.$listeners['click'])) {
				this.$listeners['click']({
					event,
					value: this.text,
				});
			}
		},
		disabledParentNode(list = [], parent) {
			list.forEach((ele) => {
				const children = ele[this.childrenKey];
				if (this.isDeFined(children)) {
					if (!parent) {
						ele.disabled = true;
					}
					this.disabledParentNode(children, parent);
				}
			});
		},
		clearHandle() {
			this.filterValue = '';
			this.$refs.tree.setCurrentKey(null);
			this.$refs.tree.setCheckedKeys([]);
		},
		getLabelText(item) {
			if (isNull(item)) return '';
			if (typeof this.typeformat === 'function') {
				return this.typeformat(item, this.labelKey, this.valueKey);
			}
			return item[this.labelKey];
		},
		handleNodeCheck(
			checkedNodes,
			checkedKeys,
			halfCheckedNodes,
			halfCheckedKeys,
		) {
			this.text = [];
			const list = this.$refs.tree.getCheckedNodes(this.leafOnly, false);
			list.forEach((node) => this.text.push(node[this.valueKey]));
			if (typeof this.checked === 'function')
				this.checked(
					checkedNodes,
					checkedKeys,
					halfCheckedNodes,
					halfCheckedKeys,
				);
		},
		handleClear() {
			if (this.multiple) {
				this.text = [];
			} else {
				this.text = '';
			}
			this.node = [];
			if (this.isFunction(this.$listeners['clear'])) {
				this.$listeners['clear']();
			}
		},
		handleRemoveTag(tag) {
			const index = this.labelShow.indexOf(tag);
			const id = this.text[index];
			this.text.splice(index, 1);
			this.$refs.tree.setChecked(id, false);
			if (this.isFunction(this.$listeners['remove-tag'])) {
				this.$listeners['remove-tag'](tag);
			}
		},
		handleTreeLoad(node, resolve) {
			let callback = (list) => {
				let findDic = (list, value, children) => {
					list.forEach((ele) => {
						if (ele[this.valueKey] == value) {
							ele[this.childrenKey] = children;
						} else if (ele[this.childrenKey]) {
							findDic(ele[this.childrenKey]);
						}
					});
				};
				findDic(this.netDic, node.key, list);
				resolve(list);
			};
			if (this.isFunction(this.treeLoad)) {
				this.treeLoad(node, callback);
			}
		},
		filterNode(value, data) {
			if (!value) return true;
			return (
				data[this.labelKey].toLowerCase().indexOf(value.toLowerCase()) !== -1
			);
		},
		handleNodeClick(data, node, nodeComp) {
			if (data.disabled) return;
			if (typeof this.nodeClick === 'function')
				this.nodeClick(data, node, nodeComp);
			if (this.multiple) return;
			if (!this.isDeFined(data[this.childrenKey]) || this.parent) {
				this.text = data[this.valueKey];
				this.$refs.main.blur();
			}
		},
		getList() {
			this.treeList = cloneDeep(this.optionData);
		},
		// 获取参数
		getPropsByDefault(key, defaultValue) {
			return this.isUndefined(this.$attrs[key])
				? defaultValue
				: this.$attrs[key];
		},
	},
};
</script>
