<template>
  <div class="dashboard">
    <h2 style="margin-bottom: 20px;">数据统计</h2>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover" class="stats-card">
          <div class="stats-content">
            <el-icon class="stats-icon"><user /></el-icon>
            <div>
              <div class="stats-number">{{ stats.users || 0 }}</div>
              <div class="stats-label">用户总数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stats-card">
          <div class="stats-content">
            <el-icon class="stats-icon"><document /></el-icon>
            <div>
              <div class="stats-number">{{ stats.competitions || 0 }}</div>
              <div class="stats-label">竞赛总数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stats-card">
          <div class="stats-content">
            <el-icon class="stats-icon"><message /></el-icon>
            <div>
              <div class="stats-number">{{ stats.projects || 0 }}</div>
              <div class="stats-label">组队帖子</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stats-card">
          <div class="stats-content">
            <el-icon class="stats-icon"><star /></el-icon>
            <div>
              <div class="stats-number">{{ stats.talents || 0 }}</div>
              <div class="stats-label">人才档案</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <div style="margin-top: 30px; display: flex; gap: 20px;">
      <el-card shadow="hover" style="flex: 1;">
        <template #header>
          <div class="card-header">
            <span>竞赛类型分布</span>
          </div>
        </template>
        <div id="competitionChart" style="width: 100%; height: 300px;"></div>
      </el-card>
    </div>

    <div style="margin-top: 30px; display: flex; gap: 20px;">
      <el-card shadow="hover" style="flex: 1;">
        <template #header>
          <div class="card-header">
            <span>学生技能分布</span>
          </div>
        </template>
        <div id="skillsChart" style="width: 100%; height: 300px;"></div>
      </el-card>
      <el-card shadow="hover" style="flex: 1;">
        <template #header>
          <div class="card-header">
            <span>竞赛活跃趋势</span>
          </div>
        </template>
        <div id="competitionTrendChart" style="width: 100%; height: 300px;"></div>
      </el-card>
    </div>

    <el-card shadow="hover" style="margin-top: 30px;">
      <template #header>
        <div class="card-header">
          <span>最新活动</span>
        </div>
      </template>
      <el-table :data="latestActivities" style="width: 100%">
        <el-table-column prop="time" label="时间" width="180" />
        <el-table-column prop="type" label="类型" width="100" />
        <el-table-column prop="content" label="内容" />
        <el-table-column prop="user" label="用户" width="120" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import * as echarts from 'echarts'
import { User, Document, Message, Star } from '@element-plus/icons-vue'
import { getDashboardData } from '../api'

const stats = ref({
  users: 100,
  competitions: 50,
  projects: 50,
  talents: 69
})

const latestActivities = ref([
  { time: '2026-04-25 10:00', type: '用户', content: '新用户注册', user: '用户100' },
  { time: '2026-04-25 09:30', type: '竞赛', content: '发布新竞赛', user: '用户50' },
  { time: '2026-04-25 08:15', type: '组队', content: '创建组队帖子', user: '用户30' },
  { time: '2026-04-24 16:45', type: '人才', content: '创建人才档案', user: '用户25' }
])

let competitionChart = null
let skillsChart = null
let competitionTrendChart = null

const initCharts = () => {
  // 竞赛类型分布图
  competitionChart = echarts.init(document.getElementById('competitionChart'))
  competitionChart.setOption({
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [{
      name: '竞赛类型',
      type: 'pie',
      radius: '60%',
      data: [
        { value: 15, name: '创新创业' },
        { value: 12, name: '学科竞赛' },
        { value: 10, name: '技能大赛' },
        { value: 8, name: '艺术设计' },
        { value: 5, name: '科研项目' }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  })

  // 学生技能分布
  skillsChart = echarts.init(document.getElementById('skillsChart'))
  const skillsData = [
    { name: '前端开发', value: 35 },
    { name: '后端开发', value: 30 },
    { name: '移动开发', value: 25 },
    { name: 'UI设计', value: 20 },
    { name: '数据分析', value: 18 },
    { name: '人工智能', value: 15 },
    { name: '机器学习', value: 12 },
    { name: '算法', value: 10 }
  ]
  skillsChart.setOption({
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value'
    },
    yAxis: {
      type: 'category',
      data: skillsData.map(item => item.name),
      axisLabel: {
        interval: 0,
        rotate: 0
      }
    },
    series: [{
      name: '技能掌握人数',
      type: 'bar',
      data: skillsData.map(item => item.value),
      itemStyle: {
        color: function (params) {
          const colors = ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399', '#722ED1', '#13C2C2', '#FAAD14']
          return colors[params.dataIndex % colors.length]
        }
      }
    }]
  })

  // 竞赛活跃趋势
  competitionTrendChart = echarts.init(document.getElementById('competitionTrendChart'))
  competitionTrendChart.setOption({
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月']
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      data: [5, 8, 12, 15, 10, 15],
      type: 'bar',
      itemStyle: {
        color: '#409EFF'
      }
    }]
  })
}

const loadDashboardData = async () => {
  try {
    // 实际调用 API
    // const response = await getDashboardData()
    // if (response.success) {
    //   stats.value = response.data
    // }
  } catch (error) {
    console.error('加载数据失败:', error)
  }
}

onMounted(() => {
  loadDashboardData()
  initCharts()
  
  // 监听窗口 resize
  window.addEventListener('resize', () => {
    competitionChart?.resize()
    skillsChart?.resize()
    competitionTrendChart?.resize()
  })
})
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.stats-card {
  height: 120px;
}

.stats-content {
  display: flex;
  align-items: center;
  height: 100%;
}

.stats-icon {
  font-size: 40px;
  color: #1890ff;
  margin-right: 20px;
}

.stats-number {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
}

.stats-label {
  font-size: 14px;
  color: #606266;
  margin-top: 4px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>