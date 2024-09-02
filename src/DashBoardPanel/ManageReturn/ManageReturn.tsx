import React, { useState } from "react";
import Swal from "sweetalert2";
import {
  useGetAllBookingsQuery,
  useReturnBookingMutation,
} from "../../Redux/features/booking/bookingApi";
import { TimePicker } from "antd";
import dayjs from "dayjs";

const ManageReturn = () => {
  const [startTime, setStartTime] = useState<string | null>(null);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null
  );
  const [returnTime, setReturnTime] = useState<dayjs.Dayjs | null>(null);
  const {
    data: allBooking,
    isLoading,
    refetch,
  } = useGetAllBookingsQuery(undefined);
  const [returnBooking] = useReturnBookingMutation();

  const allBookings = allBooking?.data || [];

  console.log("myBookings", allBookings);
  if (isLoading) {
    return <p>Loading...</p>;
  }

  const handleReturn = (bookingId: string, start: string) => {
    setSelectedBookingId(bookingId);
    setStartTime(start);
    const modal = document.getElementById("returnModal") as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  };

  const handleReturnFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const returnData = {
      bookingId: selectedBookingId,
      endTime: returnTime?.format("HH:mm"),
    };
    try {
      await returnBooking(returnData).unwrap();
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Return request submitted successfully.",
        showConfirmButton: false,
        timer: 1500,
      });
      refetch();

      const modal = document.getElementById("returnModal") as HTMLDialogElement;
      if (modal) {
        modal.close();
      }
    } catch (error) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "An error occurred. Please try again.",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const disabledHours = () => {
    if (!startTime) return [];
    const startHour = dayjs(startTime, "HH:mm").hour();
    return Array.from({ length: startHour }, (_, index) => index);
  };

  const disabledMinutes = (selectedHour: number) => {
    if (!startTime) return [];
    const startMinute = dayjs(startTime, "HH:mm").minute();
    const startHour = dayjs(startTime, "HH:mm").hour();
    if (selectedHour === startHour) {
      return Array.from({ length: startMinute }, (_, index) => index);
    }
    return [];
  };

  return (
    <div>
      <h1 className="text-2xl text-center">Return Management:</h1>
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
                              alt="Avatar"
                              className="w-full h-full"
                            />
                          </div>
                          <div>
                            <div className="font-semibold">
                              {booking.car.name}
                            </div>
                            <div className="font-semibold">
                              {booking.car.category}
                            </div>
                            <div className="font-semibold">
                              {booking.car.model}
                            </div>
                            <div className="font-semibold">
                              {booking.car.year}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>{booking.user.email}</td>
                      <td>
                        {booking.date} ({booking.startTime}-{booking?.endTime})
                      </td>
                      <td>$ {booking.car.pricePerHour}</td>
                      <td>$ {booking.totalCost}</td>
                      <td>
                        <div className="flex flex-row gap-2">
                          {booking.endTime === null ? (
                            <button
                              onClick={() =>
                                handleReturn(booking._id, booking.startTime)
                              }
                              className="btn btn-sm btn-primary"
                            >
                              Return
                            </button>
                          ) : (
                            <button disabled className="btn btn-sm btn-primary">
                              Return
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Return Modal */}
            <dialog id="returnModal" className="modal">
              <div
                className="modal-box bg-[#1A4870] max-h-screen overflow-y-auto"
                style={{ minHeight: "60vh" }}
              >
                <form method="dialog">
                  <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                    ✕
                  </button>
                </form>
                <form onSubmit={handleReturnFormSubmit}>
                  <div>
                    <p className="text-white">BookingId: {selectedBookingId}</p>
                    <label className="pr-12 text-white">Return Time:</label>
                    <TimePicker
                      value={returnTime}
                      onChange={setReturnTime}
                      format="HH:mm"
                      defaultOpenValue={dayjs("00:00", "HH:mm")}
                      getPopupContainer={(trigger) => trigger.parentElement!}
                      disabledHours={disabledHours}
                      disabledMinutes={disabledMinutes}
                    />
                  </div>
                  <div className="flex justify-center my-5">
                    <button
                      type="submit"
                      className="flex text-white btn hover:bg-[#1A4870] bg-[#5B99C2] btn-md justify-center w-full text-2xl pb-1"
                    >
                      Return
                    </button>
                  </div>
                </form>
              </div>
            </dialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageReturn;
