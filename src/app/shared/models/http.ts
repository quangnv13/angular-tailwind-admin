export enum EHttpCodeResult {
  SUCCESS = 'General-Success',
  INTERNAL_SERVER_ERROR = 'InternalServerError',
  NOT_SUCCESS = 'Not-Success',
}

export type HttpResultMetaData = {
  code: EHttpCodeResult;
  message: string;
};

export type PagingOptions = {
  pageNumber: number;
  pageSize: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
};

export type PagingData<T> = {
  pageData: T[];
  pageInfo: {
    totalItemsCount: number;
  };
};

export type DataResponse<T> = {
  metadata: HttpResultMetaData;
  data: T;
};

export type PagingDataResponse<T> = {
  metadata: HttpResultMetaData;
  data: PagingData<T>;
};
