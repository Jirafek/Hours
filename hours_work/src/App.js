import { useState, useEffect } from 'react';
import styles from './App.module.css';

function App() {
  const [selectedMonth, setSelectedMonth] = useState(null);
  const NEED_WORK_FOR = 8
  const DAYS_IN_WEEK = 5
  const DAY_OFF = [6, 0]
  let weeks = {};
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
    const total = items.reduce((acc, item) => +acc + +item.total, 0);
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

  function getWeeksForMonth(month) {
    const items = data[month];
    let current_week = 0;

    items.forEach((el, i) => {
      let keys = Object.keys(weeks).map(Number);
      if (keys.includes(current_week)) {
        let day_number = new Date(el.date).getDay();
        if (day_number === 1) {
          weeks[current_week + 1] = [el]
          current_week += 1;
        } else {
          weeks[current_week].push(el)
        }
      } else {
        weeks[current_week] = [el]
      }
    })
    let sortedKeys = Object.keys(weeks).map(Number).sort((a, b) => a - b)
    return sortedKeys.map(key => weeks[key])
  }

  function getHoursInWeek(week) {
    let current_week_hours = 0

    week.forEach(el => {
      current_week_hours += +el.total
    })

    return `   ${current_week_hours}/${NEED_WORK_FOR * DAYS_IN_WEEK}`
  }

  const renderTable = () => {
    const selectedData = data[selectedMonth];
    if (!selectedData) {
      return null;
    }
    let WORK_DAYS = 0;
    selectedData.forEach(el => {
      if (!DAY_OFF.includes(new Date(el.date).getDay())) {
        WORK_DAYS += 1
      }
    });

    const weeks = getWeeksForMonth(selectedMonth);
    return (
    <div className={styles.tableTotaling}>
      <h2>Total month hours for {selectedMonth}: {getTotalForMonth(selectedMonth)} / {WORK_DAYS * NEED_WORK_FOR}</h2>
      {weeks.map((week, index) => {
        return (
          <div key={index}>
            <h3>Week {index + 1} <span style={{marginLeft: '15px'}}>{getHoursInWeek(week)}</span></h3>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Course</th>
                  <th>Day Off</th>
                </tr>
              </thead>
              <tbody>
                {week.map((item) => {
                  const isDayOff = DAY_OFF.includes(new Date(item.date).getDay());
                  return (
                    <tr style={isDayOff ? {backgroundColor: '#a9ffbb'} : {}} key={item.date}>
                      <td>{item.date}</td>
                      <td>{item.total}</td>
                      <td>{item.course}</td>
                      <td>{isDayOff ? 'true' : 'false'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      })}
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
