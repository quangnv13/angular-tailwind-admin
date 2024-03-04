import { HttpResultMetaData } from './http';

export type UploadFileResult = HttpResultMetaData & {
  data: {
    source: string;
    filePath: string;
  }[];
};

export type FileData = {
  filePath: string;
  source: string;
}

export type ImageFileListResult = HttpResultMetaData & {
  data: string[];
}
