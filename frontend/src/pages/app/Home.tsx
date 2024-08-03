import React, { useEffect, useState, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

function getTodayDate() {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

const TasksChart: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any>({});
  const chartRef = useRef<any>(null);

  const fetchTasks = async () => {
    const todayDate = getTodayDate();
    try {
      const response = await axios.get(`/api/tasks?day=${todayDate}`);
      setTasks(response.data.tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const prepareChartData = () => {
    const taskHours: { [key: string]: number } = {};
    tasks.forEach((task) => {
      const duration = (new Date(task.endTime).getTime() - new Date(task.startTime).getTime()) / (1000 * 60 * 60);
      taskHours[task.description] = (taskHours[task.description] || 0) + duration;
    });

    const labels = Object.keys(taskHours);
    const data = Object.values(taskHours);

    setChartData({
      labels,
      datasets: [
        {
          label: 'Total Hours per Task',
          data,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    });
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    prepareChartData();
  }, [tasks]);

  useEffect(() => {
    const chartInstance = chartRef.current;

    // Cleanup on unmount
    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, [chartData]);

  return (
    <div className="mt-5 w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Current Tasks Overview</h2>
      {chartData.labels && chartData.labels.length > 0 ? (
        <Bar
          ref={chartRef}
          data={chartData}
          options={{
            responsive: true,
          }}
        />
      ) : (
        <p>No tasks available to display.</p>
      )}
    </div>
  );
};

export default TasksChart;
