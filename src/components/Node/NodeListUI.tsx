import { node_list, node_list_info } from '@/services/user/api-node';
import type { ProColumns, StatisticProps } from '@ant-design/pro-components';
import { ProCard, ProTable, StatisticCard } from '@ant-design/pro-components';
import { Button, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link } from 'umi';

const { Divider } = ProCard;
const { Statistic } = StatisticCard;
const items = [
  { key: '0', title: '全部', total: true, value: 4 },
  { key: '1', status: 'pending', title: '边缘节点', value: 1 },
  { key: '2', status: 'processing', title: '云节点', value: 1 },
  { key: '3', status: 'error', title: '终端', value: 1 },
  { key: '4', status: 'success', title: '其他节点', value: 1 },
];

const columns: ProColumns<API.NodeInfo>[] = [
  {
    title: '序号',
    dataIndex: 'key',
    valueType: 'indexBorder',
    width: 48,
  },
  {
    title: '节点编号',
    dataIndex: 'id',
    key: 'id',
    render: (id) => {
      if (id === '') id = 0;
      return (
        <div>
          <Link to={`/node/data/${id}`}>查看详情</Link>
        </div>
      );
    },
  },
  {
    title: '节点名称',
    dataIndex: 'name',
    key: 'name',
    ellipsis: true,
    copyable: true,
    render: (text) => <span>{text}</span>,
  },
  {
    title: '状态',
    key: 'online_status',
    dataIndex: 'online_status',
    render: (_type) => {
      if (_type === true) status = 'Online';
      else status = 'Offline';
      let color = 'success';
      if (_type === true) color = 'gold';
      else color = 'gray';
      return <Tag color={color}>{status}</Tag>;
    },
  },
  {
    title: '节点种类',
    dataIndex: 'type',
    key: 'type',
    ellipsis: true,
    copyable: true,
    render: (text) => <span>{text}</span>,
  },
  {
    title: '节点分发任务数量',
    dataIndex: 'nums',
    key: 'nums',
    ellipsis: true,
    copyable: true,
    search: false, // 禁用搜索
    render: (user_info, index) => {
      return <div>总数: {index ? index.nums?.task_nums : 0}</div>;
    },
  },
  {
    title: '操作',
    width: 180,
    key: 'option',
    valueType: 'option',
    render: (user_info, index) => {
      const id = index ? index.id : 0;
      return <Link to={`/node/data/${id}`}>查看详情</Link>;
    },
  },
];

export const NodeInfoUI = () => {
  const [value, setValue] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const nodes_info = await node_list_info();
      setValue(nodes_info.data.nums); // 假设API返回的数据结构中有一个名为value的字段，且值为长度为5的数组
    };

    fetchData();
  }, []);
  return (
    <div>
      <ProCard
        title="服务器节点概况"
        headerBordered
        direction="column"
        headStyle={{ fontWeight: 'bold', fontSize: '36px' }}
        style={{
          fontWeight: 'bold',
          fontSize: '24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
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
      <ProTable<API.NodeInfo>
        columns={columns}
        request={async (params, sorter, filter) => {
          console.log(params, sorter, filter);
          const msg = await node_list({
            ...params,
            ...filter,
            ...sorter,
          });
          return {
            data: msg.data.nodes,
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
          defaultCollapsed: true,
        }}
        dateFormatter="string"
        toolbar={{
          title: '节点列表',
        }}
        toolBarRender={() => [
          <Button type="primary" key="primary">
            创建节点
          </Button>,
        ]}
      />
    </div>
  );
};
export const NodeListUI = () => {
  return <NodeInfoUI></NodeInfoUI>;
};
