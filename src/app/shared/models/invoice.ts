import { HttpResultMetaData } from './http';

export type InvoiceDetail = {
  itemId: string;
  itemName: string;
  quantity: number;
  totalPrice: number;
};

export type InvoiceResult = {
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  paymentMethod: number;
  status: number;
  type: number;
  code: string;
  ward: string;
  district: string;
  province: string;
  shipAddress: string;
  carrier: string;
  shipStatus: number;
  sequence: number;
  createdDate: string;
  invoiceDetails: InvoiceDetail[];
};

export type InvoiceCreate = HttpResultMetaData & {
  email: string;
  fullName: string;
  phoneNumber: string;
  ward: string;
  district: string;
  province: string;
  type: number;
  shipAddress: string;
  carrier?: string;
  paymentMethod: number;
  invoiceDetails: InvoiceDetail[];
};

export type InvoiceCreateResult = HttpResultMetaData & {
  data: string;
};
