// @ts-ignore
/* eslint-disable */
import { request } from '@/utils/network';
/** 获取当前的用户 GET /api/currentUser */
export async function node_list(options?: { [key: string]: any }) {
  return request('/node/nodeinfo', 'GET', undefined, options);
}

export async function node_list_info(options?: { [key: string]: any }) {
  return request('/node/node_list_info', 'GET', undefined, undefined);
}
