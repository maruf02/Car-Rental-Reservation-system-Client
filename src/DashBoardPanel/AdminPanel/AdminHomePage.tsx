import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useGetAllBookingsQuery } from "../../Redux/features/booking/bookingApi";
import { useGetAllCarsQuery } from "../../Redux/features/car/carApi";

// Define types for booking and car data
interface Booking {
  totalCost?: number;
}

interface Car {
  status: string;
}

// Define the type for the TriangleBar props
interface TriangleBarProps {
  fill: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

// Define types for chart data
interface ChartData {
  name: string;
  value: number;
}

const colors: string[] = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "red",
  "pink",
];

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

// Define the TriangleBar component
const TriangleBar = (props: TriangleBarProps) => {
  const { fill, x, y, width, height } = props;

  return <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />;
};

// Wrap TriangleBar in a function to conform to Recharts' shape prop
const CustomShape = (props: any) => <TriangleBar {...props} />;

const AdminHomePage = () => {
  const {
    data: allBooking,
    isLoading: isLoadingBookings,
    isError: isErrorBookings,
  } = useGetAllBookingsQuery(undefined);
  const {
    data: carData,
    isLoading: isLoadingCars,
    isError: isErrorCars,
  } = useGetAllCarsQuery(undefined);

  const allBookings: Booking[] = allBooking?.data || [];
  const AllcarData: Car[] = carData?.data || [];

  if (isLoadingBookings || isLoadingCars) {
    return <p>Loading...</p>;
  }

  if (isErrorBookings || isErrorCars) {
    return <p>Error loading data.</p>;
  }

  const totalBooking = allBookings.length;
  const totalRevenue = Array.isArray(allBookings)
    ? allBookings.reduce((sum, booking) => sum + (booking.totalCost || 0), 0)
    : 0;

  const availableCars = Array.isArray(AllcarData)
    ? AllcarData.filter((car) => car.status === "available")
    : [];

  const chartData: ChartData[] = [
    { name: "Total Bookings", value: totalBooking },
    { name: "Total Revenue", value: totalRevenue },
    { name: "Available Cars", value: availableCars.length },
  ];

  return (
    <div className="w-full h-full min-h-screen bg-white border border-2 border-red-500 px-5 mx-2">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      <div className="flex flex-col md:flex-row justify-center items-center gap-5">
        <h2 className="text-2xl font-bold mb-4">Summary</h2>
        <div className="flex flex-col items-center text-center">
          <p className="text-xl">Total Bookings: {totalBooking}</p>
          <p className="text-xl">Total Booking Revenue: ${totalRevenue}</p>
          <p className="text-xl">
            Total Available Cars: {availableCars.length}
          </p>
        </div>
        <div className="w-full max-w-4xl">
          <h2 className="text-xl font-bold mb-4">Chart View</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Bar
                dataKey="value"
                fill="#8884d8"
                shape={CustomShape} // Pass the function wrapping the component
                label={{ position: "top" }}
              >
                {chartData.map((_, index: number) => (
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
    </div>
  );
};

export default AdminHomePage;
