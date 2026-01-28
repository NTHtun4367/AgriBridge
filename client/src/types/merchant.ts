export interface NRCImage {
  url: string;
}

export interface MerchantInfo {
  _id: string;
  businessName: string;
  businessPhone: string;
  phone: string;
  nrcRegion?: string;
  nrcTownship?: string;
  nrcType?: string;
  nrcNumber?: string;
  nrcFrontImage?: NRCImage;
  nrcBackImage?: NRCImage;
}
