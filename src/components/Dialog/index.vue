<template>
	<transition name="fade" @after-enter="afterEnter" @after-leave="afterLeave">
		<div
			class="dialog-root"
			:style="{ zIndex: newZIndex }"
			v-dialog-drag="drag"
			v-if="visible"
		>
			<div
				class="dialog-mask"
				:style="{ zIndex: newZIndex }"
				@click="handleWrapperClick"
			></div>
			<div
				ref="dialog"
				class="dialog-wrapper"
				:style="{ width, top: `${getTop(top)}`, zIndex: newZIndex }"
				:key="key"
				@click.self="handleWrapperClick"
			>
				<div class="dialog-header">
					<slot name="title">
						<span>{{ title }}</span>
					</slot>
					<span
						class="dialog-close el-icon-close"
						@click="handleClose()"
						v-if="showClose"
					></span>
				</div>
				<div
					class="dialog-body"
					:style="{
						height: `${getHeight(height)}px`,
						maxHeight: `${getMaxHeight()}px`,
					}"
				>
					<slot></slot>
				</div>
				<div class="dialog-footer" v-if="$slots.footer">
					<slot name="footer"></slot>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
import { mapGetters } from 'vuex';
import vDialogDrag from './v-drag';
let zIndex = 1000;

export default {
	name: 'BpDialog',
	directives: {
		'dialog-drag': vDialogDrag,
	},
	props: {
		visible: Boolean,
		title: {
			type: String,
			default: '',
		},
		top: {
			type: String,
			default: '10vh',
		},
		width: {
			type: String,
			default: '520px',
		},
		height: {
			type: String,
			default: 'auto',
		},
		maxHeight: {
			type: String,
			default: '',
		},
		appendTo: {
			type: String,
			default: '',
		},
		showClose: {
			type: Boolean,
			default: true,
		},
		drag: {
			type: Boolean,
			default: true,
		}, // 是否矫正top位置
		fixTop: Boolean,
		zIndex: Number,
		beforeClose: Function,
		closeOnClickModal: Boolean,
		destroyOnClose: Boolean,
	},
	data() {
		return {
			key: 0,
			closed: false,
			newZIndex: 1000,
		};
	},
	computed: {
		...mapGetters(['pageHeight']),
		dialogMaxHeight() {
			return this.pageHeight - 100;
		},
		appendToWrap() {
			if (!this.appendTo) return;
			return document.querySelector(this.appendTo);
		},
	},
	mounted() {
		if (this.visible) {
			if (this.appendToWrap) {
				this.appendToWrap.appendChild(this.$el);
			}
		}
	},
	destroyed() {
		if (this.appendToWrap && this.$el && this.$el.parentNode) {
			this.$el.parentNode.removeChild(this.$el);
		}
	},
	methods: {
		getTop(top) {
			if (!this.fixTop) {
				return top;
			}
			top = top + '';
			if (top.indexOf('vh') >= 0 || top.indexOf('%') >= 0) {
				const _top = top.replace('vh', '').replace('vh', '') - 0;
				console.log(
					(this.pageHeight * _top) / 100,
					this.dialogMaxHeight,
					this.pageHeight,
					(this.pageHeight * _top) / 100 + this.dialogMaxHeight >=
						this.pageHeight,
				);
				if (
					(this.pageHeight * _top) / 100 + this.dialogMaxHeight >=
					this.pageHeight
				) {
					return 0;
				} else {
					return top;
				}
			} else {
				const _top = top.replace('px', '') - 0;
				if (_top + this.dialogMaxHeight >= this.pageHeight) {
					return 0;
				} else {
					return top;
				}
			}
		},
		getHeight(height) {
			if (height.indexOf('px') >= 0) {
				return height.replace('px', '') - 76;
			}
			return height - 76;
		},
		getMaxHeight() {
			if (!this.maxHeight) return this.dialogMaxHeight;
			return this.maxHeight;
		},
		handleWrapperClick() {
			if (!this.closeOnClickModal) return;
			this.handleClose();
		},
		handleClose() {
			if (this.isFunction(this.beforeClose)) {
				this.beforeClose(this.hide);
			} else {
				this.hide();
			}
		},
		hide(cancel) {
			if (cancel !== false) {
				this.$emit('update:visible', false);
				this.$emit('close');
				this.closed = true;
			}
		},
		afterEnter() {
			this.$emit('opened');
		},
		afterLeave() {
			this.$emit('closed');
		},
	},
	watch: {
		visible(val) {
			if (val) {
				zIndex++;
				this.newZIndex = this.zIndex || zIndex;
				this.closed = false;
				this.$emit('open');
				this.$nextTick(() => {
					this.$refs.dialog.scrollTop = 0;
				});
				if (this.appendToWrap) {
					this.appendToWrap.appendChild(this.$el);
				}
			} else {
				if (!this.closed) this.$emit('close');
				if (this.destroyOnClose) {
					this.$nextTick(() => {
						this.key++;
					});
				}
			}
		},
	},
};
</script>

<style scoped lang="scss">
.dialog-root {
	position: fixed;
	top: 88px;
	right: 0;
	bottom: 0;
	left: $sideBarWidth;
	overflow: auto;
	outline: 0;
	transition: left 0.28s;
}
.hideSidebar {
	.dialog-root {
		left: 56px;
	}
}
.dialog-mask {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.6);
}
.dialog-close {
	@include flex-row(center, center);
	width: 30px;
	height: 100%;
	font-size: 16px;
	text-align: center;
	cursor: pointer;
}
.dialog-wrapper {
	position: relative;
	box-sizing: border-box;
	width: auto;
	max-width: calc(100vw - 32px);
	margin: 0 auto;
	color: #000000d9;
	font-size: 14px;
	list-style: none;
	background: #fff;
}
.dialog-header {
	@include flex-row(center, space-between);
	height: 28px;
	padding: 0 0 0 12px;
	color: #fff;
	font-weight: 700;
	font-size: 14px;
	background-color: $primary;
}
.dialog-body {
	box-sizing: border-box;
	min-height: 120px;
	padding: 8px;
	overflow-x: auto;
	color: #606266;
	font-size: 14px;
	word-break: break-all;
}
.dialog-footer {
	box-sizing: border-box;
	padding: 8px;
	text-align: right;
}
</style>
