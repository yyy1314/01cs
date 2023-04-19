<template>
  <el-dialog title="日志" :visible.sync="visible" width="40%" style="height: 50%;overflow-y: hidden;" :before-close="handleClose" @opened="onOpened">
    <el-table
      :data="logs"
      style="width: 100%">
      <el-table-column
        prop="content"
        label="内容"
        width="180">
      </el-table-column>
      <el-table-column
        prop="created_at"
        label="时间"
        width="180">
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
import {getVisitorLogs} from '@/api/userLog.js';
export default {
  props: {
    visible: false,
    userId:null,
    startAt:null,
    endAt:null,
  },
  data() {
    return {
      logs:[],
    };
  },
  created: function () {

  },
  methods: {
    onOpened(){
      getVisitorLogs({
        user_id:this.userId,
        start_at:this.startAt,
        end_at:this.endAt,
      }).then(response=>{

        this.logs = response.res.items;
      });
    },
    handleClose: function (){
      this.$emit('update:visible', false);
    },
  }
}
</script>

<style>
</style>
