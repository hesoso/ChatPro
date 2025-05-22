<script setup lang="ts">
import { ref } from 'vue'
import PhoneCode from '@/components/PhoneCode.vue'

enum FORM_TYPE {
  LOGIN = 'login',
  REGISTER = 'register',
  FORGOT_PASSWORD = 'forgot-password',
}

const successFlag = ref(true)
const loginLoading = ref(false)
const showProvision = ref(false)
const agreement = ref(false)
const formType = ref(FORM_TYPE.REGISTER)

const loginForm = ref({
  name: '',
  pass: ''
})

const checkName = async (rule, value, callback) => {
  if (!value) {
    return callback(new Error('用户名不能为空'))
  }
}

const rules = ref({
  name: [{ validator: checkName, trigger: 'blur' }]
})

const submitForm = () => {
}

const toLogin = () => {
  formType.value = FORM_TYPE.LOGIN
  successFlag.value = false
}


const minimizeWindow = () => {
  window.bridge.minimize()
}
const closeElectron = () => {
  window.bridge.closeWindow()
}
</script>

<template>

  <div class="login-page drag-area">
    <div class="electron-menu">
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
    <!-- 表单 -->
    <div class="form-wrap">
      <div class="login-page-form">
        <!-- 登录表单 -->
        <template v-if="formType === FORM_TYPE.LOGIN">
          <h1>欢迎使用客服系统</h1>
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
            <div class="underline no-drag-area" @click="formType = FORM_TYPE.FORGOT_PASSWORD">忘记密码</div>
          </el-form>
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
              @click="formType = FORM_TYPE.REGISTER"
            >
              暂无账号，前往注册
            </el-button>
          </div>
        </template>
        <!-- 注册表单 -->
        <template v-else-if="formType === FORM_TYPE.REGISTER">
          <h1>注册</h1>
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
            <!-- 发送验证码 -->
            <el-form-item prop="pass">
              <div class="layout-qz">
                <el-input
                  v-model.trim="loginForm.pass"
                  autocomplete="off"
                  placeholder="请输入验证码"
                  maxlength="30"
                  class="no-drag-area"
                  show-password
                >
                </el-input>
                <div style="margin-left: 20px">
                  <PhoneCode phone="18888888888"></PhoneCode>
                </div>
              </div>
            </el-form-item>
            <!-- 密码 -->
            <el-form-item prop="pass" style="margin-bottom: 0">
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
          </el-form>
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
              @click="formType = FORM_TYPE.LOGIN"
            >
              已有账号，前往登录
            </el-button>
          </div>
        </template>
        <!-- 重置密码 -->
        <template v-else-if="formType === FORM_TYPE.FORGOT_PASSWORD">
          <h1>重置密码</h1>
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
            <!-- 发送验证码 -->
            <el-form-item prop="pass">
              <div class="layout-qz">
                <el-input
                  v-model.trim="loginForm.pass"
                  autocomplete="off"
                  placeholder="请输入验证码"
                  maxlength="30"
                  class="no-drag-area"
                  show-password
                >
                </el-input>
                <div style="margin-left: 20px">
                  <PhoneCode phone="18888888888"></PhoneCode>
                </div>
              </div>
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
          </el-form>
          <div class="login_btn_box">
            <el-button
              size="large"
              type="primary"
              :loading="loginLoading"
              :disabled="loginLoading"
              class="login-btn no-drag-area"
              @click="submitForm('ruleForm')"
            >
              重置密码
            </el-button>
          </div>
          <div class="login_btn_box">
            <el-button
              size="large"
              type="primary"
              :loading="loginLoading"
              :disabled="loginLoading"
              class="rg-btn login-btn no-drag-area"
              @click="formType = FORM_TYPE.LOGIN"
            >
              取消
            </el-button>
          </div>
        </template>
        <!-- 同意服务条款 -->
        <div v-if="formType !== FORM_TYPE.FORGOT_PASSWORD" class="forget-password no-drag-area">
          <el-checkbox v-model="agreement" class="no-drag-area">
            <span style="color: #999999">我已阅读并同意</span>
          </el-checkbox>
          <span class="underline" @click.stop="showProvision = true">服务条款</span>
        </div>
        <!-- 服务条款弹窗 -->
        <div v-if="showProvision" class="provision">
          <header>服务条款
            <svg-icon
              class="top-right-icon no-drag-area"
              style="font-size: 30px;color: #999999"
              name="close"
              @click="showProvision = false"></svg-icon>
          </header>
          <div class="provision-content">
            <p>
              本隐私政策写明了在不同场景下我们处理你的个人信息的方式，为了帮助你更加直观、简明地了解我们如何收集、使用以及保护你的个人信息，我们也为你提供了《xxxxxx服务条款》</p>
            <p>
              本隐私政策写明了在不同场景下我们处理你的个人信息的方式，为了帮助你更加直观、简明地了解我们如何收集、使用以及保护你的个人信息，我们也为你提供了内容更加简洁的</p>
            <p>
              本隐私政策写明了在不同场景下我们处理你的个人信息的方式，为了帮助你更加直观、简明地了解我们如何收集、使用以及保护你的个人信息，我们也为你提供了内容更加简洁的</p>
            <p>本隐私政策写明了在不同场景下我们处理你的个人信息的方式，为了帮助你更加直观、简明地了解我们如何收集</p>
          </div>
        </div>
        <!-- 注册、重置成功弹窗 -->
        <div v-if="successFlag" class="success-wrap layout-ac">
          <div style="text-align: center">
            <svg-icon style="font-size: 96px;" name="success"></svg-icon>
            <p style="margin-top: 16px">{{formType === FORM_TYPE.FORGOT_PASSWORD ? '重置密码成功' : '注册成功'}}</p>
          </div>
          <el-button size="large" type="primary" @click="toLogin">去登录</el-button>
        </div>
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

.login-page {
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

  .form-wrap {
    width: 412px;
    height: 524px;
  }

  .login-page-form {
    height: 100%;
    background: #FFFFFF;
    box-shadow: 0px 4px 40px 0px rgba(0, 0, 0, 0.05);
    border-radius: 15px 15px 15px 15px;
    box-sizing: border-box;
    padding: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    position: relative;

    h1 {
      font-weight: 500;
      font-size: 32px;
      color: #444444;
    }

    .provision {
      position: absolute;
      width: 328px;
      height: 399px;
      background: #FFFFFF;
      box-shadow: 0px 4px 40px 0px rgba(0, 0, 0, 0.05);
      border-radius: 15px 15px 15px 15px;
      border: 1px solid #EEEEEE;
      top: 40px;
      left: 50%;
      transform: translateX(-50%);

      header {
        height: 48px;
        font-weight: 500;
        font-size: 16px;
        color: #3D3D3D;
        border-bottom: 1px solid #EEEEEE;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
      }

      .provision-content {
        padding: 12px 20px;
        font-weight: 400;
        font-size: 14px;
        color: #666666;
        line-height: 17px;

        p {
          margin-bottom: 20px;
        }
      }
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
  cursor: pointer;
  user-select: none;
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
  display: flex;
  align-items: center;
}

.rg-btn {
  background: $cp-main-color-01;
  color: $cp-main-color;
  border-color: $cp-main-color-01;
}

.icon-btn {
  cursor: pointer;
}
.success-wrap {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: #fff;
  z-index: 9;
  font-weight: 400;
  font-size: 24px;
  color: #444444;
  padding: 143px 50px 61px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
