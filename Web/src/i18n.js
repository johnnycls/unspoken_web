import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  // load translation using http -> see /public/locales (i.e. https://github.com/i18next/react-i18next/tree/master/example/react/public/locales)
  // learn more: https://github.com/i18next/i18next-http-backend
  // want your translations to be loaded from a professional CDN? => https://github.com/locize/react-tutorial#step-2---use-the-locize-cdn
  .use(Backend)
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    fallbackLng: "zh",
    debug: true,

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },

    resources: {
      en: {
        translation: {
          // Common
          common: {
            cancel: "Cancel",
            save: "Save",
            confirm: "Confirm",
            add: "Add",
            edit: "Edit",
            required: "is required",
          },
          // Settings page
          settings: {
            title: "Settings",
            email: "Email Address",
            displayName: "Display Name",
            displayNameLabel: "Enter your display name",
            displayNamePlaceholder: "Your display name",
            language: "Language",
            languageLabel: "Select your preferred language",
            languagePlaceholder: "Select language",
            logout: "Logout",
          },
          // Group pages
          groups: {
            title: "Groups",
            joined: "Joined Groups",
            invited: "Invited Groups",
            detail: "Group Detail",
            create: "Create Group",
            edit: "Edit Group",
            name: "Group Name",
            namePlaceholder: "Enter group name",
            description: "Description",
            descriptionPlaceholder: "Enter group description",
            members: "Members",
            memberCount: "{{count}}/{{max}}",
            memberName: "Name",
            memberEmail: "Email",
            role: "Role",
            roleCreator: "Creator",
            roleMember: "Member",
            roleInvited: "Invited",
            acceptInvitation: "Accept Invitation",
            declineInvitation: "Decline Invitation",
            leaveGroup: "Leave Group",
            transferOwner: "Transfer Owner",
            deleteGroup: "Delete Group",
            removeMember: "Remove Member",
            addMember: "Add Member",
            addMemberSuccess: "Member added",
            emailPlaceholder: "Enter email address",
            noGroups: "No groups yet",
            noInvitations: "No invitations",
          },
          // Profile update messages
          updateProfileSuccess: "Profile updated successfully",
          updateProfileError: "Failed to update profile",
          fetchProfileError: "Failed to load profile",
          // Group messages
          fetchGroupsError: "Failed to load groups",
          createGroupSuccess: "Group created successfully",
          createGroupError: "Failed to create group",
          updateGroupSuccess: "Group updated successfully",
          updateGroupError: "Failed to update group",
          deleteGroupSuccess: "Group deleted successfully",
          deleteGroupError: "Failed to delete group",
          updateInvitationSuccess: "Invitation updated successfully",
          updateInvitationError: "Failed to update invitation",
          leaveGroupSuccess: "Left group successfully",
          leaveGroupError: "Failed to leave group",
          memberNotFound: "Member not found",
          memberAlreadyInGroup: "Member already in group",
          invalidEmail: "Invalid email address",
        },
      },
      zh: {
        translation: {
          // Common
          common: {
            cancel: "取消",
            save: "儲存",
            confirm: "確認",
            add: "新增",
            edit: "編輯",
            required: "為必填項",
          },
          // Settings page
          settings: {
            title: "設定",
            email: "電子郵件地址",
            displayName: "顯示名稱",
            displayNameLabel: "輸入你的顯示名稱",
            displayNamePlaceholder: "你的顯示名稱",
            language: "語言",
            languageLabel: "選擇你的偏好語言",
            languagePlaceholder: "選擇語言",
            logout: "登出",
          },
          // Group pages
          groups: {
            title: "羣組",
            joined: "已加入的羣組",
            invited: "被邀請的羣組",
            detail: "羣組詳情",
            create: "建立羣組",
            edit: "編輯羣組",
            name: "羣組名稱",
            namePlaceholder: "輸入羣組名稱",
            description: "羣組描述",
            descriptionPlaceholder: "輸入羣組描述",
            members: "成員",
            memberCount: "{{count}}/{{max}}",
            memberName: "名稱",
            memberEmail: "電子郵件",
            role: "身份",
            roleCreator: "建立者",
            roleMember: "成員",
            roleInvited: "已邀請",
            acceptInvitation: "接受邀請",
            declineInvitation: "拒絕邀請",
            leaveGroup: "離開羣組",
            transferOwner: "轉移擁有者",
            deleteGroup: "刪除羣組",
            removeMember: "移除成員",
            addMember: "新增成員",
            addMemberSuccess: "已新增成員",
            emailPlaceholder: "輸入電子郵件地址",
            noGroups: "尚無羣組",
            noInvitations: "尚無邀請",
          },
          // Profile update messages
          updateProfileSuccess: "個人資料更新成功",
          updateProfileError: "個人資料更新失敗",
          fetchProfileError: "載入個人資料失敗",
          // Group messages
          fetchGroupsError: "載入羣組失敗",
          createGroupSuccess: "羣組建立成功",
          createGroupError: "羣組建立失敗",
          updateGroupSuccess: "羣組更新成功",
          updateGroupError: "羣組更新失敗",
          deleteGroupSuccess: "羣組刪除成功",
          deleteGroupError: "羣組刪除失敗",
          updateInvitationSuccess: "邀請已更新",
          updateInvitationError: "更新邀請失敗",
          leaveGroupSuccess: "已離開羣組",
          leaveGroupError: "離開羣組失敗",
          memberNotFound: "找不到該成員",
          memberAlreadyInGroup: "該成員已在羣組中",
          invalidEmail: "無效的電子郵件地址",
        },
      },
    },
  });

export default i18n;
