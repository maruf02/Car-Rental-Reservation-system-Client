import React, { useState } from "react";
import {
  useDeleteBookingMutation,
  useGetMyBookingsQuery,
  useUpdateBookingMutation,
} from "../../../Redux/features/booking/bookingApi";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import Swal from "sweetalert2";
import moment from "moment";
import dayjs from "dayjs";
import { DatePicker, Space } from "antd";
import { RangePickerProps } from "antd/es/date-picker";
// interface booking{_id:string}

interface Booking {
  _id: string;
  date: string;
  startTime: string;
  endTime: string | null;
  car: {
    name: string;
    category: string;
    model: string;
    year: string;
    images: string[];
    pricePerHour: number;
  };
  totalCost: number;
  payment: "paid" | "unPaid";
  status: string;
}

const BookingManagement = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  // const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
  //   null
  // );
  const [selectedBookingId, setSelectedBookingId] = useState<Booking | null>(
    null
  );
  const [paymentBooking, setPaymentBooking] = useState<any>(null);
  const {
    data: myBooking,
    isLoading,
    refetch,
  } = useGetMyBookingsQuery(undefined);
  const [updateBooking] = useUpdateBookingMutation();
  const [deleteBooking] = useDeleteBookingMutation();

  const myBookings = myBooking?.data || [];

  console.log("myBookings", myBookings);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (myBookings.length === 0) {
    return <p>No bookings found.</p>;
  }

  const today = moment().startOf("day");

  const pastBookings = myBookings.filter((booking: any) =>
    moment(booking.date).isBefore(today)
  );
  const upcomingBookings = myBookings.filter((booking: any) =>
    moment(booking.date).isSameOrAfter(today)
  );

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
  const handlePaymentInfo = (booking: any) => {
    setPaymentBooking(booking);
    const modal = document.getElementById(
      "paymentInfoModal"
    ) as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  };

  // Payment Modal Submit
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

  const handleEditBooking = (booking: any) => {
    console.log("booking.status", booking.status);
    if (booking.status === "approved") {
      Swal.fire(
        "Cannot Edit",
        "Only Pending bookings can be edited.",
        "warning"
      );
      return;
    }

    setSelectedBookingId(booking);
    const modal = document.getElementById("editBooking") as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  };
  const handleEditFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log("selectedBookingId", selectedBookingId);
    if (!selectedBookingId || !selectedDate || !selectedTime) {
      Swal.fire({
        position: "top-end",
        icon: "warning",
        title: "Incomplete Data,Please select a date and time.",
        showConfirmButton: false,
        timer: 1500,
      });
      //   Swal.fire("Incomplete Data", "Please select a date and time.", "warning");
      return;
    }

    const updatedData = {
      date: selectedDate,
      startTime: selectedTime,
    };

    try {
      await updateBooking({
        BookingId: selectedBookingId._id,
        BookingModifyData: updatedData,
      }).unwrap();
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Booking updated successfully.",
        showConfirmButton: false,
        timer: 1500,
      });
      //   Swal.fire("Success", "Booking updated successfully.", "success");
      refetch();
    } catch (error) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Failed to update booking.",
        showConfirmButton: false,
        timer: 1500,
      });
      //   Swal.fire("Error", "Failed to update booking.", "error");
    }
  };

  const handleDeleteBooking = (booking: any) => {
    if (booking.status === "approved") {
      Swal.fire(
        "Cannot Delete",
        "Only approved bookings can be deleted.",
        "warning"
      );
      return;
    }

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteBooking(booking._id).unwrap();
          Swal.fire("Deleted!", "Your booking has been deleted.", "success");
          refetch();
        } catch (error) {
          Swal.fire(
            "Error!",
            "There was an issue deleting the booking.",
            "error"
          );
        }
      }
    });
  };

  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    return current && current < dayjs().endOf("day");
  };
  const handleDateChange = (date: dayjs.Dayjs | null) => {
    if (date) {
      const dateFormatted = date.format("YYYY-MM-DD");
      const timeFormatted = date.format("HH:mm");
      setSelectedDate(dateFormatted);
      setSelectedTime(timeFormatted);
      console.log("Date:", dateFormatted);
      console.log("Time:", timeFormatted);
    }
  };

  return (
    <div>
      <h2 className="text-3xl text-center pt-5 underline">BookingManagement</h2>
      <div>
        <h2 className="text-2xl pl-5">My Bookings:</h2>

        {/* table view */}
        <div className="pl-5 py-5 mb-5">
          <h2 className="text-2xl">Upcoming Bookings:</h2>
          <div className="container mx-auto overflow-x-auto pb-5 w-full max-w-4xl">
            <table className="table w-full">
              <thead className="text-black text-lg">
                <tr>
                  <th>Info(Name+category+model/year)</th>
                  <th>Date</th>
                  <th>Price(Hour)</th>
                  <th>Total Price</th>
                  <th>Payment</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {upcomingBookings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center">
                      No upcoming bookings.
                    </td>
                  </tr>
                ) : (
                  upcomingBookings.map((booking: any) => (
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
                          {booking.payment === "unPaid" ? (
                            <button
                              onClick={() => handlePayment(booking)}
                              className="btn btn-sm btn-secondary"
                            >
                              Unpaid
                            </button>
                          ) : (
                            <button
                              onClick={() => handlePaymentInfo(booking)}
                              className="btn btn-sm btn-primary"
                            >
                              Paid
                            </button>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="space-x-0">
                          <button
                            onClick={() => handleEditBooking(booking)}
                            className="btn btn-ghost btn-sm"
                          >
                            <FaEdit className="w-6 h-6" />
                          </button>
                          <button
                            onClick={() => handleDeleteBooking(booking)}
                            className="btn btn-ghost btn-sm"
                          >
                            <MdDeleteForever className="w-6 h-6 text-red-700" />
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

        <div className="pl-5">
          <h2 className="text-2xl">Past Bookings:</h2>
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
                {pastBookings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center">
                      No past bookings.
                    </td>
                  </tr>
                ) : (
                  pastBookings.map((booking: any) => (
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
                          {booking.payment === "unPaid" ? (
                            <button
                              onClick={() => handlePayment(booking)}
                              className="btn btn-sm btn-secondary"
                            >
                              Unpaid
                            </button>
                          ) : (
                            <button
                              onClick={() => handlePaymentInfo(booking)}
                              className="btn btn-sm btn-primary"
                            >
                              Paid
                            </button>
                          )}
                        </div>
                      </td>
                      {/* <td>
                        <div className="space-x-0">
                          <button
                            onClick={() => handleEditCar(booking._id)}
                            className="btn btn-ghost btn-sm"
                          >
                            <FaEdit className="w-6 h-6" />
                          </button>
                          <button
                            onClick={() => handleDeleteCar(booking._id)}
                            className="btn btn-ghost btn-sm"
                          >
                            <MdDeleteForever className="w-6 h-6 text-red-700" />
                          </button>
                        </div>
                      </td> */}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* table view */}

        {/* edit modal */}
        <dialog id="editBooking" className="modal ">
          <div
            className="modal-box bg-[#1A4870]  max-h-screen overflow-y-auto"
            style={{ minHeight: "60vh" }}
          >
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>
            <form onSubmit={handleEditFormSubmit}>
              <div>
                <div>
                  <p>BookingId: {selectedBookingId?._id}</p>
                </div>
                <label className="pr-12 text-white">Date:</label>
                <div className="z-20">
                  <Space direction="vertical" size={12}>
                    <DatePicker
                      format="YYYY-MM-DD HH:mm"
                      disabledDate={disabledDate}
                      // disabledTime={disabledDateTime}
                      showTime={{ defaultValue: dayjs("00:00:00", "HH:mm") }}
                      getPopupContainer={(trigger) => trigger.parentElement!}
                      onChange={handleDateChange}
                    />
                  </Space>
                </div>
              </div>

              <div className="flex justify-center my-5  ">
                <button className="flex text-white btn hover:bg-[#1A4870] bg-[#5B99C2] btn-md justify-center w-full text-2xl pb-1 ">
                  Edit
                </button>
              </div>
            </form>
          </div>
        </dialog>
        {/* edit modal */}
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
        {/* Payment info modal */}
        <dialog id="paymentInfoModal" className="modal ">
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
          </div>
        </dialog>
        {/* Payment info modal */}
      </div>
    </div>
  );
};

export default BookingManagement;
