<template>
	<el-form
		ref="dataForm"
		v-bind="$attrs"
		:model="dataForm"
		:rules="formRules"
		:disabled="disabled"
		:inline="getPropsByDefault('inline', false)"
		:size="getPropsByDefault('size', 'mini')"
		:label-position="getPropsByDefault('label-position', 'top')"
	>
		<el-row>
			<template v-for="(item, index) in handleFields(fields)">
				<!-- 日期范围 -->
				<template v-if="item.type === 'daterange'">
					<el-col :key="index + '1'" :span="item.span1">
						<el-form-item :label="item.label1" :prop="item.prop1">
							<form-date-picker
								v-bind="item"
								v-model="dataForm[item.prop1]"
								:picker-options="getPickerOptions(item, 1)"
								v-on="{
									...item.events,
									change: ($event) =>
										isFunction(item.events.change) &&
										item.events.change($event, 1),
									focus: ($event) =>
										isFunction(item.events.focus) &&
										item.events.focus($event, 1),
									blur: ($event) =>
										isFunction(item.events.blur) && item.events.blur($event, 1),
								}"
							></form-date-picker>
						</el-form-item>
					</el-col>
					<el-col :key="index + '2'" :span="item.span2">
						<el-form-item :label="item.label2" :prop="item.prop2">
							<form-date-picker
								v-bind="item"
								v-model="dataForm[item.prop2]"
								:picker-options="getPickerOptions(item, 2)"
								v-on="{
									...item.events,
									change: ($event) =>
										isFunction(item.events.change) &&
										item.events.change($event, 1),
									focus: ($event) =>
										isFunction(item.events.focus) &&
										item.events.focus($event, 1),
									blur: ($event) =>
										isFunction(item.events.blur) && item.events.blur($event, 1),
								}"
							></form-date-picker>
						</el-form-item>
					</el-col>
				</template>
				<!-- 换行 -->
				<div class="clearfix" :key="index" v-else-if="item.type === 'br'"></div>
				<!-- 其他类型（输入框、计数器、下拉、单选、多选、日期、级联选择、上传组件等） -->
				<el-col :key="index" :span="item.span" v-else>
					<el-form-item :label="item.label || ' '" :prop="item.prop">
						<!-- 输入框 -->
						<form-input
							v-bind="item"
							v-model="dataForm[item.prop]"
							:prependValue.sync="dataForm[item.selectKey]"
							v-on="item.events"
							v-if="item.type === 'input'"
						></form-input>
						<!-- 计数器 -->
						<form-input-number
							v-bind="item"
							v-model="dataForm[item.prop]"
							v-on="item.events"
							v-else-if="item.type === 'inputNumber'"
						></form-input-number>
						<!-- 下拉框 -->
						<form-select
							v-bind="item"
							v-model="dataForm[item.prop]"
							v-on="item.events"
							v-else-if="item.type === 'select'"
						></form-select>
						<form-select-tree
							v-bind="item"
							v-model="dataForm[item.prop]"
							:list="item.options"
							:tree-props="item.treeProps"
							v-else-if="item.type === 'selectTree'"
						></form-select-tree>
						<!-- 单选框（单个） -->
						<form-radio
							v-bind="item"
							v-model="dataForm[item.prop]"
							:label="item.data"
							:text="item.text"
							v-on="item.events"
							v-else-if="item.type === 'radio'"
						></form-radio>
						<form-radios
							v-bind="item"
							v-model="dataForm[item.prop]"
							:label="item.data"
							:text="item.text"
							:radioType="item.radioType"
							v-on="item.events"
							v-else-if="item.type === 'radios'"
						></form-radios>
						<form-checkbox
							v-bind="item"
							v-model="dataForm[item.prop]"
							:label="item.data"
							:text="item.text"
							v-on="item.events"
							v-else-if="item.type === 'checkbox'"
						></form-checkbox>
						<form-checkboxs
							v-bind="item"
							v-model="dataForm[item.prop]"
							:checkboxType="item.checkboxType"
							v-on="item.events"
							v-else-if="item.type === 'checkboxs'"
						></form-checkboxs>
						<!-- 开关 -->
						<form-switch
							v-bind="item"
							v-model="dataForm[item.prop]"
							:active-value="item.activeValue"
							:active-text="item.activeText"
							:inactive-value="item.inactiveValue"
							:inactive-text="item.inactiveText"
							v-on="item.events"
							v-else-if="item.type === 'switch'"
						></form-switch>
						<!-- 日历 -->
						<form-date-picker
							v-bind="item"
							v-model="dataForm[item.prop]"
							v-on="item.events"
							v-else-if="item.type === 'date'"
						></form-date-picker>
						<!-- 时间选择器 -->
						<form-time-select
							v-bind="item"
							v-model="dataForm[item.prop]"
							:pickerOptions="item.pickerOptions"
							v-on="item.events"
							v-else-if="item.type === 'timeSelect'"
						></form-time-select>
						<!-- 时间选择器 -->
						<form-time-picker
							v-bind="item"
							v-model="dataForm[item.prop]"
							:pickerOptions="item.pickerOptions"
							v-on="item.events"
							v-else-if="item.type === 'timePicker'"
						></form-time-picker>
						<!-- 级联选择器 -->
						<form-cascader
							v-bind="item"
							v-model="dataForm[item.prop]"
							:options="item.options"
							v-on="item.events"
							v-else-if="item.type === 'cascader'"
						></form-cascader>
						<form-upload
							v-bind="item"
							v-model="dataForm[item.prop]"
							:list-type="item.listType"
							v-on="item.events"
							v-else-if="item.type === 'upload'"
						></form-upload>
						<div class="" v-else-if="item.type === 'render'">
							<render :data="item.props" :render="item.render"></render>
						</div>
						<el-input
							style="visibility: hidden"
							v-else-if="item.type === 'placeholder'"
						>
							<!-- 占位 -->
						</el-input>
						<div class="height-fix" v-else>
							{{ dataForm[item.prop] }}
						</div>
					</el-form-item>
				</el-col>
			</template>
		</el-row>
		<el-row v-if="$slots.footer">
			<el-col>
				<el-form-item>
					<slot name="footer"></slot>
				</el-form-item>
			</el-col>
		</el-row>
	</el-form>
