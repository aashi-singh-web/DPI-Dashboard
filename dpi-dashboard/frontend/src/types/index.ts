export interface ApplicationStat {
  name: string;
  packets: number;
  percentage: number;
}

export interface ThreadStat {
  thread: number;
  packets: number;
}

export interface EngineStatistics {
  totalPackets: number;
  tcpPackets: number;
  udpPackets: number;
  forwarded: number;
  dropped: number;
  applications: ApplicationStat[];
  threads: ThreadStat[];
  raw?: {
    stdout: string;
    stderr: string;
  };
}

export interface AnalyzeResponse {
  success: boolean;
  statistics: EngineStatistics;
  outputFile: string;
  originalName: string;
  appliedRules: {
    apps: string[];
    domains: string[];
    ips: string[];
  };
}

export interface ApiErrorPayload {
  error: string;
  message?: string;
}

export interface BlockingRules {
  apps: string[];
  domains: string[];
  ips: string[];
}

export const BLOCKABLE_APPS = [
  'YouTube',
  'Facebook',
  'Instagram',
  'GitHub',
  'TikTok',
  'Discord',
  'Spotify',
  'Zoom',
  'Telegram',
  'Google',
  'Amazon',
  'Twitter',
  'Apple',
  'Microsoft',
] as const;
