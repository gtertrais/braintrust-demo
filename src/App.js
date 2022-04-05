import "./App.css";
import * as d3 from "d3";
import { useEffect, useState } from "react";
import { Card, Col, Row, Switch, Select } from "antd";
import ChartView from "./components/ChartView";
import TableView from "./components/TableView";
import axios from 'axios';

const { Option } = Select;

function App() {
  const [notifications, setNotifications] = useState([]);
  const [showTableView, setShowTableView] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [selectedCie, setSelectedCie] = useState('');
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState('');
  const [total, setTotal] = useState(undefined);
  const [totalBTRST, setTotalBTRST] = useState(undefined);
  const [selectedCieLogo, setSelectedCieLogo] = useState('');

  useEffect(() => {
    d3.csv("./fee_records.csv").then((d) => {
      getBTRST();
      getCompanies(d);
      getJobs(d);
      getTotal(d);
      load(d);
    });
    return () => undefined;
  }, [selectedCie, selectedJob]);


  const load = (d) => {
    if (selectedCie && !selectedJob) {
      const filteredNotif = d.filter(
        (notif) => notif.employer_name === selectedCie
      );
      setNotifications(filteredNotif);
    } else if (selectedJob && !selectedCie) {
      const filteredNotif = d.filter(
        (notif) => notif.job_title === selectedJob
      );
      setNotifications(filteredNotif);
    } else if (selectedJob && selectedCie) {
      const filteredNotif = d.filter(
        (notif) => notif.job_title === selectedJob && notif.employer_name === selectedCie
      );
      setNotifications(filteredNotif);
    } else {
      setNotifications(d);
    }
  }

  const handleSwitchValueChange = () => {
    setShowTableView((showTableView) => !showTableView);
  };

  const handleCompanyChange = (e) => {
    setSelectedCieLogo(companies[e]);
    setSelectedCie(e);
    getTotal(notifications);
    getBTRST();
  }

  const handleJobChange = (e) => {
    setSelectedJob(e);
    getTotal(notifications);
    getBTRST();
  }


  const getCompanies = (d) => {
    let allCompanies = d.reduce(
      (sortedCompanies, company) => {
        const companyName = company["employer_name"];
        if (companyName in sortedCompanies) {
          sortedCompanies[companyName] = company["employer_logo_url"];
        } else {
          sortedCompanies[companyName] = company["employer_logo_url"];
        }
        return sortedCompanies;
      },
      {}
    );
    setCompanies(allCompanies);
  }


  const getJobs = (d) => {
    let allJobs = d.reduce(
      (sortedJobs, job) => {
        const jobName = job["job_title"];
        if (jobName in sortedJobs) {
          sortedJobs[jobName]++;
        } else {
          sortedJobs[jobName] = 1;
        }
        return sortedJobs;
      },
      {}
    );
    setJobs(allJobs);
  }



  const getTotal = (d) => {
    let totalAll;
    if (selectedCie && !selectedJob) {
      const filteredNotif = d.filter(
        (notif) => notif.employer_name === selectedCie
      );
      totalAll = filteredNotif.reduce((total, item) => parseFloat(item.gross_total) + total, 0)
    } else if (selectedJob && !selectedCie) {
      const filteredNotif = d.filter(
        (notif) => notif.job_title === selectedJob
      );
      totalAll = filteredNotif.reduce((total, item) => parseFloat(item.gross_total) + total, 0)
    } else if (selectedJob && selectedCie) {
      const filteredNotif = d.filter(
        (notif) => notif.job_title === selectedJob && notif.employer_name === selectedCie
      );
      totalAll = filteredNotif.reduce((total, item) => parseFloat(item.gross_total) + total, 0)
    } else {
      totalAll = d.reduce((total, item) => parseFloat(item.gross_total) + total, 0)
    }

    setTotal(totalAll.toFixed(2));
  }


  const getBTRST = () => {
    let response = null;
    new Promise(async (resolve, reject) => {
      try {
        response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=braintrust&vs_currencies=usd', {
          headers: {
            'accept': 'application/json'
          },
        });
      } catch (ex) {
        response = null;
        // error
        console.log(ex);
        reject(ex);
      }
      if (response) {
        // success
        const json = response.data;
        let BTRST = parseFloat(json['braintrust'].usd);
        setTotalBTRST(BTRST);
        resolve(json);
      }
    });
  }


  return (
    <>

      <h1 className="title1">Braintrust - Fee Converter</h1>
      <Card style={{ margin: "2%" }}>
        <Row style={{ marginBottom: "10px" }}>
          <Col span={24} style={{ marginBottom: "10px", textAlign: 'center' }}>
            Show Data as Table
            <Switch checked={showTableView} onChange={handleSwitchValueChange} style={{ marginLeft: '5px', marginBottom: '3px' }} />
          </Col>
          <Col span={24} style={{ marginBottom: "10px", textAlign: 'center' }}>
            <Select placeholder='Select a Company' style={{ width: '20%' }} onChange={handleCompanyChange} allowClear={true} showSearch={true}>
              {Object.keys(companies).map((item, i) => (
                <Option key={i} value={item}>{item}</Option>
              ))}
            </Select>
          </Col>
          <Col span={24} style={{ marginBottom: "10px", textAlign: 'center' }}>
            <Select placeholder='Select a Profession' style={{ width: '20%' }} onChange={handleJobChange} allowClear={true} showSearch={true}>
              {Object.keys(jobs).map((item, i) => (
                <Option key={i} value={item}>{item}</Option>
              ))}
            </Select>
          </Col>
        </Row>
        <hr/>
        <div className="header content" style={{ justifyContent: 'center' }}>
          <img alt={'logoCie'} className="logo" src={selectedCieLogo ? selectedCieLogo : './logo512.png'} height='50px' />
          <h1 >{selectedCie ? selectedCie : 'All Companies'}</h1>
        </div>
        <div className="header content" style={{ justifyContent: 'center' }}>
          <h1 >{selectedJob ? selectedJob : 'All Professions'}</h1>
        </div>
        <div className="header content" style={{ justifyContent: 'center' }}>
          <h2>${total} in fees purchased {(total / totalBTRST).toFixed(2)} of BTRST</h2>
        </div>
        <hr/>
        {showTableView ? (
          <TableView notifications={notifications} setNotifications={setNotifications} logo={selectedCieLogo} company={selectedCie} total={total} totalBTRST={totalBTRST} />
        ) : (
          <ChartView notifications={notifications} logo={selectedCieLogo} company={selectedCie} total={total} totalBTRST={totalBTRST} />
        )}
      </Card>
    </>
  );
};


export default App;