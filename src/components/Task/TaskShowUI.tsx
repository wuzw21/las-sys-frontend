import { ProCard, StatisticCard } from '@ant-design/pro-components';

import { get_task } from '@/services/user/api-task';
import { Descriptions, Layout } from 'antd';
import RcResizeObserver from 'rc-resize-observer';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'timeago.js';
const { Divider } = ProCard;
const { Statistic } = StatisticCard;

function convertSecondsToTime(seconds: any) {
  const hours = Math.floor(seconds / 3600);
  seconds %= 3600;
  const minutes = Math.floor(seconds / 60);
  seconds %= 60;

  return `${hours} 小时 ${minutes} 分钟 ${seconds} 秒`;
}
const task_type = ['未分发', '等待节点执行', '正在执行', '执行成功', '异常'];
export const TaskShowUI = () => {
  const { id } = useParams();
  const [responsive, setResponsive] = useState(false);
  const [task, settaskdata] = useState<API.TaskInfo>();
  const fetchData = async (id: string) => {
    try {
      let new_task = await get_task(id);
      settaskdata(new_task.data.task_info);
      console.log(task?.all_resource);
    } catch (error) {
      // 捕获异常后的处理
      console.error('An error occurred:', error);
      settaskdata(undefined);
      // 可以在这里设置错误状态或其他处理逻辑
    }
  };
  useEffect(() => {
    fetchData(id ?? '0');
  }, [id]);
  return task ? (
    <Layout>
      <RcResizeObserver
        key="resize-observer"
        onResize={(offset) => {
          setResponsive(offset.width < 596);
        }}
      >
        <div>
          {task.id ? (
            <ProCard>
              <Descriptions
                title="任务信息"
                items={[
                  {
                    key: 'id',
                    label: '任务编号',
                    children: task.id,
                  },
                  {
                    key: 'name',
                    label: '任务名字',
                    children: task.name,
                  },
                  {
                    key: 'type',
                    label: '任务执行情况',
                    children: task_type[task.type || 0],
                  },
                  {
                    key: 'node_id',
                    label: '任务所属节点',
                    children: task.node_id,
                  },
                  {
                    key: 'task_type',
                    label: '任务种类',
                    children: task.task_type,
                  },
                  {
                    key: 'text',
                    label: '任务简介',
                    children: task.text,
                  },
                  {
                    key: 'created_at',
                    label: '任务创建时间',
                    children: format(new Date((task.created_at || 0) * 1000), 'zh_CN'),
                  },
                  {
                    key: 'time_length',
                    label: '任务完成用时',
                    children: convertSecondsToTime(task.time_length || 0),
                  },
                  {
                    key: 'time_length_exec',
                    label: '任务执行用时',
                    children: convertSecondsToTime(task.time_length_exec || 0),
                  },
                ]}
              />
            </ProCard>
          ) : null}
        </div>
      </RcResizeObserver>
    </Layout>
  ) : (
    <Layout>task : NuLL</Layout>
  );
};
