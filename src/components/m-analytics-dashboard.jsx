import React, { useState, useMemo } from "react";
import {
  FaFileAlt, FaCertificate, FaClock, FaCheckCircle, FaTimesCircle
} from "react-icons/fa";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts";
import "../styles/m-analytics-dashboard.css";

const StatCard = ({ icon, label, value, color }) => (
  <div className="stat-card" style={{ "--card-color": color }}>
    <div className="stat-icon">{icon}</div>
    <div className="stat-info">
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  </div>
);

const ChartCard = ({ title, data }) => {
  const getColor = (name) => {
    switch (name.toLowerCase()) {
      case 'approved':
        return '#22c55e'; // green
      case 'declined':
        return '#ef4444'; // red
      case 'pending':
        return '#f97316'; // orange
      case 'resolved':
        return '#3b82f6'; // blue
      default:
        return '#8884d8'; // default recharts color
    }
  };

  return (
    <div className="chart-container">
      <h4>{title}</h4>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
          <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={70} />
          <Tooltip />
          <Bar dataKey="count" barSize={20}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.name)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const AnalyticsDashboard = ({ reports, requests }) => {
  const [timeRange, setTimeRange] = useState('all'); // 'daily', 'weekly', 'monthly', 'all'

  const filteredData = useMemo(() => {
    const now = new Date();
    const nowTime = now.getTime();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

    const filterByRange = (item) => {
      const itemTime = item.date; // item.date is already a timestamp
      switch (timeRange) {
        case 'daily':
          return itemTime >= startOfToday;
        case 'weekly':
          const oneWeekAgo = nowTime - 7 * 24 * 60 * 60 * 1000;
          return itemTime >= oneWeekAgo;
        case 'monthly':
          const oneMonthAgo = nowTime - 30 * 24 * 60 * 60 * 1000;
          return itemTime >= oneMonthAgo;
        case 'all':
        default:
          return true;
      }
    };

    return {
      reports: reports.filter(filterByRange),
      requests: requests.filter(filterByRange),
    };
  }, [reports, requests, timeRange]);

  const reportStats = {
    total: filteredData.reports.length,
    resolved: filteredData.reports.filter(r => ['done', 'archived'].includes(r.status)).length,
    pending: filteredData.reports.filter(r => ['submitted', 'reviewed'].includes(r.status)).length,
    approved: filteredData.reports.filter(r => ['approved', 'in-progress', 'done', 'archived'].includes(r.status) && r.status !== 'canceled').length,
    declined: filteredData.reports.filter(r => r.status === "declined").length,
    canceled: filteredData.reports.filter(r => ['canceled', 'canceled-archived'].includes(r.status)).length,
  };

  const certStats = {
    total: filteredData.requests.length,
    pending: filteredData.requests.filter(r => r.status === "Pending").length,
    approved: filteredData.requests.filter(r => r.status === "Approved").length,
    declined: filteredData.requests.filter(r => r.status === "Declined").length,
  };

  const reportData = [
    { name: "Approved", count: reportStats.approved },
    { name: "Declined", count: reportStats.declined },
    { name: "Resolved", count: reportStats.resolved },
    { name: "Pending", count: reportStats.pending },
  ];
  const certData = [
    { name: "Approved", count: certStats.approved },
    { name: "Declined", count: certStats.declined },
    { name: "Pending", count: certStats.pending },
  ];

  const recent = (arr) => [...arr].sort((a, b) => b.date - a.date).slice(0, 5);

  return (
    <div className="analytics-dashboard">
      <div className="time-range-selector">
        <button onClick={() => setTimeRange('daily')} className={timeRange === 'daily' ? 'active' : ''}>Daily</button>
        <button onClick={() => setTimeRange('weekly')} className={timeRange === 'weekly' ? 'active' : ''}>Weekly</button>
        <button onClick={() => setTimeRange('monthly')} className={timeRange === 'monthly' ? 'active' : ''}>Monthly</button>
        <button onClick={() => setTimeRange('all')} className={timeRange === 'all' ? 'active' : ''}>All Time</button>
      </div>

      <div className="stats-grid">
        <StatCard icon={<FaFileAlt />} label="Reports Filed" value={reportStats.total} color="#3b82f6" />
        <StatCard icon={<FaClock />} label="Pending Reports" value={reportStats.pending} color="#f97316" />
        <StatCard icon={<FaCheckCircle />} label="Approved Reports" value={reportStats.approved} color="#22c55e" />
        <StatCard icon={<FaTimesCircle />} label="Declined Reports" value={reportStats.declined} color="#ef4444" />
        <StatCard icon={<FaCheckCircle />} label="Resolved Reports" value={reportStats.resolved} color="#22c55e" />
        <StatCard icon={<FaTimesCircle />} label="Canceled Reports" value={reportStats.canceled} color="#6b7280" />
        <StatCard icon={<FaCertificate />} label="Cert. Requests" value={certStats.total} color="#3b82f6" />
        <StatCard icon={<FaClock />} label="Pending Certs" value={certStats.pending} color="#f97316" />
        <StatCard icon={<FaCheckCircle />} label="Approved Certs" value={certStats.approved} color="#22c55e" />
        <StatCard icon={<FaTimesCircle />} label="Declined Certs" value={certStats.declined} color="#ef4444" />

      </div>

      <div className="charts-grid">
        <ChartCard title="Report Status" data={reportData} />
        <ChartCard title="Certificate Status" data={certData} />
      </div>

      <div className="recent-activity-grid">
        {[
          { title: "Recent Reports", data: recent(filteredData.reports), type: "report" },
          { title: "Recent Certificate Requests", data: recent(filteredData.requests), type: "request" },
        ].map(({ title, data, type }) => (
          <div key={title} className="recent-list-container">
            <h4>{title}</h4>
            <div className="recent-list">
              {data.length ? data.map((item) => (
                <div key={item.id} className="recent-item">
                  <div>
                    <span className="item-type">{item.type}</span>
                    {type === "request" && <span className="item-requester">by {item.requester}</span>}
                  </div>
                  <span className="item-status" data-status={item.status}>{item.status}</span>
                </div>
              )) : <p className="no-recent-data">No {type}s found.</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
