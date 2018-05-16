// @flow
import React, { Component } from 'react';
import AceEditor from 'react-ace';
import 'brace/mode/sql';
import 'brace/theme/monokai';
import 'brace/ext/language_tools';
import 'brace/ext/statusbar';
import SplitPane from 'react-split-pane';

import { HotKeys } from 'react-hotkeys';

import { Tabs, notification, Button, Layout, Modal, Popover, Row, Col } from 'antd';

import { Scrollbars } from 'react-custom-scrollbars';

import axios from 'axios';
import JSONTree from 'react-json-tree';

import ReactTable from 'react-table';

// import ReactEcharts from 'echarts-for-react';
import ChartEditor from './chart-editor.jsx';
import ApacheDrillPreview from './ApacheDrillPreview.js';
import S3Preview from './S3Preview.js';
// import OptionsDropdown from '../OptionsDropdown/OptionsDropdown.react';

const { Header, Content } = Layout;
const TabPane = Tabs.TabPane;

export default class Query extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      value: 'select * from default.person',
      response: {},
      table_columns: [],
      table_data: [],
      loading: false,
      plotlyJSON: {},
      rows: [],
      chart_columns: [],
    };

    this.aceEditor = React.createRef();

    this.onChange = this.onChange.bind(this);
    this.onQuery = this.onQuery.bind(this);

  }

  componentWillReceiveProps(nextProps) {
    const {
      preview,
      previewTableRequest,
      queryRequest
    } = nextProps;

    let hasChanged = (preview.lastSuccessfulQuery !== this.props.preview.lastSuccessfulQuery);

    hasChanged = hasChanged || (previewTableRequest.status !== this.props.previewTableRequest.status);
    hasChanged = hasChanged || (previewTableRequest.columnnames !== this.props.previewTableRequest.columnnames);
    hasChanged = hasChanged || (previewTableRequest.rows !== this.props.previewTableRequest.rows);

    hasChanged = hasChanged || (queryRequest.status !== this.props.queryRequest.status);
    hasChanged = hasChanged || (queryRequest.columnnames !== this.props.queryRequest.columnnames);
    hasChanged = hasChanged || (queryRequest.rows !== this.props.queryRequest.rows);

    if (hasChanged) {
      const nextState = Preview.checkQueryResults(nextProps);
      this.setState(nextState);
    }
  }
  hotKeysMap = {
    execute: ['ctrl+enter', 'command+enter']
  };

  hotKeysHandlers = {
    execute: (event) => this.onQuery()
  };

  onChange(newValue) {
    this.setState({
      value: newValue
    });
  }

  renderTableColumns(response) {
    const columns = response.data.meta.map((value, key) => ({
      Header: value.name,
      accessor: value.name
    }));

    const chart_col = response.data.meta.map((value, key) => {
      return value.name
    });

    this.setState({
      table_columns: columns,
      chart_columns: chart_col
    });
    console.log("chart_columns:", this.state.chart_columns);

  }

  getHost(){

    if(localStorage.getItem('database_user') && localStorage.getItem('database_pass')){
      return `http://${localStorage.getItem('database_user')}:${localStorage.getItem('database_pass')}@${localStorage.getItem('database_host').replace('http://', '')}`;
    }

    return localStorage.getItem('database_host')

  }

  async query(query) {

    console.log("sql query:",query);
    return await axios.post(this.getHost(), `${query} FORMAT JSON`);

  }

  async onQuery() {

    notification.destroy();

    if (!this.state.loading) {

      this.setState({
        loading: true
      });

      try {

        let response = '';

        if(this.aceEditor.current.editor.getSelectedText().length > 0) {
          response = await this.query(this.aceEditor.current.editor.getSelectedText());
        } else {
          response = await this.query(this.state.value);
        }

        //-add rows-------------------------------------------------
        console.log("data:",response.data);

        if (response.data) {
          this.renderTableColumns(response);
        }

        this.setState({
          response,
          table_data: response ? response.data.data : [],
          loading: false
        });

        let Keys = Object.keys(this.state.table_data[0]);
        console.log("keys:",Keys);
        let rows = [];
        let totalrows = [];

        this.state.table_data.forEach((item)=> {
          rows = [];
          Keys.forEach((value)=> {
            rows.push(item[value])
          })
          totalrows.push(rows);

        })

        this.state.rows = totalrows;

        console.log("rows:",this.state.rows);

        //------------------------------------------------------------------------
        if (response.data) {
          notification.success({
            message: 'Wow!',
            description: `Elapsed ${response.data.statistics.elapsed.toFixed(3)}ms and read ${response.data.statistics.rows_read} rows with ${parseFloat(response.data.statistics.bytes_read / 10480576).toFixed(2)}Mb.`,
          });
        } else {
          notification.success({
            message: 'Nice!',
            description: 'Your command running ok.',
          });
        }
      } catch (err) {
        console.error(err);

        notification.error({
          message: 'Ops...',
          description: err.response && err.response.data ? `${err.message} - ${err.response.data}` : `${err.message}`,
          duration: 0
        });

        this.setState({
          table_data: [],
          table_columns: [],
          response: {},
          loading: false,
          plotlyJSON: {},
          rows: [],
          chart_columns: []
        });
      }
    }
  }

  render() {
    const content = (
      <div>
        <p><b>Ctrl+Enter</b> - Launch query</p>
      </div>
    );

    return (
      <Content style={{ padding: '10px' }}>

        <SplitPane split="horizontal" defaultSize={300}>

          <Row style={{ width: '100%', padding: '10px' }}>

            <Col span={24} >
              <Header style={{backgroundColor: 'transparent', padding: '0', height: 'auto', lineHeight: '0px'}}
              >

                <Button
                  style={{ margin: '10px' }}
                  type="primary"
                  icon="rocket"
                  loading={this.state.loading}
                  onClick={this.onQuery}
                >
                    Launch
                </Button>

                <Button style={{ margin: '10px' }} type="danger" icon="close" loading={this.state.loading} disabled />

                <Popover placement="left" content={content} title="Keyboard Shortcuts">
                  <Button style={{ margin: '10px', float: 'right' }} type="primary" icon="question" />
                </Popover>

              </Header>

              <HotKeys keyMap={this.hotKeysMap} handlers={this.hotKeysHandlers}>

                <AceEditor
                  style={{ marginTop: '10px', display: 'flex', backgroundColor: 'black', width: '100%' }}
                  mode="sql"
                  theme="monokai"
                  onChange={this.onChange}
                  value={this.state.value}
                  defaultValue={this.state.value}
                  name="aceEditor"
                  editorProps={{ $blockScrolling: true }}
                  ref={this.aceEditor}
                  setOptions={{
                      enableLiveAutocompletion: true,
                      showLineNumbers: true,
                      tabSize: 2
                    }}
                />

              </HotKeys>
            </Col>

          </Row>

          <Row style={{ height: '100%', display: 'flex' }}>

            <Col span={24} style={{ backgroundColor: '#EEE', width: '100%', zIndex: '10000' }}>

              <Tabs defaultActiveKey="1" style={{ height: '100%' }}>

                <TabPane tab="Table View" key="1">

                  <Scrollbars style={{ height: 'auto', minHeight: '30vh' }}>

                    <ReactTable
                      data={this.state.table_data}
                      columns={this.state.table_columns}
                      defaultPageSize={10}
                      className="-striped -highlight"
                    />

                  </Scrollbars>

                </TabPane>

                <TabPane tab="JSON Result" key="2">
                  <Scrollbars style={{ height: 'auto', minHeight: '30vh' }}>
                    <JSONTree style={{ backgroundColor: 'transparent !important' }} data={this.state.response} />
                  </Scrollbars>
                </TabPane>

                <TabPane tab="chart review" key="3">
                  <Scrollbars style={{ height: 'auto', minHeight: '30vh' }}>
                    {/*<ReactEcharts*/}
                      {/*option={this.getOption()}*/}
                      {/*notMerge={true}*/}
                      {/*lazyUpdate={true}*/}
                      {/*theme={"theme_name"}*/}
                      {/*onChartReady={this.onChartReadyCallback}/>*/}

                    <ChartEditor
                      ref="chartEditor"
                      rows={this.state.rows}
                      columnNames={this.state.chart_columns}
                      //plotlyJSON={plotlyJSON}
                      //onUpdate={(nextPlotlyJSON) => this.setState({plotlyJSON: nextPlotlyJSON})}
                      hidden={false}
                    />
                  </Scrollbars>
                </TabPane>

              </Tabs>

            </Col>

          </Row>
          {S3Preview(this.props)}
          {/*{ApacheDrillPreview(this.props)}*/}
        </SplitPane>

      </Content>
    );
  }
}
