<template>
    <div class="informationPublish">

        <el-form
                ref="requestData"
                :model="requestData"
                :rules="rules"
                status-icon
                label-width="100px"
                class="demo-ruleForm">


            <div class="quillEditorBox" style="display:flex">
                <div class="title">注册协议</div>
                <div class="quillEditor">
                    <quill-dditor-chinese v-model="requestData.agreement" :value="requestData.agreement"
                                          style="height:380px;"/>
                </div>
            </div>

            <el-form-item>
                <el-button type="primary" @click="submitForm('requestData')">保存</el-button>
                <el-button @click="$router.go(-1)">返回</el-button>
            </el-form-item>

        </el-form>

    </div>
</template>

<script>
    import {Message} from 'element-ui'

    import {getRegisterServeAgreement, registerServeAgreement} from '@/api/registerServeAgreement'

    import quillDditorChinese from '@/components/quillDditorChinese'


    export default {
        components: {
            quillDditorChinese
        },
        data() {
            return {
                requestData: {
                    agreement: ''
                },
                rules: {
                    agreement: [
                        {required: true, trigger: 'blur', message: '注册服务协议必填'}
                    ]
                },
                editId: '',
                editDetails: {},
            }
        },
        computed: {
        },
        mounted() {
            // 获取活动分类列表
            getRegisterServeAgreement({}).then(response=>{
                this.requestData.agreement = response.res.agreement
                this.editId = response.res.id
            })
        },
        methods: {
            // 发布资讯
            submitForm(formName) {
                console.log(this.content)
                console.log(this.requestData)
                const that = this
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        // alert('submit!')
                        // 发送请求
                        const requestData = {
                            agreement: this.requestData.agreement,
                        }
                        if (this.editId) {
                            requestData.id = this.editId
                        }

                        registerServeAgreement(requestData).then(response => {
                            if(response.code == 200)
                            {
                                Message({
                                    message: `保存成功`,
                                    type: 'success',
                                    duration: 5 * 1000
                                })
                            }
                        })
                    } else {
                        console.log('error submit!!')
                        return false
                    }
                })
            },
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .primeArea {
        width: 500px;

        .middleLine {
            text-align: center;
        }
    }

    ;
    .selectList {
        padding-bottom: 16px;

        .typeName {
            padding-right: 20px;
            min-width: 80px;
            display: inline-block;
            text-align-last: justify
        }
    ;

        .typeMoney {
            padding-left: 20px;
            width: 170px;
        }
    }

    ;
    .quillEditorBox {
        display: flex;
        height: 460px;

        .title {
            width: 100px;
            padding-right: 12px;
            text-align: right;
            font-size: 14px;
            color: #606266;
            font-weight: 700;
            line-height: 40px;
        }
    ;

        .quillEditor {
            flex: 1;
            height: 400px;
        }
    }

</style>

