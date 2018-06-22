// @flow
import React, { Component } from 'react';

import {
  Dialog,
  Button,
  InputGroup,
  Intent,
  Card,
  Elevation,
  Alert,
  Switch
} from '@blueprintjs/core';

import axios from 'axios';

import toaster from '../utils/toaster';
import localStorageVariables from '../utils/localStorageVariables';

const { getGlobal } = require('electron').remote;

const reload = getGlobal('reload');

export default class Settings extends Component {
  constructor() {
    super();

    this.state = {
      databaseConLoading: false,
      visibility: false,
      resetToFactorySettingsAlertVisible: false,
      disableDropAlertConfirm: localStorage.getItem(localStorageVariables.Disable_Drop_Alert_Confirm) === 'true',
      database_host: localStorage.getItem(localStorageVariables.database.host) || '',
      database_user: localStorage.getItem(localStorageVariables.database.user) || '',
      database_pass: localStorage.getItem(localStorageVariables.database.pass) || '',
      database_alias: localStorage.getItem(localStorageVariables.database.alias) || ''
    };
  }

  async checkDatabase() {
    let databaseEndpoint = this.state.database_host;

    if (this.state.database_user) {
      databaseEndpoint = `${databaseEndpoint}/?user=${this.state.database_user}`;
    }

    if (this.state.database_pass) {
      databaseEndpoint = `${databaseEndpoint}&password=${this.state.database_pass}`;
    }

    return axios.post(databaseEndpoint, 'show databases FORMAT JSON');
  }

  handleOpen = () => { this.setState({ visibility: true }); };

  handleOk = () => {
    if (this.state.database_host.toLowerCase().indexOf('http') < 0) {
      toaster.show({
        message: 'Put http:// or https:// before host.',
        intent: Intent.WARNING,
        icon: 'error'
      });
      return;
    }

    this.setState({ databaseConLoading: true });

    this.checkDatabase()
      .then((res) => {
        this.setState({ databaseConLoading: false });

        if (!this.state.database_host || !res.data.data) {
          toaster.show({
            message: 'host是空的.',
            intent: Intent.WARNING,
            icon: 'error'
          });
          return;
        }

        localStorage.setItem(localStorageVariables.database.host, this.state.database_host ? this.state.database_host : '');
        localStorage.setItem(localStorageVariables.database.user, this.state.database_user ? this.state.database_user : '');
        localStorage.setItem(localStorageVariables.database.pass, this.state.database_pass ? this.state.database_pass : '');
        localStorage.setItem(localStorageVariables.database.alias, this.state.database_alias ? this.state.database_alias : '');
        localStorage.setItem(localStorageVariables.database.use, '');

        this.setState({
          visibility: false
        });

        toaster.show({
          message: '连接后重新加载中...',
          intent: Intent.SUCCESS,
          icon: 'tick-circle'
        });

        setTimeout(() => reload(), 2000); // eslint-disable-line

        return null;
      })
      .catch((e) => {
        console.error(e);

        this.setState({ databaseConLoading: false });

        let errorMessage = '';

        switch (e.message) {
          case 'Request failed with status code 401':
            errorMessage = '没有权限, 用户名和密码是错误的.';
            break;
          case 'Cannot read property \'protocol\' of null':
            errorMessage = '不能连接, host是错误的.';
            break;
          case 'Network Error':
            errorMessage = '网络错误, host不能连接.';
            break;
          default:
            errorMessage = `未知的错误: ${e.message}`;
        }

        toaster.show({
          message: errorMessage,
          intent: Intent.DANGER,
          icon: 'error',
          timeout: 0
        });
      });
  };

  handleChangeHost = (e) => this.setState({ database_host: e.target.value });
  handleChangePass = (e) => this.setState({ database_pass: e.target.value });
  handleChangeUser = (e) => this.setState({ database_user: e.target.value });
  handleDatabaseAlias = (e) => this.setState({ database_alias: e.target.value });

  handleCancel = () => { this.setState({ visibility: false }); };

  handleResetToFactorySettingsAlertOpen = () => {
    this.setState({ resetToFactorySettingsAlertVisible: true });
  };

  handleResetToFactorySettingsAlertClose = () => {
    this.setState({ resetToFactorySettingsAlertVisible: false });
  };

  handleResetToFactorySettings = () => {
    localStorage.clear();
    reload();
  };

  handleDisableDropAlertConfirm = () => {
    this.setState({ disableDropAlertConfirm: !this.state.disableDropAlertConfirm });

    localStorage.setItem(
      localStorageVariables.Disable_Drop_Alert_Confirm,
      !this.state.disableDropAlertConfirm
    );
  };

  render() {
    return (
      <div>
        <Alert
          isOpen={this.state.resetToFactorySettingsAlertVisible}
          intent={Intent.DANGER}
          icon="trash"
          cancelButtonText="No, you save me."
          confirmButtonText="Yes, I want!"
          onConfirm={this.handleResetToFactorySettings}
          onCancel={this.handleResetToFactorySettingsAlertClose}
        >
          <div>
            You <b>really want</b> reset to <b>factory settings</b> ?
            <br />
          </div>
        </Alert>

        <Dialog
          icon="cog"
          isOpen={this.state.visibility}
          onClose={this.handleCancel}
          title="设置"
        >
          <div className="pt-dialog-body">

            <h5>数据库连接 </h5>
            <Card elevation={Elevation.ONE}>
              <InputGroup leftIcon="tag" large="true" className="pt-input-group .modifier pt-fill" type="text" placeholder="服务器别名" value={this.state.database_alias} onChange={this.handleDatabaseAlias} />
              <br />
              <InputGroup leftIcon="globe" large="true" className="pt-input-group .modifier pt-fill" type="text" placeholder="http://117.107.241.79:8123" value={this.state.database_host} onChange={this.handleChangeHost} />
              <br />
              <InputGroup leftIcon="user" large="true" className="pt-input-group .modifier pt-fill" type="text" placeholder="默认" value={this.state.database_user} onChange={this.handleChangeUser} />
              <br />
              <InputGroup leftIcon="lock" large="true" className="pt-input-group .modifier pt-fill" type="password" placeholder="密码" value={this.state.database_pass} onChange={this.handleChangePass} />

              <div className="footer-button">
                <Button
                  loading={this.state.databaseConLoading}
                  intent={Intent.SUCCESS}
                  onClick={this.handleOk}
                  text="保存且开始"
                  icon="small-tick"
                />
              </div>

            </Card>

            {/*<br /><br />*/}
            {/*<h5>General</h5>*/}
            {/*<Card elevation={Elevation.ONE}>*/}

              {/*<Switch*/}
                {/*checked={this.state.disableDropAlertConfirm}*/}
                {/*label="Disable DROP alert confirm"*/}
                {/*onChange={this.handleDisableDropAlertConfirm}*/}
              {/*/>*/}

              {/*<br />*/}

              {/*<Button*/}
                {/*intent={Intent.DANGER}*/}
                {/*onClick={this.handleResetToFactorySettingsAlertOpen}*/}
                {/*text="Reset to factory settings"*/}
                {/*className="pt-minimal"*/}
              {/*/>*/}
            {/*</Card>*/}

          </div>
        </Dialog>
      </div>
    );
  }
}
