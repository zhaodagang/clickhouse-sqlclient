// @flow
import React, { Component } from 'react';
import jsonexport from 'jsonexport';

import { Tab, Tabs, TabId, Navbar, NavbarGroup, Tooltip, Button, Alignment, Position, Intent } from '@blueprintjs/core';

import Table from './Table';
import JSONObject from './JSONObject';
import ChartEditor from './chart-editor';

import toaster from '../../utils/toaster';

const { getGlobal } = require('electron').remote;

const copyToClipboard = getGlobal('copyToClipboard');

type Props = {
  data: object
};

export default class QueryResults extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);

    this.state = {
      navbarTabIdActive: '',
      response: {},
      table_columns: [],
      table_data: [],
      loading: false,
      plotlyJSON: {},
      rows: [],
      chart_columns: [],
      plotlyJSON: {}
    };
  }

  componentWillMount() {
    setTimeout(() => {
      this.setState({ navbarTabIdActive: 'table' });
    }, 200);
  }
  componentWillReceiveProps() {

    console.log("this.props.data:", this.props.data);
    if (this.props.data.data) {

      const Keys = Object.keys(this.props.data.data[0]);
      console.log('keys:', Keys);
      let rows = [];
      const totalrows = [];

      this.props.data.data.forEach((item) => {
        rows = [];
        Keys.forEach((value) => {
          rows.push(item[value])
        })
        totalrows.push(rows);

      })

      this.setState({ rows: totalrows });
      //this.state.rows = totalrows;

      const chart_col = this.props.data.meta.map((value) => {
        return value.name;
      });

      this.setState({
        chart_columns: chart_col
      });
    }
  }
  copyJsonObjectToClipboard = () => {
    if (this.props.data.data) {
      copyToClipboard(JSON.stringify(this.props.data.data));
      toaster.show({
        message: '将JSON对象数据复制到剪贴板!',
        intent: Intent.SUCCESS,
        icon: 'tick-circle',
        timeout: 5000
      });
    } else {
      toaster.show({
        message: '没有可用的数据可以复制.',
        intent: Intent.WARNING,
        icon: 'disable',
        timeout: 5000
      });
    }
  };

  copyCSVToClipboard = () => {
    if (this.props.data.data) {
      jsonexport(this.props.data.data, { rowDelimiter: '|' }, (err, csv) => {
        if (err) {
          toaster.show({
            message: `错误: ${err}`,
            intent: Intent.DANGER,
            icon: 'error',
            timeout: 5000
          });
        } else {
          copyToClipboard(csv);
          toaster.show({ // TODO: change this for toaster.success
            message: '将CSV数据复制到剪贴板!',
            intent: Intent.SUCCESS,
            icon: 'tick-circle',
            timeout: 5000
          });
        }
      });
    } else {
      toaster.show({
        message: '没有可用的数据可以复制.',
        intent: Intent.WARNING,
        icon: 'disable',
        timeout: 5000
      });
    }
  };

  handleNavbarTabIdActiveChange = (navbarTabIdActive: TabId) =>
    this.setState({ navbarTabIdActive });

  render() {

    const plotlyJSON = {};

    return (

      <div
        style={{
          backgroundColor: '#394B59', height: '100%', overflow: 'hidden'
        }}
      >
        <Navbar
          style={{
            height: '35px', width: '100%', marginLeft: '0', zIndex: '0', backgroundColor: '#293742'
          }}
        >

          <NavbarGroup align={Alignment.RIGHT} style={{ height: '35px' }}>

            <Tooltip content="将JSON对象数据复制到剪贴板" position={Position.LEFT}>
              <Button
                onClick={this.copyJsonObjectToClipboard}
                className="pt-small pt-minimal"
                icon="code"
                text=""
                intent={Intent.WARNING}
              />
            </Tooltip>

            <Tooltip content="将CSV数据复制到剪贴板" position={Position.LEFT}>
              <Button
                onClick={this.copyCSVToClipboard}
                className="pt-small pt-minimal"
                icon="th-derived"
                text=""
                intent={Intent.WARNING}
              />
            </Tooltip>

          </NavbarGroup>

        </Navbar>
        <div style={{
          paddingLeft: '20px', paddingTop: '10px', height: '100%', width: '100%'
        }}
        >
          <Tabs
            id="TabsExample"
            animate="true"
            large="true"
            onChange={this.handleNavbarTabIdActiveChange}
            selectedTabId={this.state.navbarTabIdActive}
            renderActiveTabPanelOnly="true"
          >
            <Tab id="table" title="表格" panel={<Table data={this.props.data} />} />
            <Tab id="jsonObject" title="JSON 对象" panel={<JSONObject data={this.props.data} />} />
            <Tab id="chartEditor" title="趋势图" panel={<ChartEditor ref="chartEditor" rows={this.state.rows} columnNames={this.state.chart_columns} onUpdate={(nextPlotlyJSON) => this.setState({plotlyJSON: nextPlotlyJSON})} hidden={false} />} />

          </Tabs>
        </div>
      </div>
    );
  }
}
