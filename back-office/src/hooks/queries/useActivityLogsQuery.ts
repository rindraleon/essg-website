import { useQuery } from '@tanstack/react-query';
import {
  getActivityLogById,
  getActivityLogs,
  type ActivityLogQuery,
} from '../../services/activity-logs.service';
import { queryKeys } from './keys';

export function useActivityLogsQuery(query: ActivityLogQuery) {
  return useQuery({
    queryKey: queryKeys.activityLogs.list(query),
    queryFn: () => getActivityLogs(query),
  });
}

export function useActivityLogQuery(id: number | null) {
  return useQuery({
    queryKey: queryKeys.activityLogs.detail(id ?? 0),
    queryFn: () => getActivityLogById(id as number),
    enabled: typeof id === 'number' && id > 0,
  });
}
