<template>
  <view class="invites-container">
    <view class="top-nav">
      <view class="nav-left" @click="goBack">
        <text class="back-btn">←</text>
        <text class="nav-title">通知与申请</text>
      </view>
      <text class="more-btn">⋯</text>
    </view>

    <view class="main-content">
      <view class="header-section">
        <view class="title-row">
          <text class="main-title">组队申请</text>
          <view class="new-badge" v-if="pendingCount > 0">
            <text class="new-text">{{ pendingCount }} NEW</text>
          </view>
        </view>
        <text class="sub-title">管理您的项目成员申请与发送的申请</text>
      </view>

      <view class="pending-section">
        <view class="section-header">
          <view class="section-indicator"></view>
          <text class="section-title">待处理申请</text>
        </view>

        <view v-for="(project, projectIndex) in projectApplications" :key="project.projectId" class="project-group">
          <view class="project-header-bar" @click="toggleProject(project.projectId)">
            <view class="project-title-wrapper">
              <text class="project-title-text">{{ project.projectTitle }}</text>
              <view class="applicant-count">
                <text class="count-text">{{ project.applicants.length }} 人申请</text>
              </view>
            </view>
            <text class="toggle-icon">{{ project.isExpanded ? '▼' : '▶' }}</text>
          </view>

          <view v-if="project.isExpanded" class="applicants-list">
            <view v-for="(applicant, applicantIndex) in project.applicants" :key="applicant.id" class="application-card">
              <view class="applicant-info">
                <image :src="applicant.avatar || defaultAvatar" mode="aspectFill" class="applicant-avatar" />
                <view class="applicant-details">
                  <view class="name-row">
                    <text class="applicant-name">{{ applicant.name }}</text>
                    <view class="college-tag">
                      <text class="college-text">{{ applicant.college || '默认学院' }}</text>
                    </view>
                  </view>
                  <text class="applicant-major">{{ applicant.major || '未知专业' }} · {{ applicant.grade || '未知年级' }}</text>
                  <view class="skill-tags">
                    <view class="skill-tag" v-for="(skill, skillIndex) in (applicant.skills || [])" :key="skillIndex">
                      <text class="skill-text">{{ skill }}</text>
                    </view>
                  </view>
                </view>
                <view class="online-status" v-if="applicant.online">
                  <view class="status-dot"></view>
                  <text class="status-text">在线</text>
                </view>
              </view>

              <view class="application-reason">
                <text class="reason-text">{{ applicant.reason }}</text>
              </view>

              <view class="action-buttons">
                <view class="action-btn reject" @click="rejectApplication(applicant.applicationId, project.projectId)">
                  <text class="btn-text">忽略</text>
                </view>
                <view class="action-btn accept" @click="acceptApplication(applicant.applicationId, project.projectId)">
                  <text class="btn-text">同意入队</text>
                </view>
              </view>
            </view>
          </view>
        </view>

        <view v-if="loading.pending" class="empty-state">
          <text class="empty-icon">⏳</text>
          <text class="empty-text">加载中...</text>
        </view>

        <view v-else-if="projectApplications.length === 0" class="empty-state">
          <text class="empty-icon">📭</text>
          <text class="empty-text">暂无待处理申请</text>
        </view>
      </view>

      <view class="my-applications-section">
        <view class="section-header">
          <view class="section-indicator tertiary"></view>
          <text class="section-title">我的申请</text>
        </view>

        <view v-for="(myApp, index) in myApplications" :key="index" class="my-application-card">
          <view class="my-app-project">
            <view class="project-icon-container">
              <text class="project-icon-lg">{{ myApp.project.icon }}</text>
            </view>
            <view class="my-app-details">
              <text class="my-app-title">{{ myApp.project.title }}</text>
              <text class="project-leader">负责人：{{ myApp.project.leader }}</text>
            </view>
            <view class="application-status" :class="myApp.status">
              <text class="status-text">{{ myApp.statusText }}</text>
            </view>
          </view>

          <view class="my-app-info">
            <view class="info-header">
              <text class="info-icon">📅</text>
              <text class="info-label">申请于 {{ myApp.applyDate }}</text>
            </view>
            <text class="info-content">{{ myApp.statusMessage }}</text>
          </view>
        </view>

        <view v-if="loading.myApplications" class="empty-state">
          <text class="empty-icon">⏳</text>
          <text class="empty-text">加载中...</text>
        </view>

        <view v-else-if="myApplications.length === 0" class="empty-state">
          <text class="empty-icon">📭</text>
          <text class="empty-text">暂无我的申请</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue';
import { onLoad, onShow } from '@dcloudio/uni-app';

