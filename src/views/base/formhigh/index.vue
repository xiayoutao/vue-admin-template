<template>
	<div class="page-form">
		<div class="box">
			<form-config
				ref="dataForm"
				v-model="dataForm"
				:fields="fields"
				:alone-rules="false"
				:disabled-fields="disabledFields"
				:inline="false"
				label-position="left"
			></form-config>
		</div>
	</div>
</template>

<script>
import { getFields } from './fields';

export default {
	name: 'formhigh',
	data() {
		return {
			fields: getFields(this),
			disabledFields: [],
			dataForm: {
				id: 'sssssss',
				title: '2222',
				switch: false,
				file: [{ name: 'food.jpeg' }, { name: 'food.jpeg' }],
			},
		};
	},
};
</script>

<style lang="scss" scoped>
.box {
	width: 75%;
	margin: 20px;
	padding: 20px;
	border: 1px solid #ebebeb;
	border-radius: 3px;
	transition: 0.2s;
}
</style>
