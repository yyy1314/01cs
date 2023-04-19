<template>
  <div class="login-container">

    <el-form :inline="true" :model="query">
      <el-form-item>
        <el-input
          v-model="query.keyword"
          placeholder="请输入标题,内容"
          style="width: 160px;"
          class="filter-item"
        />
      </el-form-item>
      <el-form-item>
        <el-select v-model="query.dynamic_category_id" clearable placeholder="分类">
          <el-option
            v-for="item in dynamicCategories"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
      </el-form-item>
    </el-form>

    <el-table  :data="dataList" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column align="center" label="标题">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="内容">
        <template slot-scope="scope">
          {{ scope.row.content }}
        </template>
      </el-table-column>


      <el-table-column align="center" label="发布时间">
        <template slot-scope="scope">
          {{ scope.row.created_at }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          {{ showStatus(scope.row.status) }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="是否显示">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.display == 1" active-color="#13ce66" inactive-color="#ff4949" @change="switchChange(scope.row)"></el-switch>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="openDetail(scope.row.id)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>


    <pagination :total="total" :page.sync="pageIndex" :limit.sync="pageSize" @pagination="handleFilter" />


    <el-dialog
            :visible.sync="detailDisplay"
            :close-on-click-modal="false"
            title="动态详情"
            width="600px"
            center
    >
     <div class="merchantsDetails p-5">
        <div class="list p-5">
            <div class="listTitle">标题：</div>
            <div class="listText">{{ tabledata.title }}</div>
        </div>
        <div class="list p-5">
            <div class="listTitle">内容：</div>
            <div class="listText">{{ tabledata.content }}</div>
        </div>
        <div class="list p-5">
            <div class="listTitle">状态：</div>
            <div class="listText">{{ tabledata.status }}</div>
        </div>
        <div class="list p-5">
            <div class="listTitle">时间：</div>
            <div class="listText">{{ tabledata.created_at }}</div>
        </div>
       <div class="list p-5">
            <div class="listTitle">图片：</div>
            <div class="listText d-flex" v-for="item in  tabledata.images"><img :src="item.image_url" style="max-width: 150px;"></div>
        </div>
     </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination';
import { dynamicList, dynamicCategories, dynamicAudit, switchOpen,dynamicParticulars } from '../../api/dynamic.js';
import { Message } from 'element-ui';

export default {
  components: {Pagination},
  data() {
    return {
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      query: {
        keyword: null,
        dynamic_category_id: null,
        status: null,
        display: null
      },
      dynamicCategories: [{
        id:null,name:'全部分类'
      }],
      dataList: [],
      detailDisplay:false,
      tabledata:{},
      statusMap:{1:'待审核',2:'通过',3:'不通过'}
    };
  },
  created() {
    dynamicCategories().then(e => {
      console.log(e.res);
        this.dynamicCategories.push(...e.res);
    });
    this.init();
  },
  methods: {
    init() {
      dynamicList({
        keyword: this.query.keyword,
        dynamic_category_id: this.query.dynamic_category_id,
        status: null,
        display: null,
        per_page: this.pageSize,
        page: this.pageIndex,
      }).then(res => {
        if (res.code == 200) {
          this.dataList = res.res.items;
          this.total = res.res.total;
        }
      });
    },
    showStatus(status){
        switch (status) {
            case 1:
                return '待审核'
                break;
            case 2:
                return '通过'
                break;
            case 3:
                return '不通过'
                break;
            default:
                return '其他'
        }
    },
    // 分页
    handleFilter: function(e) {
      this.pageSize = e.limit;
      this.init();
    },
    handleSearch: function(e){
      this.pageIndex = 1;
      this.init();
    },
    switchChange(row) {
      let display = row.display == 1 ? 2 : 1;
      switchOpen({
        dynamic_id: row.id,
        display: display
      }).then(res => {
        if (res.code == 200){
          row.display = display;
        }
      });
    },
    openDetail(id){
      dynamicParticulars({
        id:id
      }).then(res=>{
        if(res.code == 200){
          this.tabledata = res.res
        }
      })
      this.detailDisplay = true;
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .merchantsDetails{
        .list{
            display: flex;
            font-size: 14px;
            line-height: 22px;
            padding:10px 0;
            color:#333333;
            .listTitle{
                width:130px;
                text-align: right;
                padding-right: 10px;
            };
            .listText{
                flex:1;
            };
            .listText.publicityPicture{
                display: flex;
                .imgList{
                    width:60px;
                    margin-right:10px;
                }
            };
            .listText.issuerWrap{
                display: flex;
                .imgWrap{
                    img{
                        width:50px;
                        height:50px;
                        border-radius: 50%;
                    }
                };
                .rightText{
                    padding-left:10px;
                    .nameWrap{
                        padding-bottom:6px;
                    }
                }
            };
            .listText .listMain{
                .miTitle{
                    display: inline-block;
                    width:80px;
                    text-align-last: justify;
                    padding-right: 20px;
                };
                .price{
                    color:#FF3300;
                }
            }
        }
    }
</style>
