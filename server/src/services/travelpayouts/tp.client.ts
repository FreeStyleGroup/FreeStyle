import axios from 'axios';
import { config } from '../../config/index.js';
import { logger } from '../../utils/logger.js';

export const tpClient = axios.create({
  baseURL: config.tp.apiBaseUrl,
  timeout: 15000,
  headers: {
    'X-Access-Token': config.tp.apiToken,
    'Accept': 'application/json',
    'Accept-Encoding': 'gzip',
  },
});

tpClient.interceptors.request.use((req) => {
  logger.debug({ url: req.url, params: req.params }, 'TP API request');
  return req;
});

tpClient.interceptors.response.use(
  (res) => {
    logger.debug({ url: res.config.url, status: res.status }, 'TP API response');
    return res;
  },
  (error) => {
    if (axios.isAxiosError(error)) {
      logger.error({
        url: error.config?.url,
        status: error.response?.status,
        message: error.message,
      }, 'TP API error');
    }
    throw error;
  },
);
