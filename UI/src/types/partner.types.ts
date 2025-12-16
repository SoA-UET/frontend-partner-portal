export interface PartnerInfo {
  partner_id?: string;
  name: string;
  api_key?: string;
  core_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PartnerInfoResponse {
  status: string;
  data: PartnerInfo;
}

export interface UpdatePartnerInfoRequest {
  partner_id?: string;
  name?: string;
  api_key?: string;
  core_url?: string;
}

export interface CoreConnectionTestRequest {
  core_url: string;
  api_key: string;
}

export interface CoreConnectionTestResponse {
  status: string;
  message: {
    partner_id: string;
  };
}

export interface ApiErrorResponse {
  status: string;
  message: string;
}
