// @ts-ignore
/* eslint-disable */
import { request } from '@/utils/network';
/** 获取当前的用户 GET /api/currentUser */
export async function task_list(options?: { [key: string]: any }) {
  return request('/task/taskinfo', 'GET', undefined, options);
}

export async function task_list_info(options?: { [key: string]: any }) {
  return request('/task/taskinfo', 'GET', undefined, options);
}
export async function get_task(id: string, options?: { [key: string]: any }) {
  return request(`/task/data/${id}`, 'GET');
}
export async function delete_task(id: string, options?: { [key: string]: any }) {
  return request(`/task/data/${id}`, 'DELETE');
}
export async function task_distribute_all(options?: { [key: string]: any }) {
  return request(`/task/distribute_all`, 'POST');
}
