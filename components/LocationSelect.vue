<template>
    <el-cascader :props="locations" :separator="' '" :value="address" :placeholder="placeholder" @change="onChange"></el-cascader>
</template>

<script>
  import { getProvince, getCity, getArea } from '@/api/enterprise.js';
  const collect = require('collect.js');
  export default {
    model: {
      prop: 'address',
      event: 'change'
    },
    props: {
      address:Array,
      level:{
        type:Number,
        required:false,
        default:3
      },
      placeholder:{
        type:String,
        required:false,
        default: '请选择'
      }
    },
    data: function () {
      return {
        locations: {
          lazy: true,
          lazyLoad: this.loadArea
        },
      }
    },
    created(){

    },
    methods: {
      loadArea: function(node, resolve) {
        let that = this;
        const { level } = node;
        let nodes = [];
        setTimeout(() => {
          if(level == 0 && level < this.level){
            getProvince({}).then(e => {
                collect(e.res).each((item,index)=>{
                  nodes.push({
                    value: item.code,
                    label: item.name,
                    leaf: level + 1 >= this.level,
                  });
                });
                resolve(nodes);
            });
          }else if(level == 1 && level < this.level){
            getCity({province_code:node.value}).then(e => {
                collect(e.res).each((item,index)=>{
                  nodes.push({
                    value: item.code,
                    label: item.name,
                    leaf: level + 1 >= this.level,
                  });
                });
                resolve(nodes);
            });
          }else if(level == 2 && level < this.level){
            getArea({city_code:node.value}).then(e => {
                collect(e.res).each((item,index)=>{
                  nodes.push({
                    value: item.code,
                    label: item.name,
                    leaf: level + 1 >= this.level,
                  });
                });
                resolve(nodes);
            });
          }

        }, 100);
      },
      onChange(e){
        this.$emit("change",e);
      }
    }
  }
</script>

<style scoped></style>
