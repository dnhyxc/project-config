import React from 'react';
import { Button } from 'antd';
import styles from './index.less';

const Home: React.FC = () => {
  return (
    <div className={styles.container}>
      <Button type="primary">Home</Button>
    </div>
  );
};

export default Home;
