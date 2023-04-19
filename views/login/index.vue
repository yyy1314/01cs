<template>
    <div class="login-container">
        <img src="@/assets/login/bottom.png" class="bottomImg" alt="">
        <img src="@/assets/login/leftBottom.png" class="leftBottomImg" alt="">
        <img src="@/assets/login/topRight.png" class="topRightImg" alt="">


        <el-form
                ref="loginForm"
                :model="loginForm"
                :rules="loginRules"
                class="login-form"
                auto-complete="on"
                label-position="left"
        >
            <div class="top">
                <div class="img">
                    <img src="@/assets/login/logo.png" alt="">
                </div>
                <div class="text">
                    <h5>后台管理系统</h5>
                    <div class="text">Background management system</div>
                </div>
                <div class="rightCircle"></div>
                <div class="leftCircle"></div>
            </div>

            <div class="center">


                <el-form-item prop="mobile">
        <span class="svg-container">
          <svg-icon icon-class="user"/>
        </span>
                    <el-input
                            v-model="loginForm.mobile"
                            name="mobile"
                            type="text"
                            auto-complete="on"
                            placeholder="用户名"
                    />
                </el-form-item>
                <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password"/>
          </span>
                    <el-input
                            :type="pwdType"
                            v-model="loginForm.password"
                            name="password"
                            auto-complete="on"
                            placeholder="密码"
                            @keyup.enter.native="handleLogin"
                    />
                    <span class="show-pwd" @click="showPwd">
            <svg-icon icon-class="eye"/>
          </span>
                </el-form-item>

                <div class="verificationCodeBox">
                    <el-form-item prop="captcha">
            <span class="svg-container">
              <svg-icon icon-class="verificationCode"/>
            </span>
                        <el-input
                                v-model="loginForm.captcha"
                                type="text"
                                name="captcha"
                                auto-complete="on"
                                placeholder="验证码"
                                @keyup.enter.native="handleLogin"
                        />
                    </el-form-item>
                    <div class="imgDiv">
                        <img :src="captchaUrl" alt="" class="codeImg" @click="changeCode()">
                    </div>
                </div>

                <el-form-item>
                    <el-button
                            :loading="loading"
                            type="primary"
                            style="width:100%;"
                            @click.native.prevent="handleLogin"
                    >登陆
                    </el-button>
                </el-form-item>
            </div>
            <div class="tips"/>
        </el-form>
    </div>
</template>

