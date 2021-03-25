import React, { PureComponent } from 'react';
import styles from './index.less';

class Detail extends PureComponent {
  constructor(props: any) {
    super(props);
  }
  render() {
    return (
      <div className={styles.wrap}>Detail</div>
    )
  }
}

export default Detail;
