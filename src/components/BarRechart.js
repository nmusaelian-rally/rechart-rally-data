import axios from 'axios';
import React, { PureComponent } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

const workspace = 41529001;
const project = 332322441800;
const type = 'HierarchicalRequirement';
const gte = '2020-01-01';
const lt =  '2021-02-28';

const findInProgress = {
    Project: project,
    _TypeHierarchy:type,
    ScheduleState:"In-Progress",
    "_PreviousValues.ScheduleState":"Defined",
    _ValidFrom: {"$gte":gte,"$lt":lt}
  }
  
  const findReleased = {
    Project: project,
    _TypeHierarchy:type,
    ScheduleState:"Released",
    "_PreviousValues.ScheduleState":{ "$lt": "Released" },
    _ValidFrom: {"$gte":gte,"$lt":lt}
  }
  
  const fields = [
    '"ObjectID"',
    '"_ValidFrom"',
    '"_ValidTo"',
    '"ScheduleState"',
    '"_PreviousValues.ScheduleState"'
  ];
  
  const hydrate = ['"ScheduleState"','"_PreviousValues.ScheduleState"'];

const api = `https://rally1.rallydev.com/analytics/v2.0/service/rally/workspace/${workspace}/artifact/snapshot/query.js?find=`;


const apiKey = process.env.REACT_APP_APIKEY;
const headers = {
    'zsessionid': apiKey, 
    'Content-Type': 'application/json'
  }

class BarRechart extends PureComponent {
    state = {
        inProgress: 0,
        released: 0,
        isLoading: false
    }

    async makeRequest(){
        try {
            console.log(`this.props.iteration: ${this.props.iteration}`);
            findInProgress["Iteration"] = Number(this.props.iteration);
            findReleased["Iteration"] = Number(this.props.iteration);
            const queryInProgress = `${JSON.stringify(findInProgress)}`;
            const queryReleased = `${JSON.stringify(findReleased)}`;
            const url1 = `${api}${queryInProgress}&fields=[${fields}]&hydrate=[${hydrate}]`;
            const url2 = `${api}${queryReleased}&fields=[${fields}]&hydrate=[${hydrate}]`;
            const result = await axios.all([
              axios.get(url1, {headers: headers}),
              axios.get(url2, {headers: headers})
            ]);
       
            this.setState({
              inProgress: result[0].data['TotalResultCount'],
              released:   result[1].data['TotalResultCount'],
              isLoading: false
            });
          } catch (error) {
              console.log(error);
              this.setState({
                isLoading: false
              });
          }
    }
    async componentDidMount(){
        await this.makeRequest();
    }
    async componentDidUpdate(){
        await this.makeRequest();
    }
    makeData(){
        return [{iteration:"x",InProgress:this.state.inProgress,Released:this.state.released}]
    }


  render() {
    return (
      <BarChart
        width={500}
        height={300}
        data={this.makeData()}
        margin={{
          top: 5, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar name="InProgress" dataKey="InProgress" fill="#8884d8" />
        <Bar name="Released" dataKey="Released" fill="#82ca9d" />
      </BarChart>
    );
  }
}

export default BarRechart;