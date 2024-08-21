// @ts-ignore
/* eslint-disable */
import { request } from '@/utils/network';
import Cookies from 'js-cookie';
/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
  return request('/user/currentUser', 'GET', {
    username: Cookies.get('username'),
    access_token: Cookies.get('access_token'),
  });
}

/** 退出登录接口 POST /api/login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
  Cookies.remove('username');
  Cookies.remove('access_token');
  return request('/user/outLogin', 'POST');
}

/** 登录接口 POST /api/login/account */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request('/user/login', 'POST', body);
}

export async function get_node(id: string, options?: { [key: string]: any }) {
  return request(`/node/data/${id}`, 'GET');
}
