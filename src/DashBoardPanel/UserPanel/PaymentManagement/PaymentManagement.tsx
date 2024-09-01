import { useState } from "react";
import {
  useGetMyBookingsQuery,
  useUpdateBookingMutation,
} from "../../../Redux/features/booking/bookingApi";
import Swal from "sweetalert2";

const PaymentManagement = () => {
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null
  );
  const [paymentBooking, setPaymentBooking] = useState<any>(null);
  const {
    data: myBooking,
    isLoading,
    refetch,
  } = useGetMyBookingsQuery(undefined);
  const [updateBooking] = useUpdateBookingMutation();
  console.log(selectedBookingId, setSelectedBookingId);
  const myBookings = myBooking?.data || [];

  console.log("myBookings", myBookings);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  const unpaidBookings =
    myBookings?.filter((booking: any) => booking.payment === "unPaid") || [];

  const handlePayment = (booking: any) => {
    if (booking.endTime === null) {
      Swal.fire({
        position: "top-end",
        icon: "warning",
        title: "Payment cannot be processed because Car is not Return.",
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      setPaymentBooking(booking);
      const modal = document.getElementById(
        "paymentModal"
      ) as HTMLDialogElement;
      if (modal) {
        modal.showModal();
      }
    }
  };
  const handlePaymentSubmit = async () => {
    if (paymentBooking) {
      try {
        await updateBooking({
          BookingId: paymentBooking._id,
          BookingModifyData: { payment: "paid" },
        }).unwrap();
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Payment successful.",
          showConfirmButton: false,
          timer: 1500,
        });
        refetch();
      } catch (error) {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Payment failed.",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    }
  };
  return (
    <div>
      <h1 className=" text-4xl text-center pt-5">PaymentManagement</h1>
      <div>
        <div className="pl-5">
          <h2 className="text-2xl pt-2">Past Bookings:</h2>
          <div className="container mx-auto overflow-x-auto pb-5 w-full max-w-4xl">
            <table className="table w-full">
              <thead className="text-black text-lg">
                <tr>
                  <th>Info(Name+category+model/year)</th>
                  <th>Date</th>
                  <th>Price(Hour)</th>
                  <th>Total Price</th>
                  <th>Payment</th>
                  {/* <th>Actions</th> */}
                </tr>
              </thead>
              <tbody>
                {unpaidBookings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center">
                      <h2 className="text-center py-10">No Unpaid bookings.</h2>
                    </td>
                  </tr>
                ) : (
                  unpaidBookings.map((booking: any) => (
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
                      <td>
                        {booking.date}({booking.startTime}-{booking?.endTime})
                      </td>
                      <td>$ {booking.car.pricePerHour}</td>
                      <td>$ {booking.totalCost}</td>
                      <td>
                        <div>
                          <button
                            onClick={() => handlePayment(booking)}
                            className="btn btn-sm btn-secondary"
                          >
                            Unpaid
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            {/* Payment modal */}
            <dialog id="paymentModal" className="modal ">
              <div
                className="modal-box bg-[#1A4870]  max-h-screen overflow-y-auto"
                style={{ minHeight: "60vh" }}
              >
                <form method="dialog">
                  <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                    ✕
                  </button>
                </form>
                <div>
                  <p className="text-white">
                    Date: {paymentBooking?.date}({paymentBooking?.startTime}-
                    {paymentBooking?.endTime})
                  </p>
                  <p className="text-white">
                    Price Per Hour: ${paymentBooking?.car.pricePerHour}
                  </p>
                  <p className="text-white">
                    Total Price: ${paymentBooking?.totalCost}
                  </p>
                </div>
                <div className="flex justify-center my-5">
                  <button
                    onClick={handlePaymentSubmit}
                    className="flex text-white btn hover:bg-[#1A4870] bg-[#5B99C2] btn-md justify-center w-full text-2xl pb-1 "
                  >
                    Proceed to Pay
                  </button>
                </div>
              </div>
            </dialog>
            {/* Payment modal */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentManagement;
