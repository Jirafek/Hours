import { useState, useEffect } from 'react';
import styles from './App.module.css';

function App() {
  const [selectedMonth, setSelectedMonth] = useState(null);
  const DAY_OFF = [6, 0]
  const [data, setData] = useState({
    april: [
    {
      total: 8,
      course: 3,
      date: "2023.04.03"
    }
  ]
  });

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/Jirafek/DB_hours/main/db.json')
    .then((res) => res.json())
    .then((json) => setData(json))
    .catch(err => console.log(err));
  }, []);

  const months = Object.keys(data);

  const handleClick = (month) => {
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
    let NEED_WORK_FOR = 0;
    selectedData.forEach(el => {
      console.log(new Date(el.date).getDay())
      if (!DAY_OFF.includes(new Date(el.date).getDay())) {
        NEED_WORK_FOR += 1
      }
    });
    console.log(NEED_WORK_FOR)


    return (
      <div className={styles.tableTotaling}>
      <h2>Total month hours for {selectedMonth}: {getTotalForMonth(selectedMonth)} / {selectedData.length * NEED_WORK_FOR}</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Total</th>
            <th>Course</th>
            <th>day off</th>
          </tr>
        </thead>
        <tbody>
          {selectedData.map((item) => {
            return (
              <tr key={item.date}>
                <td>{item.date}</td>
                <td>{item.total}</td>
                <td>{item.course}</td>
                <td>{`${DAY_OFF.includes(new Date(item.date).getDay())}`}</td>
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
