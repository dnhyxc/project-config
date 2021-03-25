import React, { PureComponent } from 'react';
import styles from './index.less';

class Detail extends PureComponent {
  constructor(props: any) {
    super(props);
    this.state = 'Detail';
  }

  render() {
    return (
      <div className={styles.wrap}>{this.state}</div>
    );
  }
}

export default Detail;
