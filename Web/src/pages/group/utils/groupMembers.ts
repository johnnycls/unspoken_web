import { Member } from "../utils/types";

type GroupMembersProps = {
  creatorEmail: string;
  memberEmails: string[];
  invitedEmails: string[];
};

export const groupMembers = ({
  creatorEmail,
  memberEmails,
  invitedEmails,
}: GroupMembersProps): Member[] => {
  return [
    ...memberEmails.map((email) => ({
      email,
      role: email === creatorEmail ? ("creator" as const) : ("member" as const),
    })),
    ...invitedEmails.map((email) => ({
      email,
      role: "invited" as const,
    })),
  ];
};

export default groupMembers;
