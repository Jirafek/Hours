import { useState } from 'react';
import axios from 'axios';
import styles from './App.module.css';
// import { data } from './db';

function App() {
  const [selectedMonth, setSelectedMonth] = useState(null);
  let data;

  const getJSON = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status === 200) {
        callback(null, xhr.response);
      } else {
        callback(status, xhr.response);
      }
    };
    xhr.send();
};

 getJSON('./db.json', function(err, dat) {
  if (err !== null) {
    alert('Something went wrong: ' + err);
    return;
  } else {
    data = dat
  }
 })

  const months = Object.keys(data);

  const handleClick = async (month) => {
    setSelectedMonth(month);
  };

  function getTotalForMonth(month) {
    const items = data[month];
    const total = items.reduce((acc, item) => acc + item.total, 0);
    return total;
  }

  const renderMonths = () => {
    return months.map((month) => {
      return (
        <div key={month} className={styles.month} onClick={() => handleClick(month)}>
          <h2>{month}</h2>
        </div>
      );
    });
  };

  const renderTable = () => {
    const selectedData = data[selectedMonth];
    if (!selectedData) {
      return null;
    }

    return (
      <div className={styles.tableTotaling}>
      <h2>Total month hours: {getTotalForMonth(selectedMonth)}</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Total</th>
            <th>Course</th>
          </tr>
        </thead>
        <tbody>
          {selectedData.map((item) => {
            return (
              <tr key={item.date}>
                <td>{item.date}</td>
                <td>{item.total}</td>
                <td>{item.course}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.months}>{renderMonths()}</div>
      {renderTable()}
    </div>
  );
}

export default App;
