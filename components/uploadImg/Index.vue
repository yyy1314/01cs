<template>
    <el-row>
        <!-- 单张图片裁剪上传 -->
        <div class="upLoadBox">
            <div style="padding: 5px;text-align: center;">
                <upload-img-button
                        ref="imgbutton"
                        :auto-crop-width="autoCropWidth"
                        :auto-crop-height="autoCropHeight"
                        :img-width="imgWidth"
                        :img-url.sync="imgUrl"
                        :hidden="hidden"
                        @afterSuccess="afterSuccess"
                />
            </div>
        </div>
    </el-row>
</template>
<script>
    import uploadImgButton from './Button'

    export default {
        components: {uploadImgButton},
        props: {
            value: {type: [String, Array], default: null},
            imgUrl: {type: [String, Array], default: null},
            autoCropWidth: {type: [Number, String], default: 100},
            autoCropHeight: {type: [Number, String], default: 100},
            imgWidth: {type: [Number, String], default: 100},
            hidden: {type: Boolean, default: false}
        },
        data() {
            return {
                dialogVisible: false,
                curl2: this.url
            }
        },
        watch: {},
        methods: {
            afterSuccess(url) {
                console.log(url)
                this.$emit('update:imgUrl', url)
            },
            beforeClick() {
                this.$refs.imgbutton.selectFile()
            }
        }
    }
</script>
<style rel="stylesheet/scss" lang="scss">
    .upLoadBox {
        display: inline-block;
        border: 2px dashed #ebeef5;
    }
</style>

