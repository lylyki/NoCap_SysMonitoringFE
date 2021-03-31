import logo from './logo.svg';
import './App.css';
import React, { Component } from 'react';

function ProcessesList(props) {
  return (
    <div className="List">
      <h4>Запущенные процессы</h4>
        <ul>{props.processes.sort((a,b) => {
          if(a.cpu<b.cpu) return 1;
          if(a.cpu>b.cpu) return -1;
          return 0; 
        }).slice(0, 10).map(process => {
         return(<div><li>{process.name} {process.cpu ? process.cpu : ''} {process.memory ? process.memory : ''}</li></div>)
        })}</ul>
    </div>
  );
}

function LoadStat(props) {
const d = 1048576;
  const loadstats = {
  cpuLoad: 13,
  usedMem: 1,
  totalMem: 5,
}
return (
    <div>
        <h4>Статистика нагрузки</h4>
        <div className = "statBody">
          <ul>
            <li>CPU {Math.round(props.cpuLoad)}%</li>
            <li>RAM {Math.round(props.usedMem/d)}/{Math.round(props.totalMem/d)} MB</li>
          </ul>
        </div>
    </div>
  );
}

function ServerStatus(props) {
  const {distro, arch} = props.OS;
  function StatusColor(p){
    switch (p) {
      case 0:
        return "StatusRed"
      case 1:
        return "StatusGreen"
      default:
        return "StatusYellow"
    }
  }
  const serverSt = {
    osVersion: distro != undefined ? `${distro} ${arch}` : "-",
    /* serverTime: "12 days",
    workingTime: "12 days", */
    serverStatus: props.serverStatus
  }
  return (
    <div>
        <h4>Состояние сервера</h4>
        <div className = "statBody">
          <ul>
            <li>OS: {serverSt.osVersion}</li>
            {/* <li>Time: {serverSt.serverTime}</li>
            <li>InWork: {serverSt.workingTime}</li> */}
            <li>Status: <span className = {StatusColor(props.serverStatus)}>----</span></li>
          </ul>
        </div>
    </div>
  );
}

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      data: {
        processes: [{name: "-"}], 
        cpuLoad: 0,
        usedMem: 0,
        totalMem: 0,
        OS: {}
      }, 
      status: 2,
      dataGettingStatus: false
    }
  }
  GetData = () => {
    if(!this.state.dataGettingStatus){
      this.setState({dataGettingStatus: true});
      fetch("http://localhost:8000/getStats")
    .then(res => res.json())
    .then(result => {
      this.setState({data: result, status: 1});
      this.setState({dataGettingStatus: false})
    })
    .catch(error => {
      console.error(error); 
      this.setState({status: 0});
      this.setState({dataGettingStatus: false})
    })
    //.finally(() => {this.setState({dataGettingStatus: false})})
    } 
    else console.log("dhgdh");
  }
  componentDidMount() {
   this.GetData();
    setInterval(this.GetData, 200);
  }
  componentWillUnmount(){
    
  }
  render() {
    return (
      <div className="App">
        <h3>Информация сервера</h3>
        <hr></hr>
        <div className = "MainC">
          <ProcessesList processes={this.state.data.processes}/>
          <LoadStat 
            cpuLoad={this.state.data.cpuLoad}
            totalMem={this.state.data.totalMem}
            usedMem={this.state.data.usedMem}
          />
          <ServerStatus 
           OS={this.state.data.OS}
           /* serverTime={}
           workingTime={} */
           serverStatus={this.state.status}
          />
        </div>
      </div>
    );
  }
}
export default App;
