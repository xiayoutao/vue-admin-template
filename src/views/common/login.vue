<template>
	<div class="login-container" ref="login">
		<div class="login-weaper animated bounceInDown">
			<div class="login-left"></div>
			<div class="login-border">
				<div class="login-main">
					<h4 class="login-title">后台管理系统</h4>
					<el-form
						class="login-form"
						ref="dataForm"
						:model="dataForm"
						:rules="rules"
						label-width="0"
						@keyup.enter.native="handleLogin"
					>
						<el-form-item prop="username">
							<el-input
								v-model="dataForm.username"
								size="small"
								auto-complete="off"
								placeholder="请输入用户名"
							>
								<i slot="prefix" class="icon-yonghu" />
							</el-input>
						</el-form-item>
						<el-form-item prop="password">
							<el-input
								v-model="dataForm.password"
								size="small"
								:type="passwordType"
								auto-complete="off"
								placeholder="请输入密码"
							>
								<i
									class="el-icon-view el-input__icon"
									slot="suffix"
									@click="showPassword"
								/>
								<i slot="prefix" class="icon-mima" />
							</el-input>
						</el-form-item>
						<el-form-item>
							<el-button
								class="login-submit"
								type="primary"
								@click.native.prevent="handleLogin"
							>
								登录
							</el-button>
						</el-form-item>
					</el-form>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapActions } from 'vuex';
import md5 from 'js-md5';
import { formatDate } from '@/utils/date';
import { loginByUsername } from '@/apis/login';

export default {
	name: 'login',
	data() {
		return {
			time: '',
			rules: {
				username: [
					{ required: true, message: '请输入用户名', trigger: 'blur' },
				],
				password: [
					{ required: true, message: '请输入密码', trigger: 'blur' },
					{ min: 1, message: '密码长度最少为6位', trigger: 'blur' },
				],
			},
			dataForm: {
				tenantId: '000000', // 租户ID
				username: 'admin', // 用户名
				password: 'admin', // 密码
			},
			passwordType: 'password',
		};
	},
	created() {
		this.getTime();
	},
	watch: {
		$route() {
			this.handleLogin();
		},
	},
	methods: {
		...mapActions(['getTopMenu']),
		getTime() {
			setInterval(() => {
				this.time = formatDate(new Date(), 'YYYY-MM-dd hh:mm:ss');
			}, 1000);
		},
		showPassword() {
			this.passwordType === ''
				? (this.passwordType = 'password')
				: (this.passwordType = '');
		},
		handleLogin() {
			this.$refs.dataForm.validate((valid) => {
				if (valid) {
					const loading = this.$loading({
						lock: true,
						text: '登录中,请稍后。。。',
						spinner: 'el-icon-loading',
					});
					loginByUsername({
						...this.dataForm,
						password: md5(this.dataForm.password),
					})
						.then(({ data }) => {
							loading.close();
							if (data.access_token) {
								this.getTopMenu();
								this.$store.commit('setToken', data.access_token);
								this.$store.commit('setRefreshToken', data.refresh_token);
								this.$store.commit('setUserInfo', data);
								this.$router.push({ path: '/dashboard' });
							} else if (data.error_description) {
								this.$message.error(data.error_description);
							} else {
								this.$message.error(data.msg);
							}
						})
						.catch((err) => {
							console.log(err);
							loading.close();
							this.$message.error(err.msg);
						});
				}
			});
		},
	},
};
</script>

<style scoped lang="scss">
.login-container {
	@include flex-row(center);
	position: relative;
	width: 100%;
	height: 100%;
	margin: 0 auto;
	background-image: url('/img/bg.jpg');
	background-size: 100% 100%;
}

.login-weaper {
	@include flex-row();
	width: 800px;
	margin: 0 auto;
	border-radius: 5px;
	overflow: hidden;
	box-shadow: -4px 5px 10px rgba(0, 0, 0, 0.4);

	.el-input-group__append {
		border: none;
	}
}

.login-left,
.login-border {
	@include flex-row(center);
	position: relative;
	box-sizing: border-box;
	min-height: 500px;
}

.login-left {
	width: 45%;
	background-color: rgba($primary, 1);
}

.login-border {
	flex: 1;
	color: #fff;
	background-color: #fff;
}

.login-main {
	box-sizing: border-box;
	width: 75%;
	max-width: 600px;
	margin: 0 auto;
}

.login-title {
	margin-bottom: 40px;
	color: #333;
	font-weight: 500;
	font-size: 26px;
	letter-spacing: 4px;
	text-align: center;
}

.login-menu {
	width: 100%;
	margin-top: 40px;
	text-align: center;

	a {
		margin: 0px 8px;
		color: #999;
		font-size: 12px;
	}
}

.login-submit {
	width: 100%;
	height: 45px !important;
	margin-top: 30px;
	font-weight: 300;
	font-size: 18px;
	font-family: 'neo';
	letter-spacing: 2px;
	cursor: pointer;
	transition: 0.25s;
}

.login-form {
	margin: 10px 0;

	i {
		color: #333;
	}

	.el-form-item__content {
		width: 100%;
		line-height: 40px;
	}

	.el-form-item {
		margin-bottom: 12px;
	}

	/deep/.el-input {
		.el-input__inner {
			height: 32px;
			border: none;
			border-bottom: 1px solid rgb(235, 237, 242);
			border-radius: 0;
			color: #333;
			line-height: 32px;
			text-indent: 5px;
			background: transparent;
		}

		.el-input__prefix {
			i {
				padding: 0 5px;
				font-size: 16px !important;
			}
		}
	}
}
</style>
