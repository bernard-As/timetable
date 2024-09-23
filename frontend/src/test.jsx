import React, { useState, useEffect } from "react";
import { Table, Select, TimePicker, Button } from "antd";
import moment from "moment";

// Dummy schedule data from backend
const scheduleData = [
  {
    id: 1,
    user: "User1",
    room: "Room A",
    coursegroup: "Group 1",
    start: "08:30",
    end: "10:30",
    day: 1, // Monday
  },
  {
    id: 2,
    user: "User2",
    room: "Room B",
    coursegroup: "Group 2",
    start: "11:00",
    end: "12:30",
    day: 3, // Wednesday
  },
  {
    id: 2,
    user: "User2",
    room: "Room B",
    coursegroup: "Group 2",
    start: "15:30",
    end: "18:30",
    day: 3, // Wednesday
  },
  // Add more schedule objects
];

// Mapping day number to day names
const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const ScheduleViewer = () => {
  const [timeInterval, setTimeInterval] = useState(60); // Default 1 hour interval
  const [timeSlots, setTimeSlots] = useState([]);
  
  // Generate time slots dynamically based on the minimum interval
  useEffect(() => {
    const allTimes = scheduleData.map(item => ({
      start: moment(item.start, "HH:mm"),
      end: moment(item.end, "HH:mm"),
    }));
    
    // Find the minimum interval
    const minDuration = Math.min(
      ...allTimes.map(item => item.end.diff(item.start, "minutes"))
    );

    generateTimeSlots(minDuration);
  }, [timeInterval]);

  const generateTimeSlots = (minDuration) => {
    const slots = [];
    const startTime = moment("08:00", "HH:mm");
    const endTime = moment("18:00", "HH:mm");

    while (startTime.isBefore(endTime)) {
      const slotStart = startTime.clone();
      startTime.add(minDuration, "minutes");
      const slotEnd = startTime.clone();
      slots.push(`${slotStart.format("HH:mm")} - ${slotEnd.format("HH:mm")}`);
    }
    setTimeSlots(slots);
  };

  const handleTimeIntervalChange = (value) => {
    setTimeInterval(value);
  };

  const columns = [
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
    },
    ...daysOfWeek.map((day, index) => ({
      title: day,
      dataIndex: day.toLowerCase(),
      key: day.toLowerCase(),
      render: (text, record) => {
        const schedule = scheduleData.find(s => s.day === index + 1 && s.start === record.time.split(" - ")[0]);
        return schedule ? `${schedule.coursegroup} in ${schedule.room}` : "";
      },
    })),
  ];

  const data = timeSlots.map((slot, index) => ({
    key: index,
    time: slot,
    monday: "",
    tuesday: "",
    wednesday: "",
    thursday: "",
    friday: "",
    saturday: "",
  }));

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <Select
          defaultValue={60}
          onChange={handleTimeIntervalChange}
          style={{ width: 200 }}
        >
          <Select.Option value={30}>30-minute intervals</Select.Option>
          <Select.Option value={60}>1-hour intervals</Select.Option>
          <Select.Option value={90}>1.5-hour intervals</Select.Option>
        </Select>
      </div>

      <Table
        dataSource={data}
        columns={columns}
        pagination={false}
        bordered
      />
    </div>
  );
};

export default ScheduleViewer;
