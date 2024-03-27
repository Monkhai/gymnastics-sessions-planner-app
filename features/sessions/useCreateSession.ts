import { useMutation } from '@tanstack/react-query';
import { SessionJoinTable, SessionWithOrder } from './types';
import createSession from './createSession';
import { queryClient } from '@/Providers/ReactQueryProvider';

type Args = {
  name: string;
  order: number;
  queryKey: string[];
  sessionTable: SessionJoinTable;
  parent_id: number;
};

export default () => {
  return useMutation({
    mutationFn: async ({ name, order, sessionTable, parent_id }: Args) => {
      return await createSession({ name, order, sessionTable, parent_id });
    },

    onMutate: ({ queryKey, name, order }: Args) => {
      const previousSessions: SessionWithOrder[] = queryClient.getQueryData(queryKey) || [];

      const tempId = Math.round(Math.random() * 1000);

      const newSession = {
        name,
        order,
        id: tempId,
      } as SessionWithOrder;

      const newSessions = [...previousSessions, newSession];

      queryClient.setQueryData(queryKey, newSessions);

      return {
        rollback: () => queryClient.setQueryData(queryKey, previousSessions),
        queryKey,
        session_id: newSession.id,
      };
    },

    onSuccess: (data, _, { queryKey, session_id }) => {
      const previousSessions: SessionWithOrder[] = queryClient.getQueryData(queryKey) || [];

      const newSessions = previousSessions.map((session) => {
        if (session.id === session_id) {
          return data;
        }
        return session;
      });

      queryClient.setQueryData(queryKey, newSessions);
    },

    onError: (error, _, context) => {
      console.error(error);
      if (context) {
        context.rollback();
      }
    },
  });
};
