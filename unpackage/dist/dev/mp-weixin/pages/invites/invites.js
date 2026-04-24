"use strict";
const common_vendor = require("../../common/vendor.js");
const defaultAvatar = "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20default&image_size=square";
const _sfc_main = {
  __name: "invites",
  setup(__props) {
    const projectApplications = common_vendor.ref([]);
    const myApplications = common_vendor.ref([]);
    const loading = common_vendor.ref({
      pending: false,
      myApplications: false
    });
    const pendingCount = common_vendor.computed(() => {
      return projectApplications.value.reduce((total, project) => total + project.applicants.length, 0);
    });
    common_vendor.onLoad(() => {
      const token = common_vendor.index.getStorageSync("token");
      if (!token) {
        common_vendor.index.navigateTo({
          url: "/pages/login/login"
        });
      }
    });
    common_vendor.onShow(async () => {
      const token = common_vendor.index.getStorageSync("token");
      if (token) {
        await fetchPendingApplications();
        await fetchMyApplications();
      }
    });
    const fetchPendingApplications = async () => {
      try {
        loading.value.pending = true;
        const token = common_vendor.index.getStorageSync("token");
        const userProjectsResponse = await common_vendor.index.request({
          url: "http://localhost:3000/api/projects/my",
          method: "GET",
          header: {
            "Authorization": `Bearer ${token}`
          }
        });
        common_vendor.index.__f__("log", "at pages/invites/invites.vue:180", "获取用户项目响应:", userProjectsResponse.data);
        if (!userProjectsResponse.data || !userProjectsResponse.data.success) {
          projectApplications.value = [];
          return;
        }
        const userProjects = userProjectsResponse.data.data || userProjectsResponse.data || [];
        common_vendor.index.__f__("log", "at pages/invites/invites.vue:187", "用户项目列表:", userProjects);
        const projectsWithApplications = await Promise.all(
          userProjects.map(async (project) => {
            const applicationsResponse = await common_vendor.index.request({
              url: `http://localhost:3000/api/applications/project/${project.id}`,
              method: "GET",
              header: {
                "Authorization": `Bearer ${token}`
              }
            });
            const applicants = [];
            common_vendor.index.__f__("log", "at pages/invites/invites.vue:201", `获取项目 ${project.id} 的申请响应:`, applicationsResponse.data);
            if (applicationsResponse.data && applicationsResponse.data.success) {
              const applications = applicationsResponse.data.data || applicationsResponse.data || [];
              common_vendor.index.__f__("log", "at pages/invites/invites.vue:204", `项目 ${project.id} 的申请列表:`, applications);
              applications.forEach((app) => {
                if (app.applicant) {
                  const skills = typeof app.applicant.skills === "string" ? JSON.parse(app.applicant.skills || "[]") : app.applicant.skills || [];
                  applicants.push({
                    applicationId: app.id,
                    id: app.applicantId,
                    name: app.applicant.name || "未知用户",
                    avatar: app.applicant.avatar || defaultAvatar,
                    college: app.applicant.college || "默认学院",
                    major: app.applicant.major || "未知专业",
                    grade: "未知年级",
                    skills,
                    online: false,
                    reason: app.reasonText || "暂无申请理由"
                  });
                }
              });
            }
            return {
              projectId: project.id,
              projectTitle: project.title || "未知项目",
              isExpanded: false,
              applicants
            };
          })
        );
        projectApplications.value = projectsWithApplications.filter((p) => p.applicants.length > 0);
        common_vendor.index.__f__("log", "at pages/invites/invites.vue:237", "最终项目申请列表:", projectApplications.value);
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/invites/invites.vue:240", "获取待处理申请错误:", err);
        projectApplications.value = [];
      } finally {
        loading.value.pending = false;
      }
    };
    const fetchMyApplications = async () => {
      try {
        loading.value.myApplications = true;
        const token = common_vendor.index.getStorageSync("token");
        const response = await common_vendor.index.request({
          url: "http://localhost:3000/api/applications/my",
          method: "GET",
          header: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (response.data && response.data.success) {
          const applications = response.data.data || response.data || [];
          myApplications.value = applications.map((app) => {
            var _a, _b, _c, _d;
            let statusText = "审核中";
            let statusMessage = "您的申请已送达，正在等待团队负责人审阅。";
            let status = "reviewing";
            if (app.status === "accepted") {
              statusText = "已通过";
              statusMessage = "恭喜！您的申请已被批准。";
              status = "accepted";
            } else if (app.status === "rejected") {
              statusText = "已拒绝";
              statusMessage = "很遗憾，您的申请未被批准。";
              status = "rejected";
            }
            const projectIcon = getProjectIcon((_a = app.Project) == null ? void 0 : _a.competitionType);
            return {
              id: app.id,
              project: {
                title: ((_b = app.Project) == null ? void 0 : _b.title) || "未知项目",
                leader: ((_d = (_c = app.Project) == null ? void 0 : _c.creator) == null ? void 0 : _d.name) || "未知负责人",
                icon: projectIcon
              },
              status,
              statusText,
              applyDate: app.appliedAt ? new Date(app.appliedAt).toISOString().split("T")[0].replace(/-/g, ".") : "未知日期",
              statusMessage
            };
          });
        } else {
          myApplications.value = [];
        }
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/invites/invites.vue:296", "获取我的申请错误:", err);
        myApplications.value = [];
      } finally {
        loading.value.myApplications = false;
      }
    };
    const getProjectIcon = (competitionType) => {
      const iconMap = {
        "国家级": "🏆",
        "省级": "🥈",
        "校级": "�️",
        "互联网+": "🌐",
        "挑战杯": "💡",
        "其他": "📋"
      };
      return iconMap[competitionType] || "📋";
    };
    const toggleProject = (projectId) => {
      const project = projectApplications.value.find((p) => p.projectId === projectId);
      if (project) {
        project.isExpanded = !project.isExpanded;
      }
    };
    const rejectApplication = async (applicationId, projectId) => {
      try {
        const token = common_vendor.index.getStorageSync("token");
        const response = await common_vendor.index.request({
          url: `http://localhost:3000/api/applications/${applicationId}/reject`,
          method: "PUT",
          header: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (response.data && response.data.success) {
          common_vendor.index.showToast({
            title: "已拒绝",
            icon: "success"
          });
          const project = projectApplications.value.find((p) => p.projectId === projectId);
          if (project) {
            const applicantIndex = project.applicants.findIndex((a) => a.applicationId === applicationId);
            if (applicantIndex !== -1) {
              project.applicants.splice(applicantIndex, 1);
            }
            if (project.applicants.length === 0) {
              const projectIndex = projectApplications.value.findIndex((p) => p.projectId === projectId);
              if (projectIndex !== -1) {
                projectApplications.value.splice(projectIndex, 1);
              }
            }
          }
        } else {
          common_vendor.index.showToast({
            title: "操作失败",
            icon: "none"
          });
        }
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/invites/invites.vue:359", "拒绝申请错误:", err);
        common_vendor.index.showToast({
          title: "网络错误",
          icon: "none"
        });
      }
    };
    const acceptApplication = async (applicationId, projectId) => {
      try {
        const token = common_vendor.index.getStorageSync("token");
        const response = await common_vendor.index.request({
          url: `http://localhost:3000/api/applications/${applicationId}/approve`,
          method: "PUT",
          header: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (response.data && response.data.success) {
          common_vendor.index.showToast({
            title: "已同意入队",
            icon: "success"
          });
          const project = projectApplications.value.find((p) => p.projectId === projectId);
          if (project) {
            const applicantIndex = project.applicants.findIndex((a) => a.applicationId === applicationId);
            if (applicantIndex !== -1) {
              project.applicants.splice(applicantIndex, 1);
            }
            if (project.applicants.length === 0) {
              const projectIndex = projectApplications.value.findIndex((p) => p.projectId === projectId);
              if (projectIndex !== -1) {
                projectApplications.value.splice(projectIndex, 1);
              }
            }
          }
        } else {
          common_vendor.index.showToast({
            title: "操作失败",
            icon: "none"
          });
        }
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/invites/invites.vue:404", "同意申请错误:", err);
        common_vendor.index.showToast({
          title: "网络错误",
          icon: "none"
        });
      }
    };
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(goBack, "5e"),
        b: pendingCount.value > 0
      }, pendingCount.value > 0 ? {
        c: common_vendor.t(pendingCount.value)
      } : {}, {
        d: common_vendor.f(projectApplications.value, (project, projectIndex, i0) => {
          return common_vendor.e({
            a: common_vendor.t(project.projectTitle),
            b: common_vendor.t(project.applicants.length),
            c: common_vendor.t(project.isExpanded ? "▼" : "▶"),
            d: common_vendor.o(($event) => toggleProject(project.projectId), project.projectId),
            e: project.isExpanded
          }, project.isExpanded ? {
            f: common_vendor.f(project.applicants, (applicant, applicantIndex, i1) => {
              return common_vendor.e({
                a: applicant.avatar || defaultAvatar,
                b: common_vendor.t(applicant.name),
                c: common_vendor.t(applicant.college || "默认学院"),
                d: common_vendor.t(applicant.major || "未知专业"),
                e: common_vendor.t(applicant.grade || "未知年级"),
                f: common_vendor.f(applicant.skills || [], (skill, skillIndex, i2) => {
                  return {
                    a: common_vendor.t(skill),
                    b: skillIndex
                  };
                }),
                g: applicant.online
              }, applicant.online ? {} : {}, {
                h: common_vendor.t(applicant.reason),
                i: common_vendor.o(($event) => rejectApplication(applicant.applicationId, project.projectId), applicant.id),
                j: common_vendor.o(($event) => acceptApplication(applicant.applicationId, project.projectId), applicant.id),
                k: applicant.id
              });
            })
          } : {}, {
            g: project.projectId
          });
        }),
        e: loading.value.pending
      }, loading.value.pending ? {} : projectApplications.value.length === 0 ? {} : {}, {
        f: projectApplications.value.length === 0,
        g: common_vendor.f(myApplications.value, (myApp, index, i0) => {
          return {
            a: common_vendor.t(myApp.project.icon),
            b: common_vendor.t(myApp.project.title),
            c: common_vendor.t(myApp.project.leader),
            d: common_vendor.t(myApp.statusText),
            e: common_vendor.n(myApp.status),
            f: common_vendor.t(myApp.applyDate),
            g: common_vendor.t(myApp.statusMessage),
            h: index
          };
        }),
        h: loading.value.myApplications
      }, loading.value.myApplications ? {} : myApplications.value.length === 0 ? {} : {}, {
        i: myApplications.value.length === 0
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-f8373498"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/invites/invites.js.map
