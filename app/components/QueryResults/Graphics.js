// @flow
import React, { Component } from 'react';

import { Bar } from 'react-chartjs-2';

type Props = {
  data: object
};

export default class Graphics extends Component<Props> {
  props: Props;

  constructor() {
    super();

    this.state = {
      graphData: {
        labels: [],
        datasets: [
          {
            label: '',
            data: [],
            fill: false,
          }
        ]
      }
    };
  }

  componentWillMount() {
    if (this.props.data.data) {
      const labels = this.props.data.data.map(value => value.event);
      const datasets = this.props.data.data.map(value => ({
        label: value.event,
        data: [value.value],
        fill: false
      }));

      this.setState({
        graphData: {
          labels,
          datasets
        }
      });
    }
  }

  render() {
    return (
      <div style={{ width: '99%', height: '90%', overflow: 'hidden' }}>
        { !this.props.data.data ?
          <div className="cardResult"><h5 style={{ color: '#293742' }}>正在加载...</h5></div>
          : null
        }

        {
          this.props.data.data &&
          (this.props.data.meta.length > 1 || this.props.data.data.length > 1) ?
            <Bar
              data={this.state.graphData}
            />
            : null
        }
      </div>
    );
  }
}
