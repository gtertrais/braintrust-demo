import React from "react";
import StatusDistribution from "./StatusDistribution";
import { Col, Row } from "antd";
import Timeline from "./Timeline";

const ChartView = ({ notifications, logo, company, setNotifications, total, totalBTRST }) => {
  return (
    <>
      <br />
      <Timeline notifications={notifications} logo={logo} company={company} setNotifications={setNotifications} total={total} totalBTRST={totalBTRST} />
      <br />
      <hr />
      <br />
      <StatusDistribution notifications={notifications} />
    </>

  );
};

export default ChartView;