// @ts-ignore
/* eslint-disable */

declare namespace API {
  type CurrentUser = {
    name?: string;
    avatar?: string;
    userid?: string;
    email?: string;
    signature?: string;
    title?: string;
    group?: string;
    tags?: { key?: string; label?: string }[];
    notifyCount?: number;
    unreadCount?: number;
    country?: string;
    access?: string;
    geographic?: {
      province?: { label?: string; key?: string };
      city?: { label?: string; key?: string };
    };
    address?: string;
    phone?: string;
  };

  type LoginResult = {
    status?: string;
    type?: string;
    currentAuthority?: string;
  };

  type PageParams = {
    current?: number;
    pageSize?: number;
  };

  type RuleListItem = {
    key?: number;
    disabled?: boolean;
    href?: string;
    avatar?: string;
    name?: string;
    owner?: string;
    desc?: string;
    callNo?: number;
    status?: number;
    updatedAt?: string;
    createdAt?: string;
    progress?: number;
  };

  type RuleList = {
    data?: RuleListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type FakeCaptcha = {
    code?: number;
    status?: string;
  };

  type LoginParams = {
    username?: string;
    password?: string;
    autoLogin?: boolean;
    type?: string;
  };

  type ErrorResponse = {
    /** 业务约定的错误码 */
    errorCode: string;
    /** 业务上的错误信息 */
    errorMessage?: string;
    /** 业务上的请求是否成功 */
    success?: boolean;
  };

  type NoticeIconList = {
    data?: NoticeIconItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type NoticeIconItemType = 'notification' | 'message' | 'event';

  type NoticeIconItem = {
    id?: string;
    extra?: string;
    key?: string;
    read?: boolean;
    avatar?: string;
    title?: string;
    status?: string;
    datetime?: string;
    description?: string;
    type?: NoticeIconItemType;
  };

  type Performance = {
    energy?: number;
    max_time_delay?: number;
    security?: number;
    stability?: number;
    [property: string]: any;
  };

  type UserSocial = {
    auth_check?: boolean;
    author_headurl?: string;
    author_id?: number;
    author_name?: string;
    author_nickname?: string;
    author_signature?: string;
    follow_bool?: boolean;
    [property: string]: any;
  };

  type TaskInfo = {
    created_at?: number;
    id: number;
    name: string;
    node_id?: number;
    preload_url?: string;
    requirements: Performance;
    sons?: number[];
    task_url?: string;
    text?: string;
    time_length?: number;
    type?: number;
    user_info: UserSocial;
    [property: string]: any;
  };
  type NodeInfo = {
    created_at?: number;
    id: number;
    name: string;
    nums?: Nums;
    online_status: boolean;
    priority: number;
    all_resource: NodeInfoResource[];
    security: number;
    tags: string[];
    text: string;
    type: string;
    updated_at: number;
    work_status: number;
    [property: string]: any;
  };

  type Nums = {
    exec_nums?: number;
    finish_nums?: number;
    task_nums?: number;
    wait_nums?: number;
    [property: string]: any;
  };

  /**
   * 当前节点的硬件资源
   *
   * resource
   */
  type ResourceElement = {
    text: string;
    value: string;
  };
  type NodeInfoResource = {
    name: string;
    resource_info: ResourceElement[];
    text: string;
    type: string;
    [property: string]: any;
  };

  // 任务数据
  type SearchTaskData = {
    id: string[];
    type: string[];
    username: string[];
    node: string[];
  };

  type TableListItem = {
    key: number;
    name: string;
    containers: number;
    creator: string;
    status: string;
    createdAt: number;
    progress: number;
    money: number;
    memo: string;
  };
}
