<template>
  <div>
    <el-dialog
      :visible.sync="cDialogVisible"
      :title="dialogTitle"
      :close-on-click-modal="false"
      style="width: 100%"
      top="50px"
      append-to-body
    >
      <el-input
        v-model="query.keyword"
        placeholder="输入关键字搜索"
        style="width:300px;float: right;"
        class="input-with-select"
      >
        <el-button slot="append" icon="el-icon-search" @click="handleSearch"/>
      </el-input>
      <el-table
        v-loading="grid.listLoading"
        ref="multipleTable"
        :data="grid.list"
        element-loading-text="Loading"
        fit
        highlight-current-row
        @select="handleSelect"
      >
        <el-table-column type="selection" width="55"/>
        <el-table-column align="center" label="序列" width="65">
          <template slot-scope="scope">{{ scope.$index+1 }}</template>
        </el-table-column>
        <el-table-column align="left" label="标题">
          <template slot-scope="scope">{{ scope.row.title }}</template>
        </el-table-column>
      </el-table>
      <pagination
        :total="grid.total"
        :border="false"
        :page.sync="query.pageIndex"
        :limit.sync="query.pageSize"
        @pagination="handleFilter"
      />
      <div slot="footer" class="dialog-footer">
        <el-button icon="el-icon-close" @click="cDialogVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { SearchArticleAsync } from '@/api/Article'
import Pagination from '@/components/Pagination'
export default {
  components: { Pagination },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    dialogTitle: {
      type: String,
      default: ''
    },
    select: {
      type: Function,
      default: guid => {}
    },
    value: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      query: { keyword: null, pageIndex: 1, pageSize: 10 },
      grid: {
        listLoading: false,
        total: 0,
        list: []
      }
    }
  },
  computed: {
    cDialogVisible: {
      get() {
        return this.dialogVisible
      },
      set(val) {
        this.$emit('update:dialogVisible', val)
      }
    },
    cValue: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('update:value', val)
      }
    }
  },
  watch: {},

  created() {
    // this.handleFilter();
  },
  methods: {
    handleFilter() {
      var t = this
      t.grid.listLoading = true
      SearchArticleAsync(t.query).then(
        response => {
          t.grid.list = response.data.currentPage
          t.grid.total = response.data.total
          setTimeout(() => {
            t.grid.listLoading = false
          }, 200)
          this.$nextTick(function() {
            this.checked() // 每次更新了数据，触发这个函数即可。
          })
        },
        error => {
          t.grid.listLoading = false
        }
      )
    },
    // 搜索
    handleSearch() {
      this.query.pageIndex = 1
      this.handleFilter()
    },
    handleSelect(selection, row) {
      const guid = row.articleGuid
      var list = this.cValue || []
      const selected = selection.length && selection.indexOf(row) !== -1
      if (selected) {
        list.push(guid)
      } else {
        var index = list.indexOf(guid)
        if (index > -1) {
          list.splice(index, 1)
        }
      }
      this.cValue = list
      if (this.select) this.select(guid, selected)
    },
    checked() {
      var t = this
      t.cValue = t.cValue || []
      t.grid.list.forEach(item => {
        if (t.cValue.includes(item.articleGuid)) {
          t.$refs.multipleTable.toggleRowSelection(item, true)
        }
      })
    }
  }
}
</script>

