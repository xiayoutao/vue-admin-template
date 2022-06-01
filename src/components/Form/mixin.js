import { cloneDeep } from 'lodash';

export default {
	props: {
		value: [String, Number, Boolean],
		options: Array,
		dataType: String,
		dataSource: String,
		dataLevel: {
			type: Number,
			default: 3,
		},
	},
	data() {
		return {
			inputValue: null,
		};
	},
	computed: {
		dataList() {
			if (
				this.isDeFined(this.dataType) &&
				this.dataType !== 'region' &&
				!this.dataSource
			) {
				return [];
			}
			if (this.dataType === 'dict') {
				console.log(
					'this.dataSource',
					this.dataSource,
					this.$store.getters.getDictByCode(this.dataSource),
				);
				return cloneDeep(
					this.$store.getters.getDictByCode(this.dataSource) || [],
				);
			} else if (this.dataType === 'store') {
				return cloneDeep(this.$store.getters[this.dataSource] || []);
			} else if (this.dataType === 'region') {
				return this.$store.getters.getRegion(this.dataLevel);
			} else {
				return cloneDeep(this.options);
			}
		},
	},
	watch: {
		value: {
			handler(val) {
				this.inputValue = val;
			},
			immediate: true,
		},
		inputValue(val) {
			this.$emit('input', val);
		},
	},
	methods: {
		// 获取参数
		getPropsByDefault(key, defaultValue) {
			return this.isUndefined(this.$attrs[key])
				? defaultValue
				: this.$attrs[key];
		},
	},
};
