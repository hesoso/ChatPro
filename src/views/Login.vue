<script setup lang="ts">
import { ref } from 'vue'

const loginLoading = ref(false)
const agreement = ref(false)

const loginForm = ref({
	name: '',
	pass:'',
})

const checkName = async (rule, value, callback) => {
	if (!value) {
		return callback(new Error('用户名不能为空'))
	}
}

const  rules = ref({
	name: [{ validator: checkName, trigger: 'blur' }]
})

const submitForm = () => {}


const minimizeWindow = () => {
	window.bridge.minimize()
}
const closeElectron = () => {
	window.bridge.closeWindow()
}
</script>

<template>

	<div class="login-page drag-area">
		<div  class="electron-menu">
			<svg-icon class="icon-btn no-drag-area" style="width: 0.5em" name="min" @click="minimizeWindow"></svg-icon>
			<svg-icon class="icon-btn no-drag-area" name="close" @click="closeElectron"></svg-icon>
		</div>
		<div class="login-form-detail">
			<img class="login-page-image" src="../assets/images/login-bg.png" />
			<div class="desc-text">
				<h2>一站式协作</h2>
				<p>多设备统一运营；多模式协同办公</p>
			</div>
		</div>
		<!-- 登录表单 -->
		<div class="login-page-form">
			<h1>欢迎使用客服系统</h1>
			<!-- 登录表单 -->
			<el-form ref="ruleForm" :model="loginForm" :rules="rules" :size="'large'" status-icon>
				<!-- 用户名 -->
				<el-form-item prop="name">
					<el-input
							v-model.trim="loginForm.name"
							clearable
							maxlength="30"
							placeholder="请输入你的手机号"
							class="no-drag-area"
					></el-input>
				</el-form-item>
				<!-- 密码 -->
				<el-form-item prop="pass">
					<el-input
							v-model.trim="loginForm.pass"
							autocomplete="off"
							placeholder="请输入密码"
							maxlength="30"
							class="no-drag-area"
							show-password
					>
					</el-input>
				</el-form-item>
				<div class="underline">忘记密码</div>
			</el-form>
			<!-- 登录 -->
			<div class="login_btn_box">
				<el-button
						size="large"
						type="primary"
						:loading="loginLoading"
						:disabled="loginLoading"
						class="login-btn no-drag-area"
						@click="submitForm('ruleForm')"
				>
					登 录
				</el-button>
			</div>
			<div class="login_btn_box">
				<el-button
						size="large"
						type="primary"
						:loading="loginLoading"
						:disabled="loginLoading"
						class="rg-btn login-btn no-drag-area"
						@click="submitForm('ruleForm')"
				>
					暂无账号，前往注册
				</el-button>
			</div>
			<!-- 同意协议|忘记密码 -->
			<div class="forget-password">
				<el-checkbox v-model="agreement" class="no-drag-area">
					<span style="color: #999999">我已阅读并同意</span>
					<span class="underline">服务条款</span>
				</el-checkbox>
			</div>
		</div>
	</div>
</template>


<style lang="scss" scoped>
.electron-menu {
	position: absolute;
	width: 100%;
	height: 30px;
	left: 0;
	top: 0;
	background: transparent;
	display: flex;
	align-items: center;
	justify-content: flex-end;
	font-size: 30px;
	padding: 0 10px;
}
.login-page{
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;
	.login-form-detail {
		margin-right: 128px;
		text-align: center;
	}
	.login-page-image {
		width: 412px
	}
	.login-page-form {
		width: 412px;
		height: 524px;
		background: #FFFFFF;
		box-shadow: 0px 4px 40px 0px rgba(0,0,0,0.05);
		border-radius: 15px 15px 15px 15px;
		box-sizing: border-box;
		padding: 50px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		h1 {
			font-weight: 500;
			font-size: 32px;
			color: #444444;
		}
	}
}
.desc-text {
	margin-top: 50px;
	font-weight: 400;
	font-size: 16px;
	color: #666666;
	h2 {
		font-weight: 500;
		font-size: 30px;
		color: #3D3D3D;
		margin-bottom: 12px;
	}
}
:deep(.login-page-form) {
	.el-form {
		width: 100%;
		.el-form-item {
			margin-bottom: 20px;
		}
		.el-input__wrapper {
			box-shadow: none;
			height: 50px;
			background: #F6F6F6;
			border-radius: 8px 8px 8px 8px;
			width: 100%;
			font-size: 16px !important;
			color: #333333 !important;
			input::placeholder {
				font-size: 16px;
				color: #999999;
			}
		}
	}
}
.underline {
	font-weight: 400;
	font-size: 14px;
	color: #3686FF;
	text-decoration-line: underline;
	text-align: right;
}
.login_btn_box {
	width: 100%;
	margin-top: 20px;
	.login-btn {
		width: 100%;
	}
}
.forget-password {
	margin-top: 30px;
	font-size: 14px;
	font-weight: normal;
}
.rg-btn {
  background: $cp-main-color-01;
	color: $cp-main-color;
	border-color: $cp-main-color-01;
}
.icon-btn {
	cursor: pointer;
}
</style>
