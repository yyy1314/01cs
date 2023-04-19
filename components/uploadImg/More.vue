<template>
    <el-row>
        <!-- 多张图片裁剪上传 -->
        <div
                v-for="(item,index) in cValues"
                :key="index"
                :style="{'position':'relative','display': 'inline-block'}"
        >
            <el-button
                    icon="el-icon-close"
                    size="mini"
                    circle
                    style="position: absolute;right: 5px;top: 0px;"
                    @click="close(index)"
            />
            <el-card
                    :body-style="{ padding: '0px' }"
                    :style="{display: 'inline-block','margin-right': '12px','margin-top': '12px'}"
            >
                <div style="padding: 5px;text-align: center;">
                    <upload-img-button
                            :auto-crop-width="autoCropWidth"
                            :auto-crop-height="autoCropHeight"
                            :img-url.sync="item.url"
                            :value.sync="item.value"
                            @afterSuccess="afterSuccess"
                    />
                </div>
            </el-card>
        </div>

        <el-card :body-style="{ padding: '0px' }" :style="{display: 'inline-block'}">
            <div style="padding: 5px;text-align: center;">
                <upload-img-button
                        :auto-crop-width="autoCropWidth"
                        :auto-crop-height="autoCropHeight"
                        :buttontext="'新增图片'"
                        @afterSuccess="afterSuccess"
                />
            </div>
        </el-card>
    </el-row>
</template>
<script>
    import uploadImgButton from './Button'
    import GdImg from '@/views/commons/GdImg'

    export default {
        name: 'UploadImgMore',
        components: {uploadImgButton, GdImg},
        props: {
            values: {
                type: Array,
                default: () => {
                    return []
                }
            },
            imgWidth: {type: Number, default: 0},
            imgHeight: {type: Number, default: 0},
            autoCropWidth: {type: [Number, String], default: 100},
            autoCropHeight: {type: [Number, String], default: 100}
        },
        data() {
            return {
                valIndex: 0,
                curl2: '',
                dialogVisible: false
            }
        },
        computed: {
            cValues: {
                get() {
                    return this.values
                },
                set(val) {
                    this.$emit('update:values', val)
                }
            }
        },
        watch: {
            valIndex(val) {
                var t = this
                t.curl2 = t.cValues[t.valIndex - 1].url
            }
        },
        created() {
        },
        methods: {
            afterSuccess(url, value) {
                var t = this
                if (value) {
                    const index = t.cValues.findIndex(item => item.value === value)
                    t.cValues[index].url = url
                } else {
                    t.cValues.push({
                        value: t.cValues.length + 1,
                        url: url
                    })
                }
                // t.$emit('success',url, value)
            },
            // 删除图片
            close(index) {
                var t = this
                t.cValues.splice(index, 1)
            }
        }
    }
</script>

