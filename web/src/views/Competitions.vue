<template>
  <div class="competitions">
    <div class="page-header">
      <h2>竞赛管理</h2>
      <el-button type="primary" @click="openCreateDialog">
        <el-icon><plus /></el-icon>
        新增竞赛
      </el-button>
    </div>

    <el-card shadow="hover" style="margin-bottom: 20px;">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="项目标题">
          <el-input v-model="searchForm.title" placeholder="请输入项目标题" style="width: 200px;" />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="searchForm.type" placeholder="请选择类型" style="width: 150px;">
            <el-option label="创新创业" value="创新创业" />
            <el-option label="学科竞赛" value="学科竞赛" />
            <el-option label="技能大赛" value="技能大赛" />
            <el-option label="艺术设计" value="艺术设计" />
            <el-option label="科研项目" value="科研项目" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="hover">
      <el-table :data="competitions" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="competitionName" label="竞赛名称" />
        <el-table-column prop="competitionType" label="类型" width="120" />
        <el-table-column prop="deadline" label="截止日期" width="180">
          <template #default="scope">
            {{ new Date(scope.row.deadline).toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column prop="peopleNeeded" label="需求人数" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'active' ? 'success' : 'danger'">
              {{ scope.row.status === 'active' ? '进行中' : '已关闭' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdByName" label="创建人" width="120" />
        <el-table-column prop="created_at" label="创建时间" width="180" />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button type="primary" size="small" @click="openEditDialog(scope.row)">
              编辑
            </el-button>
            <el-button type="danger" size="small" @click="handleDelete(scope.row.id)">
              删除
            </el-button>
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

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'create' ? '新增竞赛' : '编辑竞赛'"
      width="600px"
    >
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="项目标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入项目标题" />
        </el-form-item>
        <el-form-item label="竞赛名称" prop="competitionName">
          <el-input v-model="form.competitionName" placeholder="请输入竞赛名称" />
        </el-form-item>
        <el-form-item label="竞赛类型" prop="competitionType">
          <el-select v-model="form.competitionType" placeholder="请选择竞赛类型">
            <el-option label="创新创业" value="创新创业" />
            <el-option label="学科竞赛" value="学科竞赛" />
            <el-option label="技能大赛" value="技能大赛" />
            <el-option label="艺术设计" value="艺术设计" />
            <el-option label="科研项目" value="科研项目" />
          </el-select>
        </el-form-item>
        <el-form-item label="截止日期" prop="deadline">
          <el-date-picker
            v-model="form.deadline"
            type="datetime"
            placeholder="请选择截止日期"
            style="width: 100%;"
          />
        </el-form-item>
        <el-form-item label="需求人数" prop="peopleNeeded">
          <el-input-number v-model="form.peopleNeeded" :min="1" :max="100" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch v-model="form.status" active-value="active" inactive-value="closed" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" type="textarea" placeholder="请输入竞赛描述" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getProjects, createProject, updateProject, deleteProject } from '../api'

const competitions = ref([])
const searchForm = reactive({
  title: '',
  type: ''
})
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0
})

const dialogVisible = ref(false)
const dialogType = ref('create')
const formRef = ref(null)
const form = reactive({
  title: '',
  competitionName: '',
  competitionType: '',
  deadline: '',
  peopleNeeded: 1,
  status: 'active',
  description: ''
})

const rules = {
  title: [{ required: true, message: '请输入项目标题', trigger: 'blur' }],
  competitionName: [{ required: true, message: '请输入竞赛名称', trigger: 'blur' }],
  competitionType: [{ required: true, message: '请选择竞赛类型', trigger: 'change' }],
  deadline: [{ required: true, message: '请选择截止日期', trigger: 'change' }],
  peopleNeeded: [{ required: true, message: '请输入需求人数', trigger: 'blur' }]
}

const loadCompetitions = async () => {
  try {
    const response = await getProjects({
      page: pagination.current,
      limit: pagination.pageSize,
      title: searchForm.title,
      competitionType: searchForm.type
    })
    if (response.success) {
      competitions.value = response.data.projects
      pagination.total = response.data.total
    }
  } catch (error) {
    console.error('加载竞赛失败:', error)
    ElMessage.error('加载竞赛失败')
  }
}

const handleSearch = () => {
  pagination.current = 1
  loadCompetitions()
}

const resetSearch = () => {
  searchForm.title = ''
  searchForm.type = ''
  pagination.current = 1
  loadCompetitions()
}

const handleSizeChange = (size) => {
  pagination.pageSize = size
  loadCompetitions()
}

const handleCurrentChange = (current) => {
  pagination.current = current
  loadCompetitions()
}

const openCreateDialog = () => {
  dialogType.value = 'create'
  Object.assign(form, {
    title: '',
    competitionName: '',
    competitionType: '',
    deadline: '',
    peopleNeeded: 1,
    status: 'active',
    description: ''
  })
  dialogVisible.value = true
}

const openEditDialog = (row) => {
  dialogType.value = 'edit'
  Object.assign(form, row)
  dialogVisible.value = true
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (dialogType.value === 'create') {
          // 实际调用 API（使用项目创建接口）
          const response = await createProject(form)
          if (response.success) {
            ElMessage.success('创建成功')
            dialogVisible.value = false
            loadCompetitions()
          }
        } else {
          // 实际调用 API（使用项目更新接口）
          const response = await updateProject(form.id, form)
          if (response.success) {
            ElMessage.success('更新成功')
            dialogVisible.value = false
            loadCompetitions()
          }
        }
      } catch (error) {
        console.error('操作失败:', error)
        ElMessage.error('操作失败')
      }
    }
  })
}

const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除这个竞赛吗？', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    // 实际调用 API（使用项目删除接口）
    const response = await deleteProject(id)
    if (response.success) {
      ElMessage.success('删除成功')
      loadCompetitions()
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

onMounted(() => {
  loadCompetitions()
})
</script>

<style scoped>
.competitions {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-form {
  margin: 0;
}

.pagination {
  display: flex;
  justify-content: flex-end;
}

.dialog-footer {
  width: 100%;
  display: flex;
  justify-content: flex-end;
}
</style>
