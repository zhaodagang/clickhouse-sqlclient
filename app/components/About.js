// @flow
import React, { Component } from 'react';

import { Dialog } from '@blueprintjs/core';

import logo from '../resources/houseOps_animated.svg';

import _package from '../package.json';

export default class About extends Component {
  constructor() {
    super();

    this.state = {
      visibility: false
    };
  }

  handleOpen = () => { this.setState({ visibility: true }); };

  handleCancel = () => { this.setState({ visibility: false }); };

  render() {
    return (

      <Dialog
        isOpen={this.state.visibility}
        onClose={this.handleCancel}
        title=""
      >
        <div className="pt-dialog-body">

          <center>
            <img src={logo} alt="" height="60" />
            <br /><br />
            <h2>Falcon</h2>
            <small>一个为OSX,Linux和Windows系统定制的独特的桌面客户端IDE。</small>
            <hr />

            {/*<p>*/}
              {/*<b>Created by</b><br />*/}
              {/*Community*/}
            {/*</p>*/}

            <p>
              <b>Github页</b><br />
              <a href="https://github.com/HouseOps/HouseOps" rel="noopener noreferrer" target="_blank">
                https://github.com/HouseOps/HouseOps
              </a>
            </p>

            <p>
              <b>检查更新</b><br />
              <a href="https://github.com/HouseOps/HouseOps/releases" rel="noopener noreferrer" target="_blank">
                https://github.com/HouseOps/HouseOps/releases
              </a>
            </p>

            <p>
              <b>许可证</b><br />
              <a href="https://github.com/HouseOps/HouseOps/blob/master/LICENSE" rel="noopener noreferrer" target="_blank">
                https://github.com/HouseOps/HouseOps/blob/master/LICENSE
              </a>
              <br />
              MIT
            </p>

            <p>
              <b>版本</b><br />
              {_package.version}
            </p>

          </center>

        </div>
      </Dialog>
    );
  }
}
