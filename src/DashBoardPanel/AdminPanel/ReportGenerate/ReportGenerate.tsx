import React, { useState, useRef, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";
import {
  PDFDownloadLink,
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { useGetAllBookingsQuery } from "../../../Redux/features/booking/bookingApi";
import { useGetAllCarsQuery } from "../../../Redux/features/car/carApi";
import { toPng } from "html-to-image";

// Define types for the booking and car objects
interface Booking {
  date: string;
  totalCost?: number;
}

interface Car {
  status: string;
}

// Styles for PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
  },
  section: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
  },
  chartImage: {
    marginTop: 20,
    width: "100%",
    height: 300,
  },
});

interface ReportPDFProps {
  bookings: Booking[];
  cars: Car[];
  chartImage: string | null;
}

const ReportPDF: React.FC<ReportPDFProps> = ({
  bookings,
  cars,
  chartImage,
}) => {
  const totalBookings = bookings.length;
  const totalRevenue = bookings.reduce(
    (sum, booking) => sum + (booking.totalCost || 0),
    0
  );
  const availableCars = cars.filter((car) => car.status === "available").length;

  return (
    <Document>
      <Page style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>Report Summary</Text>
          <Text style={styles.text}>Total Bookings: {totalBookings}</Text>
          <Text style={styles.text}>Total Revenue: ${totalRevenue}</Text>
          <Text style={styles.text}>Available Cars: {availableCars}</Text>
        </View>
        {chartImage && (
          <View style={styles.section}>
            <Text style={styles.title}>Chart</Text>
            <Image src={chartImage} style={styles.chartImage} />
          </View>
        )}
      </Page>
    </Document>
  );
};

const getPath = (x: number, y: number, width: number, height: number) => {
  return `M${x},${y + height}C${x + width / 3},${y + height} ${x + width / 2},${
    y + height / 3
  }
  ${x + width / 2}, ${y}
  C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height} ${
    x + width
  }, ${y + height}
  Z`;
};

interface TriangleBarProps {
  fill: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

const TriangleBar: React.FC<TriangleBarProps> = (props) => {
  const { fill, x, y, width, height } = props;

  return <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />;
};
const CustomShape = (props: any) => <TriangleBar {...props} />;
const ReportGenerate: React.FC = () => {
  const [interval, setInterval] = useState<string>("daily");
  const [chartImage, setChartImage] = useState<string | null>(null);
  const chartRef = useRef<HTMLDivElement | null>(null);

  const {
    data: booking,
    isLoading: loadingBookings,
    isError: errorBookings,
  } = useGetAllBookingsQuery(undefined);
  const {
    data: car,
    isLoading: loadingCars,
    isError: errorCars,
  } = useGetAllCarsQuery(undefined);

  const bookings: Booking[] = booking?.data || [];
  const cars: Car[] = car?.data || [];

  const filteredBookings = bookings.filter((booking) => {
    const bookingDate = new Date(booking.date);
    const now = new Date();
    if (interval === "daily")
      return bookingDate.toDateString() === now.toDateString();
    if (interval === "weekly")
      return (
        (now.getTime() - bookingDate.getTime()) / (1000 * 60 * 60 * 24 * 7) < 1
      );
    if (interval === "monthly")
      return bookingDate.getMonth() === now.getMonth();
    if (interval === "yearly")
      return bookingDate.getFullYear() === now.getFullYear();
    return true;
  });

  const totalBookings = filteredBookings.length;
  const totalRevenue = filteredBookings.reduce(
    (sum, booking) => sum + (booking.totalCost || 0),
    0
  );
  const availableCars = cars.filter((car) => car.status === "available").length;

  const chartData = [
    { name: "Total Bookings", value: totalBookings },
    { name: "Total Revenue", value: totalRevenue },
    { name: "Available Cars", value: availableCars },
  ];

  const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  useEffect(() => {
    if (chartRef.current) {
      toPng(chartRef.current).then((dataUrl) => {
        setChartImage(dataUrl);
      });
    }
  }, [chartData]);

  if (loadingBookings || loadingCars) return <p>Loading...</p>;

  if (errorBookings || errorCars) return <p>Error loading data.</p>;

  if (!bookings || !cars) return <p>No data available.</p>;

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4">Report Generate</h2>
      <div className="mb-4">
        <label className="mr-2">Filter By:</label>
        <select
          value={interval}
          onChange={(e) => setInterval(e.target.value)}
          className="p-2 border border-gray-300 rounded bg-white"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>
      <div className="mb-4">
        <h3 className="text-xl font-bold">Report Summary</h3>
        <p>Total Bookings: {totalBookings}</p>
        <p>Total Booking Revenue: ${totalRevenue}</p>
        <p>Total Available Cars: {availableCars}</p>
      </div>
      <div className="mb-4">
        <h3 className="text-xl font-bold">Chart View</h3>
        <div ref={chartRef} style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="value"
                fill="#8884d8"
                shape={CustomShape}
                label={{ position: "top" }}
              >
                {chartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div>
        <h3 className="text-xl font-bold">Download PDF</h3>
        <button className="btn btn-sm btn-primary">
          <PDFDownloadLink
            document={
              <ReportPDF
                bookings={filteredBookings}
                cars={cars}
                chartImage={chartImage}
              />
            }
            fileName="report.pdf"
          >
            {({ loading }) =>
              loading ? "Loading document..." : "Download Report"
            }
          </PDFDownloadLink>
        </button>
      </div>
    </div>
  );
};

export default ReportGenerate;
