<template>
	<el-pagination
		:current-page="pageIndex"
		:page-size="pageSize"
		:total="total"
		:page-sizes="pageSizes"
		:layout="pageLayout"
		background
		@current-change="handleCurrentChange"
		@size-change="handleSizeChange"
	></el-pagination>
</template>

<script>
export default {
	props: {
		config: {
			type: Object,
			default() {
				return {};
			},
		},
	},
	data() {
		return {
			pageSize: 50,
			pageSizes: [],
			pageLayout: '',
			pageIndex: 1,
			total: 0,
		};
	},
	methods: {
		// 页码改变
		handleCurrentChange(page) {
			this.pageIndex = page;
			this.$emit('on-page', {
				current: this.pageIndex,
				size: this.pageSize,
				type: 'current',
			});
		},
		// 每页显示记录条数改变
		handleSizeChange(size) {
			this.pageSize = size;
			this.$emit('on-page', {
				current: this.pageIndex,
				size: this.pageSize,
				type: 'size',
			});
		},
	},
	watch: {
		config: {
			handler(val) {
				this.total = val.total || 0;
				this.pageSize = val.size || 20;
				this.pageSizes = val.pageSizes || [20, 50, 100, 200];
				this.pageLayout = val.layout || 'total,prev,pager,next,sizes,jumper';
			},
			deep: true,
			immediate: true,
		},
	},
};
</script>

<style></style>
