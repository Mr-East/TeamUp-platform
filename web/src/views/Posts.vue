<template>
  <div class="posts">
    <div class="page-header">
      <h2>求组队帖子管理</h2>
    </div>

    <el-card shadow="hover" style="margin-bottom: 20px;">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="用户名">
          <el-input v-model="searchForm.title" placeholder="请输入用户名" style="width: 200px;" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" style="width: 120px;">
            <el-option label="活跃" value="active" />
            <el-option label="已关闭" value="closed" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="hover">
      <el-table :data="talents" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="用户名" width="120">
          <template #default="scope">
            {{ scope.row.name || '未知' }}
          </template>
        </el-table-column>
        <el-table-column prop="bio" label="简介" width="200" />
        <el-table-column prop="targetTrack" label="意向赛道" width="150" />
        <el-table-column prop="skills" label="技能标签">
          <template #default="scope">
            <el-tag size="small" v-for="(skill, index) in scope.row.skills" :key="index" style="margin-right: 4px;">
              {{ skill }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'active' ? 'success' : 'danger'">
              {{ scope.row.status === 'active' ? '活跃' : '已关闭' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button type="primary" size="small" @click="toggleTalentStatus(scope.row)">
              {{ scope.row.status === 'active' ? '关闭' : '开启' }}
            </el-button>
            <!-- <el-button type="danger" size="small" @click="handleDelete(scope.row.id)">
              删除
            </el-button> -->
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination" style="margin-top: 20px;">
        <el-pagination
          v-model:current-page="pagination.current"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getTalentProfiles, deleteTalentProfile, toggleTalentProfileStatus } from '../api'

const talents = ref([])
const searchForm = reactive({
  title: '',
  status: ''
})
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0
})

const loadTalents = async () => {
  try {
    // 实际调用 API
    const response = await getTalentProfiles({
      page: pagination.current,
      limit: pagination.pageSize,
      name: searchForm.title,
      status: searchForm.status
    })
    if (response.success) {
      talents.value = response.data.talents
      pagination.total = response.data.total
    }
  } catch (error) {
    console.error('加载求组队帖子失败:', error)
    ElMessage.error('加载求组队帖子失败')
  }
}

const handleSearch = () => {
  pagination.current = 1
  loadTalents()
}

const resetSearch = () => {
  searchForm.title = ''
  searchForm.status = ''
  pagination.current = 1
  loadTalents()
}

const handleSizeChange = (size) => {
  pagination.pageSize = size
  loadTalents()
}

const handleCurrentChange = (current) => {
  pagination.current = current
  loadTalents()
}

const toggleTalentStatus = async (row) => {
  try {
    await ElMessageBox.confirm(`确定要${row.status === 'active' ? '关闭' : '开启'}这个求组队帖子吗？`, '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const response = await toggleTalentProfileStatus(row.id)
    if (response.success) {
      row.status = row.status === 'active' ? 'closed' : 'active'
      ElMessage.success(`${row.status === 'active' ? '开启' : '关闭'}成功`)
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('操作失败:', error)
      ElMessage.error('操作失败')
    }
  }
}

const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除这个求组队帖子吗？', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const response = await deleteTalentProfile(id)
    if (response.success) {
      ElMessage.success('删除成功')
      loadTalents()
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

onMounted(() => {
  loadTalents()
})
</script>

<style scoped>
.posts {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
}

.search-form {
  margin: 0;
}

.pagination {
  display: flex;
  justify-content: flex-end;
}
</style>