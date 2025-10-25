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
    { email: creatorEmail, role: "creator" as const },
    ...memberEmails
      .filter((email) => email !== creatorEmail)
      .map((email) => ({
        email,
        role: "member" as const,
      })),
    ...invitedEmails.map((email) => ({
      email,
      role: "invited" as const,
    })),
  ];
};

export default groupMembers;
