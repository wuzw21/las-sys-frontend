import { ProCard, StatisticCard } from '@ant-design/pro-components';

import { get_node } from '@/services/user/api';
import { Descriptions, Layout, Tag, theme } from 'antd';
import RcResizeObserver from 'rc-resize-observer';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { TaskListUI } from '../Task/TaskListUI';
const { Divider } = ProCard;
const { Statistic } = StatisticCard;

const ResourceCard: React.FC<API.NodeInfoResource> = (resource) => {
  const { useToken } = theme;

  const { token } = useToken();

  const infoComponents = resource.resource_info.map((info, index) => (
    // 渲染每个字符串成为一个子组件
    <StatisticCard
      key={index}
      bordered
      statistic={{
        title: `${info.text}`,
        value: `${info.value}`,
        precision: 2,
      }}
    />
  ));
  return (
    <ProCard.Group
      title={resource.name}
      subTitle={resource.text}
      headerBordered
      bordered
      style={{ marginBlockStart: 8 }}
      gutter={[16, 16]}
      wrap
    >
      {infoComponents}
    </ProCard.Group>
  );
};

const items = [
  { key: '1', title: '全部', value: 10, total: true },
  { key: '2', status: 'default', title: '等待执行', value: 5 },
  { key: '3', status: 'processing', title: '执行中', value: 3 },
  { key: '4', status: 'error', title: '执行异常', value: 1 },
  { key: '5', status: 'success', title: '执行成功', value: 1 },
];
const renderStatus = (_type: boolean) => {
  let status = _type === true ? 'Online' : 'Offline';
  let color = _type ? 'gold' : 'gray';

  return <Tag color={color}>{status}</Tag>;
};
export const NodeShowUI = () => {
  const { id } = useParams();
  const [responsive, setResponsive] = useState(false);
  const [node, setNodedata] = useState<API.NodeInfo>();
  const fetchData = async (id: string) => {
    try {
      let new_node = await get_node(id);
      setNodedata(new_node.data.node_info);
      console.log(node?.all_resource);
    } catch (error) {
      // 捕获异常后的处理
      console.error('An error occurred:', error);
      setNodedata(undefined);
      // 可以在这里设置错误状态或其他处理逻辑
    }
  };
  useEffect(() => {
    fetchData(id ?? '0');
  }, [id]);
  return node ? (
    <Layout>
      <RcResizeObserver
        key="resize-observer"
        onResize={(offset) => {
          setResponsive(offset.width < 596);
        }}
      >
        <div>
          {node.id ? (
            <ProCard>
              <Descriptions
                title="节点信息"
                items={[
                  {
                    key: '1',
                    label: '节点编号',
                    children: node.id,
                  },
                  {
                    key: '2',
                    label: '节点类型',
                    children: node.type,
                  },
                  {
                    key: '3',
                    label: '节点简介',
                    children: node.text,
                  },
                  {
                    key: '4',
                    label: '节点在线情况',
                    children: renderStatus(node.online_status),
                  },
                ]}
              />
            </ProCard>
          ) : null}

          <Divider type={responsive ? 'horizontal' : 'vertical'} />
          <TaskListUI id={node ? (node.id ? node.id : 0) : 0}></TaskListUI>
          <Divider type={responsive ? 'horizontal' : 'vertical'} />
          <ProCard.Group title="节点资源" headerBordered direction={responsive ? 'column' : 'row'}>
            <ProCard bordered title="计算资源使用情况" key="PROCESSOR">
              {node.all_resource
                .filter((item) => item.type === 'PROCESSOR')
                .map((item, index) => (
                  <ResourceCard key={index} {...item} />
                ))}
            </ProCard>
            <Divider type={responsive ? 'horizontal' : 'vertical'} />
            <ProCard bordered title="内存资源使用情况" key="STORAGE">
              {node.all_resource
                .filter((item) => item.type === 'STORAGE')
                .map((item, index) => (
                  <ResourceCard key={index} {...item} />
                ))}
            </ProCard>
            <Divider type={responsive ? 'horizontal' : 'vertical'} />
            <ProCard bordered title="网络资源使用情况" key="NETWORK">
              {node.all_resource
                .filter((item) => item.type === 'NETWORK')
                .map((item, index) => (
                  <ResourceCard key={index} {...item} />
                ))}
            </ProCard>
            <Divider type={responsive ? 'horizontal' : 'vertical'} />
            <ProCard bordered title="性能评价指标" key="COMPUTITY">
              {node.all_resource
                .filter((item) => item.type === 'COMPUTITY')
                .map((item, index) => (
                  <ResourceCard key={index} {...item} />
                ))}
            </ProCard>
          </ProCard.Group>
        </div>
      </RcResizeObserver>
    </Layout>
  ) : (
    <Layout>Node : NuLL</Layout>
  );
};
