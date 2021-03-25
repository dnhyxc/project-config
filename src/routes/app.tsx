import React from 'react';
import styles from './app.less';

const App: React.FC = ({ children }) => {
  return (
    <div className={styles.flexContent}>
      {children}
    </div>
  );
};

export default App;
