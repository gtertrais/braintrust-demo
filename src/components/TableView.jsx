import { useEffect, useState } from "react";
import { Table, Input } from "antd";

const TableView = ({ notifications, logo, company, total, totalBTRST }) => {

    const [value, setValue] = useState('');
    const [filtered, setFiltered] = useState(notifications);

    useEffect(() => {
        setFiltered(notifications);
        setValue('');
      }, [notifications]);

    const columns = [
        {
            title: "Id",
            dataIndex: "id",
            sorter: {
                compare: (a, b) => a.id - b.id,
            },
        },
        {
            title: "Batch",
            dataIndex: "batch",
            sorter: {
                compare: (a, b) => a.batch - b.batch,
            },
        },
        {
            title: "Batch Name",
            dataIndex: "batch__name",
        },
        {
            title: "Employer Name",
            dataIndex: "employer_name",
        },
        {
            title: "Logo",
            dataIndex: "employer_logo_url",
            render: (text) => <img src={text} height='50px' />
        },
        {
            title: "Number",
            dataIndex: "number",
        },
        {
            title: "Gross Total",
            dataIndex: "gross_total",
            sorter: {
                compare: (a, b) => a.gross_total - b.gross_total,
            },
            render: (value, row, index) => {
                // do something like adding commas to the value or prefix
                return <span>$ {value.toLocaleString('en-US')}</span>;
              }
        },
        {
            title: "Job Title",
            dataIndex: "job_title",
        },
    ];

    return (
        <>
            <div className="header content">
                <img className="logo" src={logo ? logo : './logo512.png'} height='50px' />
                <h1 className="title">{company ? company : 'All Companies'}</h1>
            </div>
            <p className="title1">${total} in fees purchased {(total / totalBTRST).toFixed(2)} of BTRST</p>
            <Input
            placeholder="Search"
            style={{width:'300px'}}
            value={value}
            onChange={e => {
                const currValue = e.target.value;
                setValue(currValue);
                const filteredData = notifications.filter(entry =>
                    entry.employer_name.toLowerCase().includes(currValue.toLowerCase()) || entry.batch__name.toLowerCase().includes(currValue.toLowerCase()) || entry.job_title.toLowerCase().includes(currValue.toLowerCase()) || entry.number.includes(currValue) || entry.id.includes(currValue) 
                );
                setFiltered(filteredData);
            }}
        />
            <Table dataSource={filtered} columns={columns} rowKey="id" bordered />
        </>

    );
};

export default TableView;