</template>

<script>
import { isObject } from 'lodash';
import UploadMixin from '@/mixins/upload';
import { isObjectEqual } from '@/utils/util';
import { isHump } from '@/utils/validate';
import Render from '@cps/Render';
import FormInput from '@cps/Form/input.vue';
import FormInputNumber from '@cps/Form/input-number.vue';
import FormSelect from '@cps/Form/select.vue';
import FormSelectTree from '@cps/Form/select-tree.vue';
import FormRadio from '@cps/Form/radio.vue';
import FormRadios from '@cps/Form/radios.vue';
import FormCheckbox from '@cps/Form/checkbox.vue';
import FormCheckboxs from '@cps/Form/checkboxs.vue';
import FormSwitch from '@cps/Form/switch.vue';
import FormDatePicker from '@cps/Form/date-picker.vue';
import FormTimeSelect from '@cps/Form/time-select.vue';
import FormTimePicker from '@cps/Form/time-picker.vue';
import FormUpload from '@cps/Form/upload.vue';
import FormCascader from '@cps/Form/cascader.vue';

export default {
	name: 'FormConfig',
	mixins: [UploadMixin],
	components: {
		Render,
		FormInput,
		FormInputNumber,
		FormSelect,
		FormSelectTree,
		FormRadio,
		FormRadios,
		FormCheckbox,
		FormCheckboxs,
		FormSwitch,
		FormDatePicker,
		FormTimeSelect,
		FormTimePicker,
		FormUpload,
		FormCascader,
	},
	props: {
		value: {
			type: Object,
			default() {
				return {};
			},
		},
		fields: {
			type: Array,
			default() {
				return [];
			},
		},
		rules: {
			type: Object,
			default() {
				return {};
			},
		},
		disabled: Boolean,
		disabledFields: {
			type: Array,
			default() {
				return [];
			},
		},
		aloneRules: {
			// 是否单独传入规则，不放在fields里面
			type: Boolean,
			default: true,
		},
	},
	data() {
		return {
			that: this,
			pickerOptions: {}, // 日历控件默认配置
			formRules: {}, // 表单规则
			dataForm: {}, // 表单数据
		};
	},
	watch: {
		value: {
			handler(val) {
				if (!isObjectEqual(val, this.dataForm)) {
					// 传入的值和dataForm不一致，才给dataForm赋值。否则会出现死循环
					this.dataForm = { ...val };
				}
			},
			deep: true,
			immediate: true,
		},
		dataForm: {
			handler(val) {
				this.$emit('input', { ...val });
			},
			deep: true,
		},
		// fields: {
		// 	handler() {
		// 		this.reloadRules(); // 处理表单校验规则
		// 	},
		// 	deep: true,
		// 	immediate: true,
		// },
	},
	created() {
		this.reloadRules(); // 处理表单校验规则
	},
	methods: {
		validate(callback) {
			this.$refs.dataForm.validate((valid) => {
				callback && callback(valid);
			});
		},
		resetFields() {
			if (this.$refs.dataForm) {
				this.$refs.dataForm.resetFields();
			}
		},
		clearValidate() {
			if (this.$refs.dataForm) {
				this.$refs.dataForm.clearValidate();
			}
		},
		// 处理表单字段配置
		handleFields(fields) {
			let _fields = [];
			for (let i = 0, len = fields.length; i < len; i++) {
				const item = fields[i];
				if (item.prop) {
					this.$set(
						this.dataForm,
						item.prop,
						this.isDeFined(this.value[item.prop])
							? this.value[item.prop]
							: this.isDeFined(item.defaultValue)
							? item.defaultValue
							: '',
					);
				}
				let field = {
					disabled:
						this.disabledFields.indexOf(item.prop) >= 0 ||
						Boolean(item.disabled),
				};
				let events = {
					...(item.events || {}),
				};
				Object.keys(item).forEach((key) => {
					if (isHump(key)) {
						if (item.type === 'upload') {
							field[this.getEventName(key, true)] = this.isFunction(item[key])
								? item[key]
								: () => {};
						} else {
							events[this.getEventName(key)] = this.isFunction(item[key])
								? item[key]
								: () => {};
						}
					} else {
						field[key] = item[key];
					}
				});
				field.events = events;
				_fields.push(field);
			}
			return _fields;
		},
		// 处理表单字段的校验规则
		reloadRules() {
			let _rules = {};
			if (this.aloneRules) {
				_rules = this.rules;
			} else {
				let len = this.fields.length;
				for (let index = 0; index < len; index++) {
					const element = this.fields[index];
					if (element.rules) {
						_rules[element.prop] = element.rules;
					}
					if (element.rules1 && element.prop1) {
						_rules[element.prop1] = element.rules1;
					}
					if (element.rules2 && element.prop2) {
						_rules[element.prop2] = element.rules2;
					}
				}
			}
			this.formRules = _rules;
		},
		/**
		 * 获取事件名称，onChange -> change
		 * @param eventName 事件名称
		 * @param keepOn 是否保留 on-
		 */
		getEventName(eventName, keepOn) {
			const str = eventName.replace(/([A-Z])/g, '-$1').toLowerCase();
			if (keepOn) {
				return str;
			}
			return str.replace('on-', '');
		},
		// 获取日期控件picker-options参数
		getPickerOptions(data, idx) {
			const _this = this;
			const pickerOptions = isObject(data.pickerOptions)
				? data.pickerOptions
				: {};
			if (data.type === 'daterange') {
				const val1 = _this.dataForm[data.prop1];
				const val2 = _this.dataForm[data.prop2];
				const hasVal1 = this.hasValue(val1);
				const hasVal2 = this.hasValue(val2);
				return {
					...pickerOptions,
					disabledDate(time) {
						if (idx === 1) {
							return hasVal2 && time.getTime() > new Date(val2).getTime();
						} else if (idx === 2) {
							return hasVal1 && time.getTime() < new Date(val1).getTime();
						}
					},
				};
			}
			return {
				...pickerOptions,
			};
		},
		// 获取表格参数
		getPropsByDefault(key, defaultValue) {
			return this.isUndefined(this.$attrs[key])
				? defaultValue
				: this.$attrs[key];
		},
		hasValue(val) {
			return this.isDeFined(val) && val !== '';
		},
	},
};
</script>

<style lang="scss" scoped>
.el-form {
	.el-form-item {
		margin-right: 15px;

		.el-form-item__content {
			.el-input-group {
				display: inline-flex;
				vertical-align: baseline;
			}
			.el-input-group__append {
				line-height: 26px;
			}
			.el-radio-group {
				line-height: 28px;
			}
			.el-radio-group:not([radiotype='button']) {
				.el-radio {
					margin-right: 10px;
					line-height: 28px;
					&:last-child {
						margin-right: 0;
					}
				}
			}
			.height-fix {
				display: block;
				height: 28px;
				font-size: 14px;
			}
		}
	}
}
</style>
