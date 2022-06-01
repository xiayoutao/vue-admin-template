<template>
	<x-dialog
		title="弹窗表单"
		width="880px"
		height="608px"
		:visible.sync="visible"
	>
		<div class="tabs-navs">
			<span
				class="tab-view"
				:class="{ active: current === 0 }"
				@click="current = 0"
			>
				字段显示/隐藏
			</span>
			<span
				class="tab-view"
				:class="{ active: current === 1 }"
				@click="current = 1"
			>
				字段固定
			</span>
		</div>
		<div class="keys-show" key="show" v-show="current === 0">
			<el-checkbox-group v-model="showKeys">
				<el-checkbox
					:value="item.prop"
					:label="item.prop"
					v-for="(item, index) in columnList"
					:key="index"
				>
					{{ item.label }}
				</el-checkbox>
			</el-checkbox-group>
		</div>
		<div class="keys-fixed" key="fixed" v-show="current === 1">
			<el-checkbox-group v-model="fixedKeys">
				<el-checkbox
					:value="item.prop"
					:label="item.prop"
					v-for="(item, index) in columnList"
					:key="index"
				>
					{{ item.label }}
				</el-checkbox>
			</el-checkbox-group>
		</div>
		<template #footer>
			<el-button type="primary" icon="el-icon-check" @click="handleSubmit()">
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
	</x-dialog>
</template>

<script>
import DialogMixin from '@/mixins/dialog';

export default {
	mixins: [DialogMixin],
	props: {
		columns: {
			type: Array,
			default() {
				return [];
			},
		},
		fixedColumns: {
			type: Array,
			default() {
				return [];
			},
		},
		hideColumns: {
			type: Array,
			default() {
				return [];
			},
		},
		sortColumns: {
			type: Array,
			default() {
				return [];
			},
		},
	},
	data() {
		return {
			current: 0,
			columnList: [],
			showKeys: [], // 显示的字段
			fixedKeys: [], // 固定的字段
		};
	},
	computed: {
		columnKeys() {
			return this.columnList.map((item) => item.prop);
		},
	},
	methods: {
		handleSubmit() {
			const hideKeys = this.columnKeys.filter(
				(item) => this.showKeys.indexOf(item) < 0,
			);
			this.$emit('change', {
				hideColumns: hideKeys,
				fixedColumns: this.fixedKeys,
			});
			this.visible = false;
		},
		handleReset() {},
	},
	watch: {
		show(val) {
			this.visible = val;
			if (val) {
				let showKeys = [];
				let fixedKeys = [];
				let columnList = [];
				for (let i = 0, len = this.columns.length; i < len; i++) {
					const item = this.columns[i];
					if (item.prop) {
						columnList.push({ ...item });

						if (!this.hideColumns.includes(item.prop)) {
							showKeys.push(item.prop);
						}
						if (this.fixedColumns.includes(item.prop)) {
							fixedKeys.push(item.prop);
						}
					}
				}
				this.columnList = columnList.sort((prev, next) => {
					return (
						this.sortColumns.length === 0 ||
						this.sortColumns.indexOf(prev.prop) -
							this.sortColumns.indexOf(next.prop)
					);
				});
				this.showKeys = showKeys;
				this.fixedKeys = fixedKeys;
			}
		},
	},
};
</script>

<style lang="scss" scoped>
@import '~@/styles/tabs.scss';
.keys-show,
.keys-fixed {
	transition: all 0.3s;
}
.el-checkbox {
	width: 130px;
	margin-right: 10px;
	margin-bottom: 8px;
	overflow: hidden;
}
</style>
