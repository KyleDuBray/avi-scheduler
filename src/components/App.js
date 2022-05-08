import React from 'react';
import ScheduleLoader from './ScheduleLoader';
import Head from './Board/Head';
import Row from './Board/Row';

import '../styles/layout.css';
import '../styles/table.css';

class App extends React.Component {
  state = {
    scheduleArray: [],
  };

  setScheduleState = (scheduleArray) => {
    const newArr = this.state.scheduleArray.concat(scheduleArray);
    this.setState({ scheduleArray: newArr });
  };

  render() {
    return (
      <>
        <div>
          <ScheduleLoader setParentState={this.setScheduleState} />
        </div>
        <table>
          <Head />
          <tbody>
            <Row appts={this.state.scheduleArray} />
          </tbody>
        </table>
      </>
    );
  }
}

export default App;