<script>

    import {isvalidmobile} from '@/utils/validate'
    import {getCaptcha} from '@/api/login'
    import {getMenus} from '@/api/role'
    import Layout from '@/views/layout/Layout';
    import * as dd from 'dingtalk-jsapi';


    export default {
        name: 'Login',
        data() {
            const validatePass = (rule, value, callback) => {
                if (value.length < 6) {
                    callback(new Error('密码不能小于6位'))
                } else {
                    callback()
                }
            }
            const validateCaptcha = (rule, value, callback) => {
                if (value.length != 4) {
                    callback(new Error('验证码必须为4位'))
                } else {
                    callback()
                }
            }
            return {
                loginForm: {
                    mobile: '',
                    password: '',
                    captcha: ''
                },
                loginRules: {
                    mobile: [{required: true, trigger: 'blur', message: '用户名必填'}],
                    password: [{required: true, trigger: 'blur', validator: validatePass}],
                    captcha: [{required: true, trigger: 'blur', validator: validateCaptcha}]
                },
                loading: false,
                pwdType: 'password',
                redirect: undefined,
                captchaUrl: `${process.env.proxyTableBASE_API}/getCaptcha?t=${Math.random()}`
            }
        },
        watch: {
            $route: {
                handler: function (route) {
                    this.redirect = route.query && route.query.redirect
                },
                immediate: true
            }
        },
        created(){
          if(process.env.NODE_ENV == 'production' && dd.env.platform != 'notInDingTalk'){  // development
            let that = this;
            dd.ready(function() {
              dd.runtime.permission.requestAuthCode({
                corpId: 'ding4636d38f7babaf3235c2f4657eb6378f', // 企业id
                onSuccess: function (info) {
                   let code = info.code // 通过该免登授权码可以获取用户身份
                   that.$store
                       .dispatch('ddLogin', code)
                       .then((res) => {
                          if(res.code == 200){
                            that.$router.push({path: that.redirect || '/index'});
                          }else{
                             this.$message({
                               showClose: true,
                               message: res.msg
                             });
                          }
                       }).catch(a => {

                       })

              }});
            });
          }
        },
        mounted() {
        },
        methods: {
            changeCode(e) {
                getCaptcha().then(e => {
                })
                this.captchaUrl = `${process.env.proxyTableBASE_API}/getCaptcha?t=${Math.random()}`
                // }, 1000)
            },
            showPwd() {
                if (this.pwdType === 'password') {
                    this.pwdType = ''
                } else {
                    this.pwdType = 'password'
                }
            },
            handleLogin() {
              
                if(process.env.NODE_ENV == 'production'){  // development
                  this.$message({
                    showClose: true,
                    message: "请在钉钉PC客户端内打开！"
                  });
                  return;
                } 
              
    
                
                this.$refs.loginForm.validate(valid => {
                    if (valid) {
                        this.loading = true
                        this.loginForm.password = this.loginForm.password
                        this.$store
                            .dispatch('Login', this.loginForm)
                            .then(() => {
                                this.loading = false;
                                this.$router.push({path: this.redirect || '/index'});
                            })
                            .catch(a => {
                                this.loading = false
                            })
                    } else {
                        return false
                    }
                })
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
    $bg: #666666;
    $light_gray: #000;

    /* reset element-ui css */
    .login-container {
        .el-input {
            display: inline-block;
            width: 85%;

            input {
                background: transparent;
                border: 0px;
                -webkit-appearance: none;
                border-radius: 0px;
                padding: 12px 5px 12px 8px;
                color: $light_gray;

                &:-webkit-autofill {
                    -webkit-box-shadow: 0 0 0px 1000px #fff inset !important;
                    /*-webkit-text-fill-color: #fff !important;*/
                }
            }
        }

        .el-form-item {
            border: 1px solid #999999;
            background: #fff;
            border-radius: 5px;
            color: #454545;

            .el-form-item__content {
                line-height: 33px;
            }
        ;

            .svg-icon {
                font-size: 16px;
            }
        }
    }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
    $bg: #666666;
    $dark_gray: #889aa4;
    $light_gray: #eee;
    .login-container {
        position: fixed;
        height: 100%;
        width: 100%;
        background: linear-gradient(180deg, rgba(183, 222, 254, 1) 0%, rgba(118, 189, 253, 1) 100%);

        .login-form {
            position: absolute;
            left: 0;
            right: 0;
            width: 460px;
            max-width: 100%;
            margin: 120px auto;
            background: #fff;

            .top {
                display: flex;
                justify-content: center;
                align-items: center;
                background: rgba(15, 139, 253, 1);
                height: 153px;
                position: relative;
                overflow: hidden;

                .img {
                    img {
                        width: 65px;
                        height: 50px;
                    }

                    position: relative;
                    z-index: 2;
                }
            ;

                .text {
                    padding-left: 10px;
                    position: relative;
                    z-index: 2;

                    h5 {
                        font-size: 22px;
                        padding: 0;
                        margin: 0;
                        color: #fff;
                    }
                ;

                    .text {
                        font-size: 12px;
                        color: #fff;
                        padding: 6px 0 0 0;
                    }
                }
            ;

                .rightCircle {
                    position: absolute;
                    right: -100px;
                    top: -108px;
                    background: #2BA0FF;
                    width: 250px;
                    height: 200px;
                    border-radius: 50%;
                    z-index: 0;
                }

                .leftCircle {
                    position: absolute;
                    left: -70px;
                    bottom: -70px;
                    background: #2BA0FF;
                    width: 150px;
                    height: 150px;
                    border-radius: 50%;
                    z-index: 0;
                }


            }
        ;

            .center {
                padding: 30px 60px;
            }
        }

        .tips {
            font-size: 14px;
            color: #fff;

            span {
                &:first-of-type {
                    margin-right: 16px;
                }
            }
        }

        .svg-container {
            padding: 6px 5px 6px 15px;
            color: $dark_gray;
            vertical-align: middle;
            width: 30px;
            display: inline-block;
        }

        .title {
            font-size: 26px;
            font-weight: 400;
            color: $light_gray;
            margin: 0px auto 40px auto;
            text-align: center;
            font-weight: bold;
        }

        .show-pwd {
            position: absolute;
            right: 10px;
            top: 7px;
            font-size: 16px;
            color: $dark_gray;
            cursor: pointer;
            user-select: none;
        }

        .verificationCodeBox {
            display: flex;

            .el-form-item {
                flex: 1;
                white-space: nowrap;
            }

            .imgDiv {
                height: 45px;
                min-width: 225px;
                display: flex;
                justify-content: flex-end;

                .codeImg {
                    height: 45px;
                    display: block;
                }
            }

        }

        .bottomImg {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
        }

        .leftBottomImg {
            position: absolute;
            bottom: 0;
            left: 0;
            z-index: -1
        }

        .topRightImg {
            position: absolute;
            top: 0;
            right: 0;
        }
    }
</style>
