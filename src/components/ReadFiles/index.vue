<template>
	<x-dialog :title="title" :visible.sync="visible" width="500px" height="340px">
		<simple-table
			:columns="columns"
			:data="dataList"
			:custom-button="false"
		></simple-table>
	</x-dialog>
</template>

<script>
import DialogMixin from '@/mixins/dialog';
import axios from 'axios';
import { isArray } from 'lodash';

export default {
	name: 'ReadFiles',
	mixins: [DialogMixin],
	props: {
		title: {
			type: String,
			default: '查看',
		},
		urls: {
			type: [String, Array],
			default() {
				return [];
			},
		},
	},
	data() {
		let _this = this;
		return {
			loading: false,
			columns: [
				{ label: '名称', prop: 'name' },
				{
					label: '名称',
					prop: 'url',
					render(h, { row }) {
						const type = row.url.replace(/.+\./, '');
						if (/jp(e?)g|png|gif/.test(type)) {
							return (
								<el-image
									src={
										row.url +
										'?x-oss-process=image/resize,m_fixed,limit_0,h_150,w_150'
									}
									preview-src-list={_this.dataList.map((item) => item.url)}
									style="width: 50px; height: 50px;"
								></el-image>
							);
						}
						return <span>{row.name}</span>;
					},
				},
				{
					type: 'operate',
					label: '操作',
					width: 100,
					render(h, { row }) {
						return (
							<el-button onClick={() => _this.handleDownload(row)}>
								下载
							</el-button>
						);
					},
				},
			],
		};
	},
	computed: {
		dataList() {
			if (isArray(this.urls)) {
				return this.urls;
			}
			try {
				const list = JSON.parse(this.urls);
				return list || [];
			} catch {
				return [];
			}
		},
	},
	methods: {
		handleDownload(data) {
			this.loading = true;
			axios
				.get(data.url, {
					responseType: 'blob',
				})
				.then((res) => {
					this.loading = false;
					if (res.data) {
						var blob = new Blob([res.data], {});
						let a = document.createElement('A');
						a.download = data.name;
						document.body.appendChild(a);
						a.href = URL.createObjectURL(blob);
						a.click();
						document.body.removeChild(a);
					}
				})
				.catch(() => {
					this.loading = false;
				});
		},
	},
};
</script>

<style lang="scss" scoped></style>
