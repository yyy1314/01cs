<template>
  <div class="h-100" style=";">
    <div class="py-1">
      <span>联系人:</span>
      <el-select v-model="value" placeholder="选填,请选择" size="small" clearable>
        <el-option v-for="item in contacts" :key="item.value" :label="item.name" :value="item.id"></el-option>
      </el-select>
    </div>
    <div class=""><el-input type="textarea" :rows="3" placeholder="必填,沟通内容2-200字" v-model="textarea"></el-input></div>
    <div class="d-flex py-1 j-end"><el-button type="success" @click="releaseCommunicationFn">发布</el-button></div>
    <div class="">
      <div class="py-1" style="border-top: 1px solid #909399;">沟通记录</div>
      <div class="" style="height: 450px;overflow: auto">
        <div class="py-1" v-for="item in items">
          <div class="d-flex">
            <div class="">
              <div class="d-flex a-center j-center" style="width: 45px;height: 45px;background-color: #ccc;border-radius: 50%;">
                <span style="color: #fff;">
                {{item.admin.name.slice(0,1)}}
                </span>
              </div>
            </div>
            <div class="pl-2 w-100">
              <div class="d-flex j-sb">
                <div class="" style="height: 45px;line-height: 45px;">{{item.admin.name}} {{item.created_at}}</div>
                <div class="" style="height: 20px;"><el-button type="danger" size="mini" @click="deleteRecordFn(item.id)" >删除</el-button></div>
              </div>
              <div class="py-1">{{item.content}}</div>
              <div class="" v-if="item.user">
                <el-tag type="info">
                  相关联系人:
                  <span style="color: #409eff;" >{{item.user.name}}</span>
                </el-tag>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { opportunityDetails, releaseCommunication,deleteRecord } from '@/api/enterprise.js';
import { opportunityDetails as opportunityDetailsOfG, releaseCommunication as releaseCommunicationOfG, deleteRecord as deleteRecordOfG } from '@/api/enterprisepublish.js';
export default {

  props: {
    type: {
      type:String,
      default:'enterprise',
    },
    id: {
      type: Number,
      default: null,
    },
    items: {
      type: Array,
      default: function() {
        return [];
      },
    },
    contacts: {
      type: Array,
      default: function() {
        return [];
      },
    }
  },
  data() {
    return {
      textarea: '',
      options: [],
      value: null,
      arr:[],
    };
  },
  created() {

  },
  methods: {
    deleteRecordFn(id){
      if(this.type == 'enterprise'){
        deleteRecord({
          id:this.id,
          communicate_id:id
        }).then(res=>{
          if(res.code == 200){
            this.$message({
              showClose: true,
              message: '删除成功',
              type: 'success'
            });
            this.$emit("communicationed");
          }
        });
      }else{
        deleteRecordOfG({
          id:this.id,
          communicate_id:id
        }).then(res=>{
          if(res.code == 200){
            this.$message({
              showClose: true,
              message: '删除成功',
              type: 'success'
            });
            this.$emit("communicationed");
          }
        });
      }
    },

    releaseCommunicationFn() {
      if(this.type == 'enterprise'){
        releaseCommunication({
          id: this.id,
          content: this.textarea,
          user_id: this.value
        }).then(res => {
          if (res.code == 200) {
            this.$message({
              showClose: true,
              message: '发布成功',
              type: 'success'
            });
            this.textarea = ""
            this.$emit("communicationed");
          } else {
            this.$message({
              showClose: true,
              message: res.msg
            });
          }
        });
      }else{
        releaseCommunicationOfG({
          id: this.id,
          content: this.textarea,
          user_id: this.value
        }).then(res => {
          if (res.code == 200) {
            this.$message({
              showClose: true,
              message: '发布成功',
              type: 'success'
            });
            this.textarea = ""
            this.$emit("communicationed");
          } else {
            this.$message({
              showClose: true,
              message: res.msg
            });
          }
        });
      }

    }

  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
