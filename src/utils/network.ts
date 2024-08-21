/**
 * @note 本文件是一个网络请求 wrapper 示例，其作用是将所有网络请求汇总到一个函数内处理
 *       我们推荐你在大作业中也尝试写一个网络请求 wrapper，本文件可以用作参考
 */

import axios, { AxiosError, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';

const network = axios.create({
  baseURL: '',
  withCredentials: true,
});

network.interceptors.response.use(
  /**
   * 成功返回数据
   * @param response
   * @returns {any | {}}
   */
  (response) => {
    return (response || {}) as any;
  },
  /**
   * 处理请求错误
   * @param err
   * @returns {Promise<never>|Promise<AxiosResponse<any> | any>}
   */
  (err) => {
    console.log(err);
    if (err?.response?.status === 403) {
      return err.response;
    }
    let config = err.config;
    if (!config) return Promise.reject(err);
    config.retry = 1;
    config.__retryCount = config.__retryCount || 0;
    if (config.__retryCount >= config.retry) return Promise.reject(err);
    config.__retryCount += 1;
    let delay = 200;
    let backoff = new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, delay);
    });
    // 返回新的 axios 请求结果
    return backoff.then(function (err) {
      // 设置并格式化传输的数据
      return network.request(config);
    });
  },
);

enum NetworkErrorType {
  CORRUPTED_RESPONSE,
  UNKNOWN_ERROR,
  CANCELED,
}

export class NetworkError extends Error {
  type: NetworkErrorType;
  status: number;
  code: number;
  info: string;

  constructor(_type: NetworkErrorType, _status: number, _code: number, _info: string) {
    super();

    this.type = _type;
    this.status = _status;
    this.code = _code;
    this.info = _info;
  }

  // toString(): string { return this.message; }
  // valueOf(): Object { return this.message; }
}

export const request = async (
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  Data?: any,
  Params?: any,
  timeout: number = 30000,
) => {
  // trsform (current,pageSize) to (l,r)
  let data = Data;
  if (Data && Data.current !== undefined && Data.pageSize !== undefined) {
    const { current, pageSize } = Data;
    const l = (current - 1) * pageSize;
    const r = current * pageSize;
    data = { ...Data, l, r };
  }
  var username = Cookies.get('username');
  var access_token = Cookies.get('access_token');

  if (!url.startsWith('/api')) {
    url = '/api' + url;
  }

  let params = new URLSearchParams();
  if (
    username !== null &&
    access_token !== null &&
    username !== undefined &&
    access_token !== undefined
  ) {
    params.append('username', username);
    params.append('access_token', access_token);
  }
  if (Params) {
    for (let key in Params) {
      if (Params.hasOwnProperty(key) && Params[key] !== null && Params[key] !== undefined) {
        params.append(key, Params[key]);
      }
    }
    if (Params.current !== undefined && Params.pageSize !== undefined) {
      const { current, pageSize } = Params;
      const l = (current - 1) * pageSize;
      const r = current * pageSize;
      params.delete('current');
      params.delete('pageSize');
      params.append('l', `${l}`);
      params.append('r', `${r}`);
    }
  }
  console.log(url, data, params);
  const response = await network
    .request({ method, url, data, timeout, params })
    .catch((err: AxiosError) => {
      console.log(err);
      // if (err?.code == "ERR_CANCELED") {
      //     throw new NetworkError(NetworkErrorType.CANCELED, -1, 0, "Canceled");
      // }
      throw new NetworkError(
        NetworkErrorType.UNKNOWN_ERROR,
        err.response?.status || 200,
        (err.response?.data as any).code,
        (err.response?.data as any).info,
      );
    });

  if (response?.data.code === 0) {
    if (response.data.hasOwnProperty('info')) {
      delete response.data['info'];
    }

    if (response.data.hasOwnProperty('code')) {
      delete response.data['code'];
    }
    console.log(response.data);
    return { data: response.data, status: true };
  } else {
    throw new NetworkError(
      NetworkErrorType.UNKNOWN_ERROR,
      response?.status,
      response?.data.code,
      response?.data.info,
    );
  }
};
