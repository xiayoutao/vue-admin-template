<template>
	<x-dialog
		title="图标选择"
		:visible.sync="visible"
		width="880px"
		height="608px"
	>
		<div class="icon-wrapper">
			<div
				class="icon-item"
				v-for="item of iconList"
				:key="item"
				@click="handleClick(item)"
			>
				<span :class="item"></span>
				<p style="margin-top: 5px">{{ item }}</p>
			</div>
		</div>
	</x-dialog>
</template>

<script>
import DialogMixin from '@/mixins/dialog';
import iconList from '@/constants/iconList';

export default {
	mixins: [DialogMixin],
	data() {
		return {
			iconList,
		};
	},
	methods: {
		handleClick(data) {
			this.$emit('selected', data);
			this.visible = false;
		},
	},
};
</script>

<style lang="scss" scoped>
.icon-wrapper {
	display: flex;
	flex-wrap: wrap;
	max-height: 500px;
	overflow-x: hidden;
	overflow-y: auto;

	.icon-item {
		position: relative;
		width: 132px;
		margin: 6px 6px 6px 0;
		padding-top: 10px;
		color: #5c6b77;
		text-align: center;
		list-style: none;
		cursor: pointer;
		transition: all 0.2s;

		&:hover {
			transform: scale(1.2);
		}

		> span {
			font-size: 32px;
		}
		> p {
			margin: 0;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
		}
	}
}
</style>
