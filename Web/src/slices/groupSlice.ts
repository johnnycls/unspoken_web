import { apiSlice } from "./apiSlice";
import {
  validateName,
  validateDescription,
  validateInvitedEmails,
  validateEmailArray,
  validateObjectId,
  validateTotalGroupSize,
} from "../utils/validation";
import { MAX_TOTAL_MEMBERS } from "../config";

export type Group = {
  id: string;
  name: string;
  description: string;
  creatorEmail: string;
  memberEmails: string[];
  invitedEmails: string[];
};

const groupSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getGroups: builder.query<Group[], void>({
      query: () => ({
        url: "group/",
      }),
      providesTags: ["Group"],
    }),
    createGroup: builder.mutation<
      {
        id: string;
        message: string;
      },
      {
        name: string;
        description?: string;
        invitedEmails?: string[];
      }
    >({
      query: (groupData) => {
        // Validate name
        const nameValidation = validateName(groupData.name);
        if (!nameValidation.valid) {
          throw new Error(nameValidation.error);
        }

        // Validate description if provided
        if (groupData.description) {
          const descValidation = validateDescription(groupData.description);
          if (!descValidation.valid) {
            throw new Error(descValidation.error);
          }
        }

        // Validate invited emails if provided
        if (groupData.invitedEmails && groupData.invitedEmails.length > 0) {
          const emailValidation = validateInvitedEmails(
            groupData.invitedEmails
          );
          if (!emailValidation.valid) {
            throw new Error(emailValidation.error);
          }
        }

        return {
          url: "group/",
          method: "POST",
          body: groupData,
        };
      },
      invalidatesTags: ["Group"],
    }),
    updateGroup: builder.mutation<
      {
        message: string;
      },
      {
        groupId: string;
        name?: string;
        description?: string;
        memberEmails?: string[];
        invitedEmails?: string[];
      }
    >({
      query: ({ ...groupData }) => {
        // Validate groupId
        if (!validateObjectId(groupData.groupId)) {
          throw new Error("Invalid group ID format");
        }

        // Validate name if provided
        if (groupData.name !== undefined) {
          const nameValidation = validateName(groupData.name);
          if (!nameValidation.valid) {
            throw new Error(nameValidation.error);
          }
        }

        // Validate description if provided
        if (groupData.description !== undefined) {
          const descValidation = validateDescription(groupData.description);
          if (!descValidation.valid) {
            throw new Error(descValidation.error);
          }
        }

        // Validate member emails if provided
        if (groupData.memberEmails !== undefined) {
          const memberValidation = validateEmailArray(
            groupData.memberEmails,
            MAX_TOTAL_MEMBERS
          );
          if (!memberValidation.valid) {
            throw new Error(memberValidation.error);
          }
        }

        // Validate invited emails if provided
        if (groupData.invitedEmails !== undefined) {
          const invitedValidation = validateEmailArray(
            groupData.invitedEmails,
            MAX_TOTAL_MEMBERS
          );
          if (!invitedValidation.valid) {
            throw new Error(invitedValidation.error);
          }
        }

        // Validate total group size if both are provided
        if (
          groupData.memberEmails !== undefined &&
          groupData.invitedEmails !== undefined
        ) {
          const totalValidation = validateTotalGroupSize(
            groupData.memberEmails.length,
            groupData.invitedEmails.length
          );
          if (!totalValidation.valid) {
            throw new Error(totalValidation.error);
          }
        }

        return {
          url: `group`,
          method: "PATCH",
          body: { ...groupData },
        };
      },
      invalidatesTags: ["Group"],
    }),
    respondToInvitation: builder.mutation<
      {
        message: string;
      },
      {
        id: string;
        isAccept: boolean;
      }
    >({
      query: (invitationData) => {
        // Validate group ID
        if (!validateObjectId(invitationData.id)) {
          throw new Error("Invalid group ID format");
        }

        return {
          url: "group/invitation",
          method: "POST",
          body: invitationData,
        };
      },
      invalidatesTags: ["Group"],
    }),
    leaveGroup: builder.mutation<
      {
        message: string;
      },
      {
        groupId: string;
      }
    >({
      query: ({ groupId }) => {
        // Validate group ID
        if (!validateObjectId(groupId)) {
          throw new Error("Invalid group ID format");
        }

        return {
          url: `group/leave`,
          method: "POST",
          body: { groupId },
        };
      },
      invalidatesTags: ["Group"],
    }),
    deleteGroup: builder.mutation<
      {
        message: string;
      },
      {
        groupId: string;
      }
    >({
      query: ({ groupId }) => {
        // Validate group ID
        if (!validateObjectId(groupId)) {
          throw new Error("Invalid group ID format");
        }

        return {
          url: `group`,
          method: "DELETE",
          body: { groupId },
        };
      },
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
