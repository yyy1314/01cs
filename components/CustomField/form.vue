<template>
  <div v-show="show">
    <el-form-item label="自定义字段">
      <el-checkbox-group v-model="formFieldIds" @change="onSelectChange">
        <el-checkbox v-for="(field,fdk) in fields" :label="field.id">{{field.name}}</el-checkbox>
      </el-checkbox-group>
    </el-form-item>

    <el-form-item v-for="(formField,fkey) in formFields" :label="formField.name">
      <el-input v-if="formField.type == 'text'" v-model="formField.value" @change="onChange()" :placeholder="getPlaceholder(formField)"></el-input>
      <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 6 }" v-else-if="formField.type == 'textarea'" v-model="formField.value" @change="onChange()" :placeholder="getPlaceholder(formField)"></el-input>
      <el-radio-group v-else-if="formField.type == 'radio'" v-model="formField.value" @change="onChange()" :placeholder="getPlaceholder(formField)">
        <el-radio v-for="option in formField.options" :label="option"></el-radio>
      </el-radio-group>
      <el-checkbox-group v-else-if="formField.type == 'checkbox'" v-model="formField.value" @change="onChange()" :placeholder="getPlaceholder(formField)">
        <el-checkbox v-for="option in formField.options" :label="option"></el-checkbox>
      </el-checkbox-group>
      <el-select v-else-if="formField.type == 'select'" v-model="formField.value" @change="onChange()" :placeholder="getPlaceholder(formField)">
        <el-option v-for="option in formField.options" :label="option" :value="option"></el-option>
      </el-select>
    </el-form-item>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination';
import {getCustomFields} from '@/api/customField.js';
const collect = require('collect.js');
export default {
  props: {
    customFields: {
      type:Array,
      require:false,
      default(){
        return [];
      },
    },
    category: {
      type:String,
      require:true,
      default:'',
    },
  },
  components: {Pagination},
  data() {
    return {
      show:true,
      fields:[],
      formFieldIds:[],
      formFields:[],
      custom_fields:[],
    }
  },
  watch: {
    customFields:function(val){
      this.formFieldIds = collect(this.customFields).pluck('custom_field_id').all();
      this.onSelectChange();
    }
  },
  computed: {

  },
  created: function () {
    getCustomFields({
      category:this.category,
      page:1,
      per_page:100,
    }).then(response=>{
      this.fields = response.res.items;
      if(this.fields.length == 0){
        this.show = false;
      }
      this.onSelectChange();
    });
  },
  methods: {
    getPlaceholder(formField){
      let txt = '';
      if(formField.is_required){
        txt += '必填,';
      }else{
        txt += '选填,';
      }
      txt += formField.description;
      return txt;
    },
    onSelectChange(){
      this.formFields = collect(this.fields).whereIn('id',this.formFieldIds).map(item=>{
        return Object.assign({},item);
      }).all();
      this.formFields = collect(this.formFields).map(item=>{
        let itemV = collect(this.customFields).where('custom_field_id',item.id).first();
        if(itemV){
          item.value = itemV.value;
        }else{
          if(item.type == 'checkbox'){
            item.value = [];
          }else{
            item.value = null;
          }
        }
        return Object.assign({},item);
      }).all();
      this.onChange();
    },
    onChange(){
       this.custom_fields = [];
       collect(this.formFields).each((item,index) => {
         this.custom_fields[index] = {
           id:item.id,value:item.value
         };
       });
       this.$emit('change', this.custom_fields);
    }
  }

}
</script>

<style scoped>
  .input-width{width:100%}
</style>
