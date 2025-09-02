import { useRecoilValue } from 'recoil';
import { QueryKeys, dataService } from 'librechat-data-provider';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import type { QueryObserverResult, UseQueryOptions, UseInfiniteQueryOptions } from '@tanstack/react-query';
import type t from 'librechat-data-provider';
import store from '~/store';

export const useGetBannerQuery = (
  config?: UseQueryOptions<t.TBannerResponse>,
): QueryObserverResult<t.TBannerResponse> => {
  const queriesEnabled = useRecoilValue<boolean>(store.queriesEnabled);
  return useQuery<t.TBannerResponse>([QueryKeys.banner], () => dataService.getBanner(), {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    ...config,
    enabled: (config?.enabled ?? true) === true && queriesEnabled,
  });
};

export const useGetUserBalance = (
  config?: UseQueryOptions<t.TBalanceResponse>,
): QueryObserverResult<t.TBalanceResponse> => {
  const queriesEnabled = useRecoilValue<boolean>(store.queriesEnabled);
  return useQuery<t.TBalanceResponse>([QueryKeys.balance], () => dataService.getUserBalance(), {
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
    ...config,
    enabled: (config?.enabled ?? true) === true && queriesEnabled,
  });
};

export const useGetSearchEnabledQuery = (
  config?: UseQueryOptions<boolean>,
): QueryObserverResult<boolean> => {
  const queriesEnabled = useRecoilValue<boolean>(store.queriesEnabled);
  return useQuery<boolean>([QueryKeys.searchEnabled], () => dataService.getSearchEnabled(), {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    ...config,
    enabled: (config?.enabled ?? true) === true && queriesEnabled,
  });
};

export const useGetTransactionHistory = (
  page: number = 1,
  limit: number = 10,
  config?: UseQueryOptions<t.TTransactionHistoryResponse>,
): QueryObserverResult<t.TTransactionHistoryResponse> => {
  const queriesEnabled = useRecoilValue<boolean>(store.queriesEnabled);
  return useQuery<t.TTransactionHistoryResponse>(
    [QueryKeys.transactionHistory, page, limit],
    () => dataService.getTransactionHistory({ page, limit }),
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      ...config,
      enabled: (config?.enabled ?? true) === true && queriesEnabled,
    },
  );
};

export const useTransactionHistoryInfiniteQuery = (
  params: { limit?: number } = {},
  config?: UseInfiniteQueryOptions<t.TTransactionHistoryResponse, unknown>,
) => {
  const queriesEnabled = useRecoilValue<boolean>(store.queriesEnabled);
  const { limit = 20 } = params;

  return useInfiniteQuery<t.TTransactionHistoryResponse>({
    queryKey: [QueryKeys.transactionHistory, 'infinite', limit],
    queryFn: ({ pageParam = 1 }) => 
      dataService.getTransactionHistory({ page: pageParam as number, limit }),
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage;
      return page < totalPages ? page + 1 : undefined;
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    enabled: queriesEnabled,
    ...config,
  });
};

export const useGetBalanceHistory = (
  page: number = 1,
  limit: number = 10,
  config?: UseQueryOptions<any>,
): QueryObserverResult<any> => {
  const queriesEnabled = useRecoilValue<boolean>(store.queriesEnabled);
  return useQuery<any>(
    [QueryKeys.balanceHistory, page, limit],
    () => dataService.getBalanceHistory({ page, limit }),
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      ...config,
      enabled: (config?.enabled ?? true) === true && queriesEnabled,
    },
  );
};
