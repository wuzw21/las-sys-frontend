import { request } from '@/utils/network';
import {
  PageContainer,
  ProForm,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormUploadButton,
} from '@ant-design/pro-components';
import { Card, message } from 'antd';
import type { RcFile } from 'antd/es/upload/interface';
import React, { useState } from 'react';
export const TaskUploadUI = () => {
  const [isNodeIdSpecified, NodeChange] = useState('0');

  const NodeSpecifiedChange = (value: string) => {
    NodeChange(value);
  };
  const [isStoreNameRequired, TaskChange] = useState(false);
  const TaskSpecifiedChange = (value: string) => {
    TaskChange(value !== '0');
  };
  const [TaskType, setTaskType] = useState('自定义任务');

  const handleTaskTypeChange = (value: string) => {
    setTaskType(value);
  };
  return (
    <PageContainer title="创建任务">
      <Card>
        <ProForm
          onFinish={async (values) => {
            const formData = new FormData();
            if (values.file && values.file.length > 0) {
              values.file.forEach((f: any) => {
                formData.append('file', f.originFileObj as RcFile);
              });
            }
            for (const [key, value] of Object.entries(values)) {
              if (key !== 'file') formData.append(key, value);
            }
            request(`/task/upload`, 'POST', formData)
              .then((res) => {
                message.success('上传成功');
              })
              .catch((err) => {
                message.error('上传失败，请重试');
              });
          }}
        >
          <ProFormRadio.Group
            width="xs"
            label="任务类型"
            name="task_type"
            initialValue="自定义任务"
            options={['自定义任务', '图像识别', '图像分类']}
            fieldProps={{
              value: TaskType,
              onChange: (e) => setTaskType(e.target.value),
            }}
          />
          <ProForm.Group>
            <ProFormText name="name" label="任务名称" placeholder="请输入名称" />
            <ProFormText name="text" label="任务简介" placeholder="请输入任务简介" />
          </ProForm.Group>

          {TaskType !== '自定义任务' && (
            <ProForm.Group>
              {/* 图像识别相关组件 */}
              <ProFormSelect
                options={[
                  {
                    value: 'gpu',
                    label: 'gpu',
                  },
                  {
                    value: 'cpu',
                    label: 'cpu',
                  },
                ]}
                name="cv_device"
                label="选择执行单元"
                initialValue={'cpu'}
                disabled={TaskType === '自定义任务'}
              />
              <ProFormSelect
                options={[
                  {
                    value: 'yolov7',
                    label: 'yolov7',
                  },
                  {
                    value: 'resnet50',
                    label: 'resnet50',
                  },
                  {
                    value: 'densenet201',
                    label: 'densenet201',
                  },
                ]}
                initialValue={'densenet201'}
                name="cv_model_name"
                label="选择模型"
                disabled={TaskType === '自定义任务'}
              />
              <ProFormText
                name="cv_batch_size"
                label="单轮测试图片张数"
                placeholder="请输入单次册数张数"
                initialValue={100}
                disabled={TaskType === '自定义任务'}
              />
              <ProFormText
                name="cv_epoch"
                label="测试轮数"
                placeholder="请输入测试轮数"
                initialValue={1}
                disabled={TaskType === '自定义任务'}
              />
            </ProForm.Group>
          )}
          <ProForm.Group>
            <ProFormSelect
              options={[
                {
                  value: '0',
                  label: '不分发任务',
                },
                {
                  value: '1',
                  label: '直接分发到某一节点',
                },
                {
                  value: '2',
                  label: '直接分发并指定执行节点',
                },
              ]}
              width="md"
              name="op_type"
              label="分发任务设置"
              onChange={NodeSpecifiedChange}
            />
            <ProFormText
              name="node_id"
              label="分发节点编号"
              initialValue={0}
              placeholder={isNodeIdSpecified === '2' ? '请输入节点编号' : '默认为空'}
              disabled={isNodeIdSpecified !== '2'}
            />
          </ProForm.Group>
          <ProForm.Group>
            <ProFormSelect
              options={[
                {
                  value: '0',
                  label: '不持久化',
                },
                {
                  value: '1',
                  label: '加载对应目录的任务',
                },
                {
                  value: '2',
                  label: '存储上传任务到对应目录',
                },
              ]}
              width="md"
              name="store_type"
              label="是否持久化任务"
              onChange={TaskSpecifiedChange}
            />
            <ProFormText
              name="store_name"
              label="存取目录"
              placeholder={isStoreNameRequired ? '请输入存取目录名称' : '默认为空'}
              disabled={!isStoreNameRequired}
            />
          </ProForm.Group>
          <ProFormUploadButton
            extra={
              '支持扩展名：.zip .sh .py，一次只能上传一个文件。\n 如果以zip格式上传，需要满足：zip为某个单目录的压缩包，其一级目录下有可执行文件run.sh。如script-[run.sh,helloworld.py]，script.zip可以被上传；\n 你可以直接上传一个.sh文件；\n 你可以上传一个x.py文件，后台会自动识别为执行一次该py。'
            }
            name="file"
            label="file"
            title="上传文件"
            accept=".zip,.sh,.py" // 只允许上传 .zip 和 .sh 文件
            fieldProps={{
              multiple: false,
              name: 'file',
            }}
          />
        </ProForm>
      </Card>
    </PageContainer>
  );
};
