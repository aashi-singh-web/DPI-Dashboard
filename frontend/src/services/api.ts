import axios, { AxiosError } from 'axios';
import type { AnalyzeResponse, ApiErrorPayload, BlockingRules } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 180000, // engine runs can take a while on large captures
});

export class ApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

function toApiError(err: unknown): ApiError {
  const axiosErr = err as AxiosError<ApiErrorPayload>;
  if (axiosErr.response) {
    const payload = axiosErr.response.data;
    return new ApiError(
      payload?.message || payload?.error || 'Request failed',
      axiosErr.response.status
    );
  }
  if (axiosErr.request) {
    return new ApiError('Could not reach the backend. Is the server running?');
  }
  return new ApiError(axiosErr.message || 'Unexpected error');
}

export async function analyzePcap(
  file: File,
  rules: BlockingRules,
  onProgress?: (percent: number) => void
): Promise<AnalyzeResponse> {
  const formData = new FormData();
  formData.append('pcap', file);
  formData.append('apps', JSON.stringify(rules.apps));
  formData.append('domains', JSON.stringify(rules.domains));
  formData.append('ips', JSON.stringify(rules.ips));

  try {
    const { data } = await apiClient.post<AnalyzeResponse>('/api/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (evt) => {
        if (onProgress && evt.total) {
          onProgress(Math.round((evt.loaded / evt.total) * 100));
        }
      },
    });
    return data;
  } catch (err) {
    throw toApiError(err);
  }
}

export function downloadUrl(filename: string): string {
  return `${API_BASE_URL}/api/download/${filename}`;
}
