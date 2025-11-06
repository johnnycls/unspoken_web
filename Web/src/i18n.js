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
            supportUs: "Support Us",
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
            nameRequired: "Group name is required",
            nameTooLong: "Group name is too long",
            description: "Description",
            descriptionPlaceholder: "Enter group description",
            descriptionTooLong: "Description is too long",
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
            crushName: "Your Crush's Name",
            crushNotHasAccount: "Your crush has not registered yet",
            noGroups: "No groups yet",
            noInvitations: "No invitations",
            emailRequired: "Email is required",
            invalidEmail: "Invalid email format",
            cannotInviteSelf: "You cannot invite yourself",
            maxMembersReached: "Maximum number of members reached",
            cannotRemoveCreator: "Cannot remove the group creator",
          },
          // Crush pages
          crush: {
            title: "Crush",
            noCrushYet: "No Crush Currently",
            noCrushEntered:
              "No Crush Entered, Please Enter During Submission Period (Days 1-14).",
            updateStatus: "Update Status",
            updateCrush: "Update Crush",
            yourCrushEmail: "Your Crush Email",
            yourMessage: "Your Message",
            heLikesYouToo: "He/She Likes You Too, He/She Said:",
            heDoesntLikeYou:
              "He/She did not enter you as his/her crush. Don't be discouraged, maybe he/she just doesn't use this site, or forgot to enter a crush.",
            hasCrush: "I have a crush",
            noCrush: "I don't have a crush",
            crushEmail: "Crush Email",
            emailPlaceholder: "Enter crush email",
            message: "Message",
            messagePlaceholder: "Enter your message...",
            rules: {
              title: "How It Works",
              currentStage: "Current Stage",
              submissionPeriod: "Submission Period (Days 1-14)",
              viewingPeriod: "Viewing Period (Days 15-31)",
              days1to14: "Days 1-14: Submission Period",
              days1to14Desc:
                "You can create or update your crush and message. Your crush won't know what you wrote unless he/she enters your email in the crush field. Response messages are hidden during this period.",
              days15to31: "Days 15-31: Viewing Period",
              days15to31Desc:
                "View if your crush likes you back! Only if both sides leave messages will you see each other's messages. You cannot modify your submission during this period.",
            },
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
          // Crush messages
          invalidForm: "Please fill out the form correctly",
          fetchCrushesError: "Failed to load crushes",
          updateCrushSuccess: "Crush updated successfully",
          updateCrushError: "Failed to update crush",
          deleteCrushSuccess: "Crush deleted successfully",
          deleteCrushError: "Failed to delete crush",
          // Letter pages
          letter: {
            mailbox: "Mailbox",
            newLetter: "New Letter",
            sendFirstLetter: "Send First Letter",
            inbox: "Inbox",
            outbox: "Outbox",
            noInboxLetters: "No letters in inbox",
            noOutboxLetters: "No letters in outbox",
            selectGroup: "Group",
            selectGroupPlaceholder: "Select a group",
            selectUser: "Recipient",
            selectUserPlaceholder: "Select a recipient",
            alias: "Alias",
            aliasPlaceholder: "Your alias (sender name)",
            content: "Content",
            contentPlaceholder: "Write your letter...",
            acknowledgment:
              "I acknowledge that I can only send 2 letters per day, and cannot modify it after sending",
            cannotSendYet:
              "You have already sent 2 letters today. Please try again tomorrow.",
            sendLetter: "Send Letter",
            to: "To",
            fromGroup: "From Group",
            deletedGroup: "Deleted Group",
            sendSuccess: "Letter sent successfully",
            sendError: "Failed to send letter",
            updateReminder:
              "Letters are updated daily at 00:00 UTC and 12:00 UTC",
            reply: "Reply",
            replyPlaceholder: "Write your reply...",
            sendReply: "Send Reply",
            replySuccess: "Reply sent successfully",
            replyError: "Failed to send reply",
            repliedOn: "Replied on",
          },
          // Letter messages
          fetchLettersError: "Failed to load letters",
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
            supportUs: "支持我們",
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
            nameRequired: "羣組名稱為必填項",
            nameTooLong: "羣組名稱過長",
            description: "羣組描述",
            descriptionPlaceholder: "輸入羣組描述",
            descriptionTooLong: "羣組描述過長",
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
            emailRequired: "電子郵件地址為必填項",
            invalidEmail: "電子郵件地址格式無效",
            cannotInviteSelf: "無法邀請自己",
            maxMembersReached: "已達成員數量上限",
            cannotRemoveCreator: "無法移除羣組建立者",
          },
          // Crush pages
          crush: {
            title: "暗戀對象",
            noCrushYet: "目前沒有暗戀對象",
            noCrushEntered:
              "沒有填寫暗戀對象，如有暗戀對象，請在下次填寫期間（1-14日）填寫。",
            updateStatus: "更新狀態",
            updateCrush: "更新暗戀對象",
            yourCrushEmail: "你的暗戀對象的電子郵件",
            yourMessage: "你的留言",
            heLikesYouToo: "對方也喜歡你，他/她說：",
            heDoesntLikeYou:
              "對方沒有填寫你爲他/她的暗戀對象。不用灰心，可能他/她只是沒有使用這個網站，或是忘記了填寫暗戀對象。",
            hasCrush: "我有暗戀對象",
            noCrush: "我沒有暗戀對象",
            crushEmail: "暗戀對象電子郵件",
            emailPlaceholder: "輸入暗戀對象的電子郵件",
            crushName: "暗戀對象名稱",
            crushNotHasAccount: "對方尚未註冊帳號",
            message: "留言",
            messagePlaceholder: "輸入你的留言...",
            rules: {
              title: "使用規則",
              currentStage: "目前階段",
              submissionPeriod: "填寫期間（1-14日）",
              viewingPeriod: "查看期間（15-31日）",
              days1to14: "1-14日：填寫期間",
              days1to14Desc:
                "可以填寫或修改你的暗戀對象和留言。若對方填寫的人不是你，對方不會知道你填寫的人是誰和留言。此期間無法查看對方的回應。",
              days15to31: "15-31日：查看期間",
              days15to31Desc:
                "可以查看對方是否也喜歡你！只有雙方都給對方留言，才會看到對方的留言。此期間無法修改你的填寫內容。",
            },
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
          // Crush messages
          invalidForm: "請正確填寫表單",
          fetchCrushesError: "載入暗戀對象失敗",
          updateCrushSuccess: "暗戀對象更新成功",
          updateCrushError: "暗戀對象更新失敗",
          deleteCrushSuccess: "暗戀對象刪除成功",
          deleteCrushError: "暗戀對象刪除失敗",
          // Letter pages
          letter: {
            mailbox: "信箱",
            newLetter: "新信件",
            sendFirstLetter: "寄出第一封信",
            inbox: "收件箱",
            outbox: "寄件箱",
            noInboxLetters: "收件箱沒有信件",
            noOutboxLetters: "寄件箱沒有信件",
            selectGroup: "羣組",
            selectGroupPlaceholder: "選擇羣組",
            selectUser: "收件人",
            selectUserPlaceholder: "選擇收件人",
            alias: "別名",
            aliasPlaceholder: "你的別名（寄件人名稱）",
            content: "內容",
            contentPlaceholder: "寫下你的信件...",
            acknowledgment: "我了解每天只能寄出兩封信，且寄出後無法修改",
            cannotSendYet: "你今天已經寄出兩封信了，請明天再試。",
            sendLetter: "寄出信件",
            to: "收件人",
            fromGroup: "來自羣組",
            deletedGroup: "已刪除的羣組",
            sendSuccess: "信件寄出成功",
            sendError: "信件寄出失敗",
            updateReminder: "信件會在每天UTC時間00:00和12:00更新",
            reply: "回覆",
            replyPlaceholder: "寫下你的回覆...",
            sendReply: "寄出回覆",
            replySuccess: "回覆寄出成功",
            replyError: "回覆寄出失敗",
            repliedOn: "回覆於",
          },
          // Letter messages
          fetchLettersError: "載入信件失敗",
        },
      },
    },
  });

export default i18n;
