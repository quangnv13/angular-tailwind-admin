import { DataResponse, HttpResultMetaData, PagingData } from './http';

export type ProductTypeResult = HttpResultMetaData & {
  data: {
    productCategoryId: string;
    frontImage: string;
    backImage: string;
    basePrice: number;
  };
};

export type ProductDesignData = {
  color?: string;
  designImage: string;
  designData: string;
  name?: string;
  description?: string;
  type: number;
};

export type ProductDesignCreate = {
  name: string;
  description: string;
  printPrice: number;
  productTypeId: string;
  productDesignDetails: ProductDesignData[];
};

export type Dropship = {
  dropshipPrice: number;
  productDesign: {
    productDesignDetails: ProductDesignData[];
    name: string;
    printPrice: number;
  };
};

export type ProductDesignResult = DataResponse<PagingData<ProductDesignCreate & { id: string }>>;

export type DropshipDetailResult = DataResponse<Dropship>;
