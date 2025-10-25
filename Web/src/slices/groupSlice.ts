import { apiSlice } from "./apiSlice";

export type Group = {
  id: string;
  name: string;
  description: string;
  creatorEmail: string;
  memberEmails: string[];
  invitedEmails: string[];
};

type CreateGroupRequest = {
  name: string;
  description?: string;
  invitedEmails?: string[];
};

type CreateGroupResponse = {
  id: string;
  message: string;
};

type UpdateGroupRequest = {
  groupId: string;
  name?: string;
  description?: string;
  memberEmails?: string[];
  invitedEmails?: string[];
};

type UpdateGroupResponse = {
  message: string;
};

type GroupInvitationRequest = {
  id: string;
  isAccept: boolean;
};

type GroupInvitationResponse = {
  message: string;
};

type LeaveGroupRequest = {
  groupId: string;
};

type LeaveGroupResponse = {
  message: string;
};

type DeleteGroupRequest = {
  groupId: string;
};

type DeleteGroupResponse = {
  message: string;
};

const groupSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getGroups: builder.query<Group[], void>({
      query: () => ({
        url: "group/",
      }),
      providesTags: ["Group"],
    }),
    createGroup: builder.mutation<CreateGroupResponse, CreateGroupRequest>({
      query: (groupData) => ({
        url: "group/",
        method: "POST",
        body: groupData,
      }),
      invalidatesTags: ["Group"],
    }),
    updateGroup: builder.mutation<UpdateGroupResponse, UpdateGroupRequest>({
      query: ({ ...groupData }) => ({
        url: `group`,
        method: "PATCH",
        body: { ...groupData },
      }),
      invalidatesTags: ["Group"],
    }),
    respondToInvitation: builder.mutation<
      GroupInvitationResponse,
      GroupInvitationRequest
    >({
      query: (invitationData) => ({
        url: "group/invitation",
        method: "POST",
        body: invitationData,
      }),
      invalidatesTags: ["Group"],
    }),
    leaveGroup: builder.mutation<LeaveGroupResponse, LeaveGroupRequest>({
      query: ({ groupId }) => ({
        url: `leave`,
        method: "POST",
        body: { groupId },
      }),
      invalidatesTags: ["Group"],
    }),
    deleteGroup: builder.mutation<DeleteGroupResponse, DeleteGroupRequest>({
      query: ({ groupId }) => ({
        url: `group`,
        method: "DELETE",
        body: { groupId },
      }),
      invalidatesTags: ["Group"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetGroupsQuery,
  useCreateGroupMutation,
  useUpdateGroupMutation,
  useRespondToInvitationMutation,
  useLeaveGroupMutation,
  useDeleteGroupMutation,
} = groupSlice;