const defaultAvatar = 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20default&image_size=square';

const projectApplications = ref([]);
const myApplications = ref([]);
const loading = ref({
  pending: false,
  myApplications: false
});

const pendingCount = computed(() => {
  return projectApplications.value.reduce((total, project) => total + project.applicants.length, 0);
});

onLoad(() => {
  const token = uni.getStorageSync('token');
  if (!token) {
    uni.navigateTo({
      url: '/pages/login/login'
    });
  }
});

onShow(async () => {
  const token = uni.getStorageSync('token');
  if (token) {
    await fetchPendingApplications();
    await fetchMyApplications();
  }
});

const fetchPendingApplications = async () => {
  try {
    loading.value.pending = true;
    const token = uni.getStorageSync('token');

    const userProjectsResponse = await uni.request({
      url: 'http://localhost:3000/api/projects/my',
      method: 'GET',
      header: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('获取用户项目响应:', userProjectsResponse.data);
    if (!userProjectsResponse.data || !userProjectsResponse.data.success) {
      projectApplications.value = [];
      return;
    }

    const userProjects = userProjectsResponse.data.data || userProjectsResponse.data || [];
    console.log('用户项目列表:', userProjects);

    const projectsWithApplications = await Promise.all(
      userProjects.map(async (project) => {
        const applicationsResponse = await uni.request({
          url: `http://localhost:3000/api/applications/project/${project.id}`,
          method: 'GET',
          header: {
            'Authorization': `Bearer ${token}`
          }
        });

        const applicants = [];

        console.log(`获取项目 ${project.id} 的申请响应:`, applicationsResponse.data);
        if (applicationsResponse.data && applicationsResponse.data.success) {
          const applications = applicationsResponse.data.data || applicationsResponse.data || [];
          console.log(`项目 ${project.id} 的申请列表:`, applications);
          applications.forEach((app) => {
            if (app.applicant) {
              const skills = typeof app.applicant.skills === 'string'
                ? JSON.parse(app.applicant.skills || '[]')
                : (app.applicant.skills || []);

              applicants.push({
                applicationId: app.id,
                id: app.applicantId,
                name: app.applicant.name || '未知用户',
                avatar: app.applicant.avatar || defaultAvatar,
                college: app.applicant.college || '默认学院',
                major: app.applicant.major || '未知专业',
                grade: '未知年级',
                skills: skills,
                online: false,
                reason: app.reasonText || '暂无申请理由'
              });
            }
          });
        }

        return {
          projectId: project.id,
          projectTitle: project.title || '未知项目',
          isExpanded: false,
          applicants: applicants
        };
      })
    );

    projectApplications.value = projectsWithApplications.filter(p => p.applicants.length > 0);
    console.log('最终项目申请列表:', projectApplications.value);

  } catch (err) {
    console.error('获取待处理申请错误:', err);
    projectApplications.value = [];
  } finally {
    loading.value.pending = false;
  }
};

const fetchMyApplications = async () => {
  try {
    loading.value.myApplications = true;
    const token = uni.getStorageSync('token');

    const response = await uni.request({
      url: 'http://localhost:3000/api/applications/my',
      method: 'GET',
      header: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.data && response.data.success) {
      const applications = response.data.data || response.data || [];
      myApplications.value = applications.map((app) => {
        let statusText = '审核中';
        let statusMessage = '您的申请已送达，正在等待团队负责人审阅。';
        let status = 'reviewing';

        if (app.status === 'accepted') {
          statusText = '已通过';
          statusMessage = '恭喜！您的申请已被批准。';
          status = 'accepted';
        } else if (app.status === 'rejected') {
          statusText = '已拒绝';
          statusMessage = '很遗憾，您的申请未被批准。';
          status = 'rejected';
        }

        const projectIcon = getProjectIcon(app.Project?.competitionType);

        return {
          id: app.id,
          project: {
            title: app.Project?.title || '未知项目',
            leader: app.Project?.creator?.name || '未知负责人',
            icon: projectIcon
          },
          status: status,
          statusText: statusText,
          applyDate: app.appliedAt ? new Date(app.appliedAt).toISOString().split('T')[0].replace(/-/g, '.') : '未知日期',
          statusMessage: statusMessage
        };
      });
    } else {
      myApplications.value = [];
    }
  } catch (err) {
    console.error('获取我的申请错误:', err);
    myApplications.value = [];
  } finally {
    loading.value.myApplications = false;
  }
};

const getProjectIcon = (competitionType) => {
  const iconMap = {
    '国家级': '🏆',
    '省级': '🥈',
    '校级': '�️',
    '互联网+': '🌐',
    '挑战杯': '💡',
    '其他': '📋'
  };
  return iconMap[competitionType] || '📋';
};

const toggleProject = (projectId) => {
  const project = projectApplications.value.find(p => p.projectId === projectId);
  if (project) {
    project.isExpanded = !project.isExpanded;
  }
};

const rejectApplication = async (applicationId, projectId) => {
  try {
    const token = uni.getStorageSync('token');
    const response = await uni.request({
      url: `http://localhost:3000/api/applications/${applicationId}/reject`,
      method: 'PUT',
      header: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.data && response.data.success) {
      uni.showToast({
        title: '已拒绝',
        icon: 'success'
      });

      const project = projectApplications.value.find(p => p.projectId === projectId);
      if (project) {
        const applicantIndex = project.applicants.findIndex(a => a.applicationId === applicationId);
        if (applicantIndex !== -1) {
          project.applicants.splice(applicantIndex, 1);
        }
        if (project.applicants.length === 0) {
          const projectIndex = projectApplications.value.findIndex(p => p.projectId === projectId);
          if (projectIndex !== -1) {
            projectApplications.value.splice(projectIndex, 1);
          }
        }
      }
    } else {
      uni.showToast({
        title: '操作失败',
        icon: 'none'
      });
    }
  } catch (err) {
    console.error('拒绝申请错误:', err);
    uni.showToast({
      title: '网络错误',
      icon: 'none'
    });
  }
};

const acceptApplication = async (applicationId, projectId) => {
  try {
    const token = uni.getStorageSync('token');
    const response = await uni.request({
      url: `http://localhost:3000/api/applications/${applicationId}/approve`,
      method: 'PUT',
      header: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.data && response.data.success) {
      uni.showToast({
        title: '已同意入队',
        icon: 'success'
      });

      const project = projectApplications.value.find(p => p.projectId === projectId);
      if (project) {
        const applicantIndex = project.applicants.findIndex(a => a.applicationId === applicationId);
        if (applicantIndex !== -1) {
          project.applicants.splice(applicantIndex, 1);
        }
        if (project.applicants.length === 0) {
          const projectIndex = projectApplications.value.findIndex(p => p.projectId === projectId);
          if (projectIndex !== -1) {
            projectApplications.value.splice(projectIndex, 1);
          }
        }
      }
    } else {
      uni.showToast({
        title: '操作失败',
        icon: 'none'
      });
    }
  } catch (err) {
    console.error('同意申请错误:', err);
    uni.showToast({
      title: '网络错误',
      icon: 'none'
    });
  }
};

const goBack = () => {
  uni.navigateBack();
};
</script>

<style scoped>
.invites-container {
  min-height: 100vh;
  background-color: #f7f9fc;
  font-family: 'PingFang SC', sans-serif;
}

.top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: #f7f9fc;
  position: sticky;
  top: 0;
  z-index: 10;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.back-btn {
  font-size: 20px;
  color: #3F8EF7;
}

.nav-title {
  font-size: 18px;
  font-weight: bold;
  color: #191c1e;
}

.more-btn {
  font-size: 20px;
  color: #3F8EF7;
}

.main-content {
  padding: 20px 16px;
  max-width: 600px;
  margin: 0 auto;
}

.header-section {
  margin-bottom: 32px;
}

.title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.main-title {
  font-size: 24px;
  font-weight: bold;
  color: #191c1e;
}

.new-badge {
  background-color: #6bfbcb;
  color: #007257;
  padding: 4px 12px;
  border-radius: 4px;
}

.new-text {
  font-size: 10px;
  font-weight: bold;
  letter-spacing: 1px;
}

.sub-title {
  font-size: 14px;
  color: #717784;
}

.pending-section {
  margin-bottom: 32px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.section-indicator {
  width: 6px;
  height: 24px;
  background-color: #005bb2;
  border-radius: 3px;
}

.section-indicator.tertiary {
  background-color: #8c4c00;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  color: #191c1e;
}

.application-card {
  background-color: #ffffff;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.applicant-info {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 16px;
}

.applicant-avatar {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  flex-shrink: 0;
}

.applicant-details {
  flex: 1;
}

.name-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.applicant-name {
  font-size: 18px;
  font-weight: bold;
  color: #191c1e;
}

.college-tag {
  background-color: rgba(0, 91, 178, 0.1);
  color: #005bb2;
  padding: 2px 8px;
  border-radius: 4px;
}

.college-text {
  font-size: 10px;
  font-weight: bold;
}

.applicant-major {
  font-size: 12px;
  color: #717784;
  margin-bottom: 8px;
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.skill-tag {
  background-color: #e6e8eb;
  color: #414753;
  padding: 2px 6px;
  border-radius: 4px;
}

.skill-text {
  font-size: 9px;
}

.online-status {
  display: flex;
  align-items: center;
  gap: 4px;
}

.status-dot {
  width: 6px;
  height: 6px;
  background-color: #006c52;
  border-radius: 50%;
  box-shadow: 0 0 4px #006c52;
}

.status-text {
  font-size: 10px;
  font-weight: bold;
  color: #006c52;
}

.project-info {
  background-color: #f2f4f7;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  position: relative;
  overflow: hidden;
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.project-tag {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #005bb2;
}

.project-icon {
  font-size: 14px;
}

.project-label {
  font-size: 10px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.application-type {
  background-color: #e6e8eb;
  color: #717784;
  padding: 2px 8px;
  border-radius: 12px;
}

.type-text {
  font-size: 10px;
}

.project-title {
  font-size: 16px;
  font-weight: bold;
  color: #191c1e;
  margin-bottom: 12px;
}

.application-reason {
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 8px;
  padding: 12px;
  position: relative;
}

.reason-text {
  font-size: 14px;
  color: #414753;
  line-height: 1.4;
  font-style: italic;
  padding-left: 8px;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.action-btn {
  flex: 1;
  padding: 12px;
  border-radius: 24px;
  text-align: center;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:active {
  transform: scale(0.95);
}

.action-btn.reject {
  background-color: transparent;
  border: 1px solid rgba(113, 119, 132, 0.15);
  color: #717784;
}

.action-btn.accept {
  background: linear-gradient(135deg, #005bb2 0%, #1173db 100%);
  color: white;
  box-shadow: 0 8px 24px rgba(0, 91, 178, 0.15);
  flex: 2;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px;
  background-color: rgba(242, 244, 247, 0.5);
  border: 2px dashed rgba(193, 198, 213, 0.3);
  border-radius: 16px;
  opacity: 0.6;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 8px;
}

.empty-text {
  font-size: 14px;
  color: #717784;
  text-align: center;
}

.project-group {
  margin-bottom: 16px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  background-color: #ffffff;
}

.project-header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background-color: #ffffff;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: all 0.2s;
}

.project-header-bar:hover {
  background-color: #f7f9fc;
}

.project-title-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.project-title-text {
  font-size: 16px;
  font-weight: bold;
  color: #191c1e;
  flex: 1;
}

.applicant-count {
  background-color: rgba(0, 91, 178, 0.1);
  color: #005bb2;
  padding: 4px 12px;
  border-radius: 12px;
}

.count-text {
  font-size: 12px;
  font-weight: medium;
}

.toggle-icon {
  font-size: 14px;
  color: #717784;
  transition: transform 0.2s;
}

.applicants-list {
  background-color: #ffffff;
  border-top: 1px solid #f0f0f0;
}

.application-card {
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 0;
  border-radius: 0;
  box-shadow: none;
}

.application-card:last-child {
  border-bottom: none;
}

.application-reason {
  background-color: #f2f4f7;
  border-radius: 8px;
  padding: 12px;
  margin: 16px 0;
  position: relative;
}

.my-applications-section {
  margin-bottom: 32px;
}

.my-application-card {
  background-color: #ffffff;
  border-radius: 16px;
  margin-bottom: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  border: 1px solid #f0f0f0;
}

.my-app-project {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
  background-color: #ffffff;
}

.project-icon-container {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background-color: #a9c7ff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.project-icon-lg {
  font-size: 24px;
}

.my-app-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.my-app-title {
  font-size: 18px;
  font-weight: bold;
  color: #191c1e;
  line-height: 1.3;
}

.project-leader {
  font-size: 14px;
  color: #717784;
  line-height: 1.4;
}

.application-status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: bold;
}

.application-status.reviewing {
  background-color: #e6e8eb;
  color: #005bb2;
}

.application-status.pending {
  background-color: #e6e8eb;
  color: #717784;
}

.application-status.accepted {
  background-color: #e6f5ec;
  color: #006c52;
}

.application-status.rejected {
  background-color: #fce8e8;
  color: #cc0000;
}

.my-app-info {
  padding: 16px 20px;
  background-color: #f2f4f7;
}

.info-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  color: #717784;
}

.info-icon {
  font-size: 14px;
}

.info-label {
  font-size: 10px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.info-content {
  font-size: 14px;
  color: #414753;
  line-height: 1.4;
}

@media (max-width: 480px) {
  .main-content {
    padding: 16px 12px;
  }

  .application-card {
    padding: 16px;
  }

  .my-app-project {
    padding: 16px;
  }

  .my-app-info {
    padding: 12px 16px;
  }
}
</style>