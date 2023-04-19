<template>
  <div class="h-100" style="overflow: auto;">
    <div class="">
      <div class="py-1 d-flex j-end"><el-button type="success" size="small" @click="openCard(null,null)">添加联系人</el-button></div>
      <el-table :data="items" style="width: 100%" max-height="450">
        <el-table-column prop="name" label="姓名"></el-table-column>
        <el-table-column prop="position" label="职务" ></el-table-column>
        <el-table-column prop="sex" label="性别" ></el-table-column>
        <el-table-column prop="mobile" label="手机号" :formatter="formatter"></el-table-column>
        <el-table-column prop="qq" label="qq" ></el-table-column>
        <el-table-column prop="wechat" label="微信" ></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="remarks" label="备注" ></el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button @click.native.prevent="openCard(scope.$index, scope.row)" type="text" size="small">编辑</el-button>
            <el-button @click.native.prevent="deleteRow(scope.$index, scope.row)" type="text" size="small">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="">
      <card :cardShow="show" cardName="添加联系人" @closeCard="closeCard">
        <div class="p-1 d-flex flex-wrap a-center j-sb">


          <div class="p-1" style="width: 48%;">
            <div class="d-flex flex-column">
              <div class="">姓名:</div>
              <div class="pt-1"><el-input v-model="form.name" placeholder="必填,2-4字" size="small"></el-input></div>
            </div>
          </div>
          <div class="p-1" style="width: 48%;">
            <div class="d-flex flex-column">
              <div class="">职务:</div>
              <div class="pt-1"><el-input v-model="form.position" placeholder="必填,2-15字" size="small"></el-input></div>
            </div>
          </div>
          <div class="p-1" style="width: 48%;">
            <div class="d-flex flex-column">
              <div class="">手机:</div>
              <div class="pt-1"><el-input v-model="form.mobile" placeholder="必填" size="small"></el-input></div>
            </div>
          </div>
          <div class="p-1" style="width: 48%;">
            <div class="d-flex flex-column">
              <div class="">性别:</div>
              <div class="pt-1">
                <el-select v-model="form.sex" placeholder="请选择" size="small" style="width: 100%;">
                  <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </div>
            </div>
          </div>
          <div class="p-1" style="width: 48%;">
            <div class="d-flex flex-column">
              <div class="">省市区:</div>
              <div class="pt-1">
                 <location-select v-model="region" :level="3" placeholder="必填,请选择"></location-select>
              </div>
            </div>
          </div>
          <div class="p-1" style="width: 48%;">
            <div class="d-flex flex-column">
              <div class="">详细地址:</div>
              <div class="pt-1"><el-input v-model="form.address" placeholder="选填,60字以内" size="small"></el-input></div>
            </div>
          </div>
          <div class="p-1" style="width: 48%;">
            <div class="d-flex flex-column">
              <div class="">详细地址(原):</div>
              <div class="pt-1"><el-input placeholder="选填,60字以内" v-model="form.old_address"></el-input></div>
            </div>
          </div>
          <div class="p-1" style="width: 48%;">
            <div class="d-flex flex-column">
              <div class="">电子邮件:</div>
              <div class="pt-1"><el-input v-model="form.email" placeholder="选填" size="small"></el-input></div>
            </div>
          </div>
          <div class="p-1" style="width: 48%;">
            <div class="d-flex flex-column">
              <div class="">微信:</div>
              <div class="pt-1"><el-input v-model="form.wechat" placeholder="选填" size="small"></el-input></div>
            </div>
          </div>
          <div class="p-1" style="width: 48%;">
            <div class="d-flex flex-column">
              <div class="">QQ:</div>
              <div class="pt-1"><el-input v-model="form.qq" placeholder="选填" size="small"></el-input></div>
            </div>
          </div>

        </div>

        <div class="p-2">
          <div class="">备注:</div>
          <div class="pt-1"><el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="form.remarks"></el-input></div>
        </div>
        <div class="px-2 pb-1 d-flex j-end"><el-button type="success" size="small" @click="addRelationFn">确定</el-button></div>
      </card>
    </div>
  </div>
</template>

<script>
import { opportunityDetails, addRelation , deleteContact } from '../../api/enterprisepublish.js';
import card from '../card/card.vue';
import LocationSelect from '@/components/LocationSelect.vue';
export default {
  components: {
    card,LocationSelect
  },
  props: {
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
    isFollowUp: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      tableData: [],
      region: [],  //
      show: false,
      options: [
        {
          value: 1,
          label: '男'
        },
        {
          value: 2,
          label: '女'
        }
      ],
      form: {
        id: null,
        sex: '',
        name: '',
        mobile:'',
        province_code: null,
        city_code: null,
        area_code: null,
        address: '',
        old_address: '',
        position:'',
        email:'',
        qq:'',
        wechat:'',
        remarks: ''
      }
    };
  },
  created() {


  },
  watch: {
    region: function (newRegion, oldRegion) {
      Object.assign(this.form,{
        province_code:newRegion[0],
        city_code:newRegion[1],
        area_code:newRegion[2],
      });
    }
  },
  methods: {
    formatter(row, column, cellValue, index){
      if(!this.isFollowUp){
        return '******';
      }else{
        return cellValue;
      }
    },

    deleteRow(index, row) {

      if(!this.isFollowUp){
        this.$message({
          showClose: true,
          message: "只有跟进人才能删除"
        });
        return;
      }

      deleteContact({
        id:this.id,user_id:row.id
      }).then(e=>{
        if(e.code == 200){
           this.$message({
              showClose: true,
              message: '删除成功',
              type: 'success'
            });
            this.closeCard();
            this.$emit('contactUpdated');
        } else {
            this.$message({
              showClose: true,
              message: res.msg
            });
        }
      });
    },
    closeCard() {
      this.show = false;
    },
    openCard(index, row) {

      if(!this.isFollowUp){
        this.$message({
          showClose: true,
          message: "只有跟进人才能编辑"
        });
        return;
      }

      this.show = true;
      if(row){
         Object.assign(this.form,{
           id: row.id,
           sex: row.sex,
           name: row.name,
           position: row.position,
           mobile:row.mobile,
           province_code: row.province ? row.province.code : null,
           city_code: row.city ? row.city.code : null,
           area_code: row.area ? row.area.code : null,
           address: row.address,
           old_address: row.old_address,
           email:row.email,
           qq:row.qq,
           wechat:row.wechat,
           remarks: row.remarks
         });
         this.region = [this.form.province_code,this.form.city_code,this.form.area_code];
      }else{
         Object.assign(this.form,{
          id: null,
          sex: '',
          name: '',
          mobile:'',
          province_code: null,
          city_code: null,
          area_code: null,
          address: '',
          old_address: '',
          position:'',
          email:'',
          qq:'',
          wechat:'',
          remarks: ''
         });
      }
    },
    addRelationFn(){
      addRelation({
        member_unit_id:this.id,
        ...this.form
      }).then(res=>{
          if (res.code == 200) {
            this.$message({
              showClose: true,
              message: '发布成功',
              type: 'success'
            });
            this.closeCard();
            this.$emit('contactUpdated');
          } else {
            this.$message({
              showClose: true,
              message: res.msg
            });
          }
      })
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
