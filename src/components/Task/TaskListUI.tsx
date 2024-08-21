import {
  delete_task,
  task_distribute_all,
  task_list,
  task_list_info,
} from '@/services/user/api-task';
import type { ProColumns, StatisticProps } from '@ant-design/pro-components';
import { ProCard, ProTable, StatisticCard } from '@ant-design/pro-components';
import { Button, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link } from 'umi';

const { Divider } = ProCard;
const { Statistic } = StatisticCard;
const items = [
  { key: '0', title: '全部', value: 10, total: true },
  { key: '1', status: 'undistributed', title: '未分发', value: 1 },
  { key: '2', status: 'pending', title: '等待执行', value: 5 },
  { key: '3', status: 'processing', title: '执行中', value: 3 },
  { key: '4', status: 'success', title: '执行成功', value: 1 },
  { key: '5', status: 'error', title: '执行异常', value: 0 },
];

const valueEnum = {
  0: 'default',
  1: 'pending',
  2: 'processing',
  3: 'success',
  4: 'error',
};
const deleteClick = async (id: string, event: any) => {
  // 阻止默认的导航行为
  event.preventDefault();

  try {
    await delete_task(id);
  } catch (error) {
    console.error('下载失败:', error);
  }
};
const columns: ProColumns<API.TaskInfo>[] = [
  {
    title: '序号',
    dataIndex: 'key',
    valueType: 'indexBorder',
    width: 48,
  },
  {
    title: '任务编号',
    dataIndex: 'id',
    key: 'id',
    render: (id) => {
      if (id === '') id = 0;
      return (
        <div>
          <Link to={`/task/data/${id ? id : 0}`}>{id}</Link>
        </div>
      );
    },
  },
  {
    title: '任务名称',
    dataIndex: 'name',
    key: 'name',
    ellipsis: true,
    copyable: true,
    render: (text) => <span>{text}</span>,
  },
  {
    title: '创建者',
    dataIndex: 'user_info', // 假设 user_info 是用户信息对象
    render: (user_info, index) => {
      return <a>{index ? index.user_info.author_name : 'Null'}</a>;
    },
  },
  {
    title: '状态',
    key: 'type',
    dataIndex: 'type',
    render: (_type) => {
      let status = 'Success';
      if (_type === 0) status = 'Undistributed';
      if (_type === 1) status = 'Pending';
      if (_type === 2) status = 'Processing';
      if (_type === 3) status = 'Success';
      if (_type === 4) status = 'Error';
      let color = 'success';
      if (_type === 1) color = 'gray';
      if (_type === 2) color = 'gold';
      if (_type === 3) color = 'green';
      if (_type === 4) color = 'red';
      return <Tag color={color}>{status}</Tag>;
    },
  },
  {
    title: '节点编号',
    dataIndex: 'node_id',
    key: 'node_id',
    render: (node_id) => {
      if (node_id === '') node_id = 0;
      return (
        <div>
          <Link to={`/node/data/${node_id}`}>{node_id}</Link>
        </div>
      );
    },
  },
  {
    title: '任务简介',
    dataIndex: 'text',
    key: 'text',
    ellipsis: true,
    copyable: true,
    render: (text) => <span>{text}</span>,
  },
  {
    title: '操作',
    width: 180,
    key: 'option',
    valueType: 'option',
    render: (a, index) => [
      <Link to={`/task/data/${index ? index.id : 0}`}>查看详情</Link>,
      <a href={`${index ? index.task_url : ''}`}>下载</a>,
    ],
  },
];
export const TaskListUI = (props: any) => {
  const { id } = props;
  const [value, setValue] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const tasks_info = await task_list_info({ node_id: id ? id : 0 });
      setValue(tasks_info.data.task_nums); // 假设API返回的数据结构中有一个名为value的字段，且值为长度为5的数组
    };

    fetchData();
  }, []);
  const handleDistributeClick = async () => {
    // 在这里执行您想要的操作
    console.log('按钮被点击！');
    const m = await task_distribute_all();
    // 刷新整个页面
    window.location.reload();
  };
  return (
    <div>
      <ProCard
        title="任务执行概况"
        headerBordered
        direction="column"
        headStyle={{ fontWeight: 'bold', fontSize: '24px' }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        tabs={{
          onChange: (key) => {
            console.log('key', key);
          },
          items: items.map((item) => {
            return {
              key: item.key,
              style: { width: '100%' },
              label: (
                <Statistic
                  layout="vertical"
                  title={item.title}
                  value={value ? value[parseInt(item.key)] : 0}
                  status={item.status as StatisticProps['status']}
                  style={{
                    borderInlineEnd: item.total ? '1px solid #f0f0f0' : undefined,
                    minWidth: 100,
                  }}
                />
              ),
            };
          }),
        }}
      />
      <ProTable<API.TaskInfo>
        columns={columns}
        request={async (params, sorter, filter) => {
          console.log(params, sorter, filter);
          const msg = await task_list({
            node_id: id ? id : 0,
            ...params,
            ...filter,
            ...sorter,
          });
          return {
            data: msg.data.tasks,
            // success 请返回 true，
            // 不然 table 会停止解析数据，即使有数据
            success: true,
            // 不传会使用 data 的长度，如果是分页一定要传
            total: msg.data.nums,
          };
          // 表单搜索项会从 params 传入，传递给后端接口。
        }}
        rowKey="key"
        pagination={{
          showQuickJumper: true,
        }}
        search={{
          layout: 'vertical',
          defaultCollapsed: false,
        }}
        dateFormatter="string"
        toolbar={{
          title: '任务列表',
        }}
        toolBarRender={() => [
          <Button type="primary" key="primary" onClick={handleDistributeClick}>
            分发任务
          </Button>,
        ]}
      />
    </div>
  );
};
