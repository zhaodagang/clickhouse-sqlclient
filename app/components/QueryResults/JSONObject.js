// @flow
import React, { Component } from 'react';

import JSONTree from 'react-json-tree';
import { Scrollbars } from 'react-custom-scrollbars';

type Props = {
  data: object
};

export default class JSONObject extends Component<Props> {
  props: Props;

  render() {
    return (
      <div
        style={{ width: '99%', height: '90%', overflow: 'hidden' }}
      >
        { this.props.data.data ?
          <Scrollbars>
            <JSONTree data={this.props.data} />
          </Scrollbars>
          : <div className="cardResult"><h5 style={{ color: '#293742' }}>正在加载...</h5></div>
        }
      </div>
    );
  }
}
