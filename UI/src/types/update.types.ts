// Types for S12 - Partner Knowledge Update Service (H29)

export type UpdateType = 'new_entries' | 'modifications' | 'corrections';

export type Priority = 'high' | 'normal' | 'low';

export type UpdateStatus = 'draft' | 'submitted' | 'validating' | 'approved' | 'rejected';

// Form data for creating update
export interface UpdateFormData {
  source: string;
  update_name: string;
  update_type: UpdateType;
  priority: Priority;
  notes: string;
}

// Update object
export interface Update {
  id: string;
  update_name: string;
  source: string;
  update_type: UpdateType;
  priority: Priority;
  entry_count: number;
  seaweed_file_id: string;
  created_at: string;
  created_by: string;
  status: UpdateStatus;
  notes?: string;
  submitted_at?: string;
  validated_at?: string;
  rejected_at?: string;
  updated_locally_at?: string;
}

// Response when listing updates
export interface GetUpdatesResponse {
  status: 'success';
  updates: Update[];
}

// Response when getting specific update
export interface GetUpdateResponse {
  status: 'success';
  update: Update;
}

// Response when creating update
export interface CreateUpdateResponse {
  status: 'success';
  update_id: string;
  update_status: UpdateStatus;
  message: string;
  update: Update;
}

// Response when deleting update
export interface DeleteUpdateResponse {
  status: 'success';
  message: string;
  deleted_update: {
    update_id: string;
    update_name: string;
    status: UpdateStatus;
    entry_count: number;
    deleted_at: string;
    deleted_by: string;
  };
}

// Submission response
export interface SubmitUpdateResponse {
  status: 'submitted' | 'validating' | 'approved' | 'rejected';
  update_id: string;
  submission_id?: string;
  message: string;
  submitted_at?: string;
  estimated_validation_time_seconds?: number;
  status_url?: string;
  current_stage?: string;
  progress_percentage?: number;
  validated_at?: string;
  rejected_at?: string;
  updated_locally_at?: string;
  validation_result?: ValidationResult;
  rejected_entries?: RejectedEntry[];
}

// Validation result
export interface ValidationResult {
  validation_id: string;
  validation_status: 'approved' | 'rejected';
  total_entries: number;
  approved_entries: number;
  rejected_entries: number;
  warnings?: string[];
  rejection_reason?: string;
}

// Rejected entry
export interface RejectedEntry {
  entry: Record<string, string>;
  rejection_reason: string;
  rejection_code: string;
}

// Submit request body (optional)
export interface SubmitUpdateRequest {
  submission_notes?: string;
  expected_validation_time?: string;
}

// API Error response
export interface UpdateErrorResponse {
  status: 'error';
  error_code: string;
  message: string;
  details?: string;
  current_status?: string;
  retry_after_seconds?: number;
}
