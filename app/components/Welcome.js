// @flow
import React, { Component } from 'react';

import {
  Dialog,
  Intent,
  Button
} from '@blueprintjs/core';

import logo from '../resources/houseOps_animated.svg';

import Settings from './Settings';

export default class Welcome extends Component {
  constructor() {
    super();

    this.state = {
      visibility: false
    };
  }

  handleOpen = () => { this.setState({ visibility: true }); };

  handleCancel = () => { this.setState({ visibility: false }); };

  openDatabaseConnectionConfigure = () => {
    this.handleCancel();
    this.databaseConnConfiguration.handleOpen();
  };

  render() {
    return (

      <div>
        <Settings
          ref={instance => { this.databaseConnConfiguration = instance; }}
        />

        <Dialog
          isOpen={this.state.visibility}
        >
          <div className="pt-dialog-body center">
            <br /><br />
            <img src={logo} alt="" height="60" />
            <br /><br /><br />
            <h2>欢迎使用 <i>Falcon实时大数据分析平台</i></h2>
            <br />
            <p>

              <b>Falcon</b> 带你进入极速数据分析的世界！<br />

            </p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <iframe
              title="github"
              src="https://ghbtns.com/github-btn.html?user=HouseOps&repo=HouseOps&type=star&count=true&size=small"
              frameBorder="0"
              scrolling="0"
              width="78px"
              height="30px"
            />
          </div>


          <br />
          <br />

          <div className="pt-dialog-footer center">
            <Button
              large="true"
              intent={Intent.PRIMARY}
              onClick={this.openDatabaseConnectionConfigure}
              text="Configure my first connection now"
            />
          </div>
          <br /><br />
        </Dialog>
      </div>

    );
  }
}
