export type Ward = {
  name_with_type: string;
};

export type District = {
  name_with_type: string;
  'xa-phuong': {
    [key: string]: Ward;
  };
};

export type Province = {
  name_with_type: string;
  'quan-huyen': {
    [key: string]: District;
  };
};
