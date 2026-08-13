import { apiClient } from '../api/client/http';

export interface ActivityLog {
  id: number;
  userId: number | null;
  action: string;
  description: string;
  method: string;
  endpoint: string;
  module: string;
  statusCode: number;
  success: boolean;
  ipAddress: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

export interface ActivityLogQuery {
  page?: number;
  limit?: number;
  userId?: number;
  action?: string;
  module?: string;
  method?: string;
  statusCode?: number;
  success?: boolean;
  startDate?: string;
  endDate?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface ActivityLogsListResponse {
  data: ActivityLog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const getActivityLogs = async (
  query: ActivityLogQuery = {},
): Promise<ActivityLogsListResponse> => {
  const result = await apiClient.getList<ActivityLog>('/activity-logs', {
    page: query.page ?? 1,
    limit: query.limit ?? 10,
    userId: query.userId,
    action: query.action,
    module: query.module,
    method: query.method,
    statusCode: query.statusCode,
    success: query.success,
    startDate: query.startDate,
    endDate: query.endDate,
    search: query.search,
    sortBy: query.sortBy ?? 'createdAt',
    sortOrder: query.sortOrder ?? 'DESC',
  });

  return {
    data: result.data,
    total: result.meta.total,
    page: result.meta.page,
    limit: result.meta.limit,
    totalPages: result.meta.totalPages,
  };
};

export const getActivityLogById = async (id: number): Promise<ActivityLog> => {
  return apiClient.get<ActivityLog>(`/activity-logs/${id}`);
};
