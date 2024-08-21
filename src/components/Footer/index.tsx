import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';

const Footer: React.FC = () => {
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      links={[
        {
          key: 'title',
          title: '异构计算系统',
          href: 'https://pro.ant.design',
          blankTarget: true,
        },
        {
          key: 'github',
          title: <GithubOutlined />,
          href: 'https://github.com/ant-design/user',
          blankTarget: true,
        },
        {
          key: 'author',
          title: 'Powered by THU wzw',
          href: '',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
