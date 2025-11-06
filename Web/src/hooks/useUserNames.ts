import { useEffect } from "react";
import { useAppSelector } from "../app/store";
import { useLazyGetUsersByEmailsQuery } from "../slices/userSlice";

type UseUserNamesResult = {
  userNames: { [email: string]: string };
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
  lazyFetch: (emails: string[]) => Promise<{ [email: string]: string }>;
};

export const useUserNames = (emails: string[]): UseUserNamesResult => {
  const cache = useAppSelector((state) => state.userNamesCache.cache);
  const [fetchUserNames, { isLoading, isError }] =
    useLazyGetUsersByEmailsQuery();

  const refetch = () => {
    if (emails.length > 0) {
      fetchUserNames({ emails }, true);
    }
  };

  const fetch = async (emailsToFetch: string[]) => {
    const uncachedEmails = emailsToFetch.filter((email) => !(email in cache));

    if (uncachedEmails.length > 0) {
      const usernames = await fetchUserNames(
        { emails: uncachedEmails },
        true
      ).unwrap();

      const filtered = emailsToFetch.reduce((acc, email) => {
        if (email in usernames) {
          acc[email] = usernames[email];
        }
        return acc;
      }, {} as { [email: string]: string });
      return filtered;
    }
    return emailsToFetch.reduce((acc, email) => {
      if (email in cache) {
        acc[email] = cache[email];
      }
      return acc;
    }, {} as { [email: string]: string });
  };

  useEffect(() => {
    fetch(emails);
  }, [emails.join(",")]);

  return {
    userNames: cache,
    isLoading,
    isError,
    refetch,
    lazyFetch: fetch,
  };
};
