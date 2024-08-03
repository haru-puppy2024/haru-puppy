import instance from '../interceptors';
import { useQuery, QueryFunctionContext } from 'react-query';

const fetchTodos = async ({ queryKey }: QueryFunctionContext<[string, number, number, number?]>) => {
  const [_key, year, month, day] = queryKey;
  const url = day ? `/api/schedules?year=${year}&month=${month}&day=${day}` : `/api/schedules?year=${year}&month=${month}`;
  const response = await instance.get(url);
  return response.data.data;
};

export const useGetTodoScheduleAPI = (year: number, month: number, day?: number) => {
  return useQuery(['todos', year, month, day], fetchTodos, {
    onError: (error) => {
      console.error('Failed to fetch todos:', error);
    },
  });
};
