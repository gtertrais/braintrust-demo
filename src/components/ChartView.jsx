import React from "react";

import Timeline from "./Timeline";

const ChartView = ({ notifications, logo, company, setNotifications, total, totalBTRST }) => {
  return (
    <Timeline notifications={notifications} logo={logo} company={company} setNotifications={setNotifications} total={total} totalBTRST={totalBTRST}/>
  );
};

export default ChartView;