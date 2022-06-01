// 弹窗混合文件
export default {
	props: {
		show: Boolean,
	},
	data() {
		return {
			visible: false,
		};
	},
	methods: {
		handleSubmit() {
			this.visible = false;
		},
		handleCancel() {
			this.visible = false;
		},
	},
	watch: {
		show(val) {
			this.visible = val;
		},
		visible(val) {
			this.$emit('update:show', val);
		},
	},
};
