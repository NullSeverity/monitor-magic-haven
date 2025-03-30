
export interface Monitor {
  id: number;
  name: string;
  type: 'HTTP' | 'TCP' | 'PING';
  url?: string;
  host?: string;
  port?: number;
  method?: 'GET' | 'POST' | 'HEAD';
  status: 'up' | 'down' | 'pending';
  responseTime: number;
  uptime: number;
  interval: number;
  group?: string;
  retries?: number;
  notifications?: string[];
}
