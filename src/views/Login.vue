<script setup lang="ts">
import { ref } from 'vue'
const currentMode = 'electron'
const origin = window.location.origin
const CLIENT_VERSION = '1.0'

const flag = ref(false)
const loginLoading = ref(false)
const agreement = ref(false)
const rememberPwd = ref(false)

const loginForm = ref({
	name: '',
	pass:'',
})

const checkName = async (rule, value, callback) => {
	if (!value) {
		return callback(new Error('用户名不能为空'))
	}
	// else {
	// 	await getTeamInfo({ userId: this.loginForm.name }).then(res => {
	// 		if (res.code == '1007') {
	// 			callback(new Error('客服已过期'))
	// 			return
	// 		} else if (res.code !== '1000') {
	// 			callback(new Error('账号输入错误'))
	// 			return
	// 		}
	// 	})
	// 	callback()
	// }
}

const  rules = ref({
	name: [{ validator: checkName, trigger: 'blur' }]
})
</script>

<template>

	<div class="login-page drag-area"
	     :class="{
      'client-login-page': currentMode === 'electron'
    }"
	>

		<!-- electron menu -->
		<div  class="electron-menu">
			<svg-icon class="icon-btn no-drag-area" icon-class="min" @click="minimizeWindow"></svg-icon>
			<svg-icon class="icon-btn no-drag-area" icon-class="close" @click="closeElectron"></svg-icon>
		</div>

		<div class="login-page-form">
			<div style="font-size: 0;"><img src="../assets/images/login-bg.png" /></div>
			<div class="login-warp-box">
				<!-- logo -->
				<div class="login-logo">
					<img v-if="origin.includes('localhost')" src="../assets/images/icon.png" alt srcset />
					<img v-else-if="origin.includes('hzdaba.cn')" src="../assets/images/icon1.png" alt srcset />
					<img v-else src="../assets/images/icon.png" alt srcset />
					<!-- <span>eco</span> -->
				</div>

				<!-- 登录表单 -->
				<el-form ref="ruleForm" :model="loginForm" :rules="rules" :size="'medium'" status-icon>
					<!-- 用户名 -->
					<el-form-item prop="name">
						<H1>账号登录</H1>
						<el-input
								v-model.trim="loginForm.name"
								step=""
								size="medium"
								maxlength="30"
								placeholder="请输入你的登录账号"
								class="el-input--prefix no-drag-area"
						></el-input>
						<div class="user_icon"></div>
						<!-- @input="changeName()" -->
					</el-form-item>
					<!-- 密码 -->
					<el-form-item prop="pass">
						<el-input
								v-model.trim="loginForm.pass"
								:type="flag ? 'text' : 'password'"
								size="medium"
								autocomplete="off"
								placeholder="请输入密码"
								maxlength="30"
								class="el-input--prefix no-drag-area"
						></el-input>
						<div :class="flag?'eye':'eye_close'"  @click="flag = !flag" ></div>
						<div class="password_icon"></div>
					</el-form-item>
				</el-form>

				<!-- 登录 -->
				<div class="login_btn_box">
					<el-button
							type="primary"
							:loading="loginLoading"
							:disabled="loginLoading"
							class="login-btn no-drag-area"
							@click="submitForm('ruleForm')"
					>
						登 录
					</el-button>
				</div>
				<!-- 同意协议|忘记密码 -->
				<div class="forget-password">
					<el-checkbox v-model="agreement" class="no-drag-area">
						<span style="color: #181818">我已阅读并同意</span>
						<span style="color: #005CFF">用户协议</span>
					</el-checkbox>
					<!-- <el-button type="text" style="color: #e96500">忘记密码</el-button> -->
					<el-checkbox v-model="rememberPwd" class="no-drag-area"><span style="color: #181818">记住密码</span></el-checkbox>
				</div>
				<div class="curr-version">v{{ CLIENT_VERSION }}</div>
			</div>
		</div>
	</div>
</template>


<style lang="scss" scoped>
.curr-version {
	padding: 10px 0;
	color: #181818;
	margin-top: 160px;
	font-size: 12px;
}
.login-page {
	width: 100%;
	height: 100%;
	background: no-repeat;
	background: #f3f3f3;
	display: flex;
	align-items: center;
	&.client-login-page {
		background: transparent;
	}

	.login-page-form {
		width: 1000px;
		height: 711px;

		box-sizing: border-box;
		background: #fff;
		display: flex;
		flex-direction: row;
		align-items: center;
		border-radius: 10px;
		overflow: hidden;
		box-shadow: 0px 3px 6px #bfbfbf57;
		margin: 0 auto;

		.login-warp-box{
			background:#f5f8fb url("../assets/images/login-form-bg.png") no-repeat top left ;
			align-items: center;
			width: 500px;
			flex-direction: column;
			justify-content: center;
			/*margin-bottom: 50px;*/
			display: flex;
			height: 711px;
		}
		&.sample-login-form {
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			border: 1px solid #eee;
		}

		.login-logo {
			display: flex;
			align-items: center;
			/*margin-top: 66px;*/
			font-size: 45px;
			font-weight: 600;
			margin-top: 50px;
			img {
				width: 80px;
			}
		}

		:deep(.el-form) {
			width: 290px;
			align-self: center;
			margin-top: 32px;
			margin-bottom: 0px;

			.el-form-item {
				width: 290px;
				border-radius: 5px;
				h1{ font-size: 30px; color: #181818; font-weight: bold;}
			}
		}

		.forget-password {
			width: 290px;
			font-size: 14px;
			color: #181818;
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-top:1px solid #E0E0E0;
			margin-top:32px; padding-top:16px;
		}
		.login_btn_box {
			display: flex;
			justify-content: center;
			margin-top: 10px;
			.login-btn {
				width: 290px;
				height: 48px;
				border-radius: 2px;
				background-color: #2775FF;
				border: #2775FF;
				font-size: 16px;
			}
		}

	}

	.electron-menu {
		position: absolute;
		z-index: 10;
		top: 0;
		width: 100%;
		height: 30px;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		padding: 0 10px;
		font-size: 22px;
		.icon-btn {
			cursor: pointer;
		}
	}

	.version {
		position: absolute;
		bottom: 0;
		right: 0;
		padding: 5px;
	}
	.login-bg {
		position: absolute;
		top: 20%;
		left: 10%;
		width: 600px;
	}
}

.user_icon{
	position: absolute;
	bottom: 11px;
	left: 8px;
	background: url(../assets/images/icon-user.png);
	width: 16px;
	height: 16px;
	display: block;
	background-size: 16px;
}
.password_icon{position: absolute; bottom: 11px; left: 8px; background: url(../assets/images/icon-password.png);width: 16px; height: 16px; display: block; background-size: 16px;}
:deep(.login-page-form .el-input--medium .el-input__inner){  height: 40px!important;  line-height: 40px!important;  border-radius: 2px;padding-left: 30px!important; }
.eye{position: absolute; bottom: 10px; right: 8px; background: url(../assets/images/eye_open.png);width: 22px; height: 22px; display: block; background-size: 22px;}
.eye_close{position: absolute; bottom: 10px; right: 8px; background: url(../assets/images/eye_close.png);width: 22px; height: 22px; display: block; background-size: 22px;}
:deep(.el-input .el-input__suffix .el-input__suffix-inner){ display: none}
</style>
