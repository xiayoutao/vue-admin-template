<template>
	<div class="page-region">
		<el-row>
			<el-col :span="9">
				<div class="box scrollbar" :style="styleObj">
					<el-tree
						ref="tree"
						:data="dataList"
						node-key="id"
						:props="{ label: 'title', value: 'id' }"
					></el-tree>
				</div>
			</el-col>
			<el-col :span="15">
				<div class="box scrollbar" :style="styleObj">
					<form-config
						ref="dataForm"
						v-model="dataForm"
						:fields="fields"
						:alone-rules="false"
					></form-config>
				</div>
			</el-col>
		</el-row>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import { getTree } from '@/apis/system/region';
import { getFormFields } from './formFields';

export default {
	data() {
		return {
			dataList: [],
			dataForm: {},
			fields: getFormFields(this),
		};
	},
	computed: {
		...mapGetters(['pageHeight']),
		styleObj() {
			return {
				height: `${this.pageHeight - 20}px`,
				padding: '0 15px',
				overflowY: 'auto',
			};
		},
	},
	created() {
		this.getDataList();
	},
	methods: {
		getDataList() {
			getTree().then(({ data }) => {
				this.dataList = data || [];
			});
		},
	},
};
</script>

<style></style>
