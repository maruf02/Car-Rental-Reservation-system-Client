import {
  useDeleteBookingMutation,
  useGetAllBookingsQuery,
  useUpdateBookingMutation,
} from "../../../Redux/features/booking/bookingApi";
import Swal from "sweetalert2";

const ManageBooking = () => {
  const {
    data: allBooking,
    isLoading,
    refetch,
  } = useGetAllBookingsQuery(undefined);
  const [updateBooking] = useUpdateBookingMutation();
  const [deleteBooking] = useDeleteBookingMutation();
  const allBookings = allBooking?.data || [];

  console.log("myBookings", allBookings);
  if (isLoading) {
    <p>Loding</p>;
  }

  const handleApprove = async (bookingId: string) => {
    try {
      await updateBooking({
        BookingId: bookingId,
        BookingModifyData: { status: "approved" },
      }).unwrap();
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Booking approved successfully.",
        showConfirmButton: false,
        timer: 1500,
      });
      refetch();
    } catch (error) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Failed to approve booking.",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };
  const handleApproved = () => {
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Already Approved. No action need",
      showConfirmButton: false,
      timer: 1500,
    });
  };
  const handleCancel = async (bookingId: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, cancel it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteBooking(bookingId).unwrap();
          Swal.fire(
            "Cancelled!",
            "Your booking has been cancelled.",
            "success"
          );
          refetch();
        } catch (error) {
          Swal.fire(
            "Error!",
            "There was an issue cancelling the booking.",
            "error"
          );
        }
      }
    });
  };

  return (
    <div>
      <h1 className="text-2xl text-center">Booking Management:</h1>
      <div>
        {/* table view */}
        <div className="pl-5">
          <h2 className="text-2xl">All Bookings:</h2>
          <div className="container mx-auto overflow-x-auto pb-5 w-full max-w-4xl">
            <table className="table w-full">
              <thead className="text-black text-lg">
                <tr>
                  <th>Info(Name+category+model/year)</th>
                  <th>User Email</th>
                  <th>Date</th>
                  <th>Price(Hour)</th>
                  <th>Total Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {allBookings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center">
                      No upcoming bookings.
                    </td>
                  </tr>
                ) : (
                  allBookings.map((booking: any) => (
                    <tr key={booking._id} className="hover:bg-gray-300">
                      <td>
                        <div className="flex flex-row gap-2">
                          <div className="mask mask-squircle h-12 w-12">
                            <img
                              src={booking.car.images[0]}
                              alt="Avatar Tailwind CSS Component"
                              className="w-full h-full"
                            />
                          </div>
                          <div>
                            <div>
                              <div className="font-semibold">
                                {booking.car.name}
                              </div>
                              <div>
                                <div className="font-semibold">
                                  {booking.car.category}
                                </div>
                              </div>
                              <div>
                                <div className="font-semibold">
                                  {booking.car.model}
                                </div>
                              </div>
                              <div>
                                <div className="font-semibold">
                                  {booking.car.year}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>{booking.user.email}</td>
                      <td>
                        {booking.date}({booking.startTime}-{booking?.endTime})
                      </td>
                      <td>$ {booking.car.pricePerHour}</td>
                      <td>$ {booking.totalCost}</td>
                      <td>
                        <div className="flex flex-row gap-2">
                          {booking.status !== "approved" ? (
                            <>
                              <button
                                onClick={() => handleApprove(booking._id)}
                                className="btn btn-sm btn-secondary"
                              >
                                Approve
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={handleApproved}
                                className="btn btn-sm btn-primary"
                              >
                                Approved
                              </button>
                            </>
                          )}

                          <button
                            onClick={() => handleCancel(booking._id)}
                            className="btn btn-sm btn-primary"
                          >
                            Cancel
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageBooking;
