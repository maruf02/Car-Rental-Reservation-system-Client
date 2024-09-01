import React, { useState } from "react";
import StarRatings from "react-star-ratings";
import SideBySideMagnifier from "../ImageMagnifier/SideBySideMagnifier";
import Swal from "sweetalert2";
import { useGetCarByIdQuery } from "../../Redux/features/car/carApi";
import { useParams } from "react-router-dom";
import { RangePickerProps } from "antd/es/date-picker";
import { DatePicker, Space, Input, Select } from "antd";
import { DownOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { useCreateBookingMutation } from "../../Redux/features/booking/bookingApi";

const MAX_COUNT = 3;

interface User {
  _id: string;
}

interface ErrorResponse {
  message: string;
  data?: {
    message?: string;
  };
}
const BookingDetailsViewPage = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [additionValue, setAdditionValue] = useState<string[]>([]);
  const { id } = useParams<{ id: string }>();
  const user = useSelector((state: RootState) => state.auth.user) as User;
  const { _id: userId } = user;
  const { data: productsData, isLoading } = useGetCarByIdQuery(id as string);
  const [createBooking] = useCreateBookingMutation();
  const product = productsData?.data || {};
  const images = product.images || [];

  const handleBookinInfo = (carId: string) => {
    console.log("carId", carId);
    const modal = document.getElementById(
      "BookingInfoModal"
    ) as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  };
  if (isLoading) {
    <p>loding</p>;
  }
  const handleBookingFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const nidT = form.nid.value;
    const passport = form.passport.value;
    const DLicense = form.DLicense.value;
    const paymentInfo = form.paymentInfo.value;

    const BookingData = {
      nid: nidT,
      DLicense,
      passport,
      paymentInfo,
      date: selectedDate,
      carId: id,
      startTime: selectedTime,
      additionInfo: additionValue,
      user: userId,
    };

    console.log("BookingData", BookingData);

    try {
      const response = await createBooking(BookingData).unwrap();
      //   Swal.fire({
      //     position: "top-end",
      //     title: "Booking Successful",
      //     text: `Booking ID: ${response.data._id}`,
      //     icon: "success",
      //   });
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Booking Successful",
        text: `Booking ID: ${response.data._id}`,
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      const err = error as ErrorResponse;
      Swal.fire({
        title: "Booking Failed",
        text: `An error occurred: ${err.message} `,
        icon: "error",
      });
    }
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

  const suffix = (
    <>
      <span>
        {additionValue.length} / {MAX_COUNT}
      </span>
      <DownOutlined />
    </>
  );

  return (
    <div className="my-10 h-full lg:h-[700px] min-h-screen md:min-h-full">
      <div className="text-3xl text-black font-semibold underline text-center pb-8 md:pb-14">
        See your Product in details:
      </div>
      <div className="flex flex-col lg:flex-row w-11/12 mx-auto h-full gap-10">
        {/* left side portion */}
        <div className="w-full md:w-full h-full flex justify-center">
          <SideBySideMagnifier images={images} />
        </div>
        {/* Right side portion */}
        <div className="w-full lg:w-4/6 h-fit flex flex-col justify-between">
          <div>
            <h4 className="text-2xl text-black font-semibold">
              {product.name}
            </h4>
            <p className="text-2xl font-semibold">
              Price:{" "}
              <span className="text-red-500">${product.pricePerHour}</span>
            </p>
            <p className="text-2xl font-medium">
              Status:{" "}
              {product.status === "available" ? (
                <span className="text-green-500">{product.status}</span>
              ) : (
                <span className="text-red-500">{product.status}</span>
              )}
            </p>
            <p>
              Rating:
              <StarRatings
                rating={product.rating || 0}
                starRatedColor="#f39c12"
                numberOfStars={5}
                name="rating"
                starDimension="18px"
                starSpacing="1px"
              />
            </p>
            <p>Category: {product.category}</p>
            <p>Feature: {product.features?.join(", ")}</p>
            <p className="border border-2 border-gray-300 my-2"></p>
            <p>Description: {product.description}</p>
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => handleBookinInfo(product._id)}
              className="btn btn-primary mt-4 my-5 w-2/4 mt-5"
            >
              Book Now
            </button>
          </div>
        </div>
        {/* Booking Modal */}
        <dialog id="BookingInfoModal" className="modal">
          <div
            className="modal-box bg-[#1A4870] max-h-screen overflow-y-auto"
            style={{ minHeight: "90vh" }}
          >
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>
            <form onSubmit={handleBookingFormSubmit}>
              <div className="text-white space-y-4">
                <div className="flex flex-row gap-2">
                  <label className="pr-16">NID:</label>
                  <div className="z-20">
                    <Input placeholder="Basic usage" name="nid" />
                  </div>
                </div>
                <div className="flex flex-row gap-2">
                  <label className="pr-10">Passport:</label>
                  <div className="z-20">
                    <Input placeholder="Basic usage" name="passport" />
                  </div>
                </div>
                <div className="flex flex-row gap-2">
                  <label className="pr-0">Driving License:</label>
                  <div className="z-20">
                    <Input placeholder="Basic usage" name="DLicense" />{" "}
                  </div>
                </div>
                <div className="flex flex-row gap-2">
                  <label className="pr-4">Payment Info:</label>
                  <div className="z-20">
                    <Input placeholder="Basic usage" name="paymentInfo" />
                  </div>
                </div>
                <div className="flex flex-row gap-2">
                  <label className="pr-1">Additional Info:</label>
                  <div className="z-30">
                    <Select
                      mode="multiple"
                      maxCount={MAX_COUNT}
                      value={additionValue}
                      style={{ width: "200px" }}
                      onChange={setAdditionValue}
                      suffixIcon={suffix}
                      placeholder="Please select"
                      options={[
                        { value: "GPS", label: "GPS" },
                        { value: "insurance", label: "Insurance" },
                        { value: "child seat", label: "Child Seat" },
                      ]}
                      getPopupContainer={(trigger) => trigger.parentElement!}
                    />
                  </div>
                </div>
                <div className="flex flex-row gap-2">
                  <label className="pr-1">Date:</label>
                  <div className="z-20">
                    <Space direction="vertical" size={12}>
                      <DatePicker
                        format="YYYY-MM-DD HH:mm"
                        disabledDate={disabledDate}
                        showTime={{ defaultValue: dayjs("00:00:00", "HH:mm") }}
                        getPopupContainer={(trigger) => trigger.parentElement!}
                        onChange={handleDateChange}
                      />
                    </Space>
                  </div>
                </div>
                <div className="flex justify-center my-5">
                  <button className="flex text-white btn hover:bg-[#003f5c] btn-success px-6 py-2 rounded-md">
                    Confirm Booking
                  </button>
                </div>
              </div>
            </form>
          </div>
        </dialog>
      </div>
    </div>
  );
};

export default BookingDetailsViewPage;
