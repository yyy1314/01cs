<template>
  <div class="" style="overflow: auto;height: 700px;">
    <el-timeline>
      <el-timeline-item :timestamp="item.created_at" placement="top" v-for="(item,index) in items" :key="index">
        <el-card>
          <h4>{{item.admin.name}} {{ item.title }}</h4>
          <p>{{ item.content }}</p>
          
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>

export default {
	props: {
    items: {
      type: Array,
      default: function() {
        return [];
      },
    }
	},
  data() {
    return {

    };
  },
  created() {

  },
  methods: {

  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
