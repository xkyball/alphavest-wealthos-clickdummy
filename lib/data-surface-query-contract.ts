export type DataSurfaceSortDirection = "asc" | "desc";
export type DataSurfaceSourceTruth = "backend_query_backed";

export type DataSurfaceQueryConfig<TSortKey extends string> = {
  allowedSortKeys: readonly TSortKey[];
  defaultPageSize?: number;
  defaultSortDirection?: DataSurfaceSortDirection;
  defaultSortKey: TSortKey;
  maxPageSize?: number;
  maxQueryLength?: number;
};

export type DataSurfaceQuery<TSortKey extends string> = {
  page: number;
  pageSize: number;
  q: string;
  sortDirection: DataSurfaceSortDirection;
  sortKey: TSortKey;
};

export type BackendDataSurfaceMeta<TSortKey extends string = string> = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  page: number;
  pageSize: number;
  query: string;
  returnedRows: number;
  sortDirection: DataSurfaceSortDirection;
  sortKey: TSortKey;
  sourceTruth: DataSurfaceSourceTruth;
  totalPages: number;
  totalRows: number;
};

const defaultPageSize = 10;
const defaultMaxPageSize = 50;
const defaultMaxQueryLength = 80;

function parsePositiveInteger(value: string | null, fallback: number) {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function parseDataSurfaceQuery<TSortKey extends string>(
  searchParams: URLSearchParams,
  config: DataSurfaceQueryConfig<TSortKey>,
): DataSurfaceQuery<TSortKey> {
  const maxPageSize = config.maxPageSize ?? defaultMaxPageSize;
  const rawPageSize = parsePositiveInteger(searchParams.get("pageSize"), config.defaultPageSize ?? defaultPageSize);
  const sortKey = searchParams.get("sortKey");
  const legacySort = searchParams.get("sort");
  const allowedSortKey = config.allowedSortKeys.find((key) => key === sortKey || key === legacySort);
  const direction = searchParams.get("sortDirection");
  const query = (searchParams.get("q") ?? "").trim().slice(0, config.maxQueryLength ?? defaultMaxQueryLength);

  return {
    page: parsePositiveInteger(searchParams.get("page"), 1),
    pageSize: Math.min(Math.max(rawPageSize, 1), maxPageSize),
    q: query,
    sortDirection: direction === "asc" || direction === "desc" ? direction : config.defaultSortDirection ?? "asc",
    sortKey: allowedSortKey ?? config.defaultSortKey,
  };
}

export function allowedDataSurfaceFilter<TValue extends string>(
  searchParams: URLSearchParams,
  key: string,
  allowedValues: readonly TValue[],
  fallback: TValue,
) {
  const value = searchParams.get(key);
  return allowedValues.find((candidate) => candidate === value) ?? fallback;
}

export function compareDataSurfaceValues(
  left: unknown,
  right: unknown,
  direction: DataSurfaceSortDirection,
) {
  const result = String(left ?? "").localeCompare(String(right ?? ""), "en", {
    numeric: true,
    sensitivity: "base",
  });

  return direction === "desc" ? -result : result;
}

export function sortDataSurfaceRows<T, TSortKey extends string>(
  rows: T[],
  query: DataSurfaceQuery<TSortKey>,
  valueFor: (row: T, sortKey: TSortKey) => unknown,
) {
  return [...rows].sort((left, right) =>
    compareDataSurfaceValues(valueFor(left, query.sortKey), valueFor(right, query.sortKey), query.sortDirection),
  );
}

export function paginateDataSurfaceRows<T, TSortKey extends string>(
  rows: T[],
  query: DataSurfaceQuery<TSortKey>,
) {
  const start = (query.page - 1) * query.pageSize;
  const end = start + query.pageSize;
  const pageRows = rows.slice(start, end);
  const totalPages = Math.max(1, Math.ceil(rows.length / query.pageSize));

  return {
    meta: {
      hasNextPage: query.page < totalPages,
      hasPreviousPage: query.page > 1,
      page: query.page,
      pageSize: query.pageSize,
      query: query.q,
      returnedRows: pageRows.length,
      sortDirection: query.sortDirection,
      sortKey: query.sortKey,
      sourceTruth: "backend_query_backed" as const,
      totalPages,
      totalRows: rows.length,
    } satisfies BackendDataSurfaceMeta<TSortKey>,
    rows: pageRows,
  };
}
