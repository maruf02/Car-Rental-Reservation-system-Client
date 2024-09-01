import { useState } from "react";
import {
  useGetUserEmailQuery,
  useUpdateUserMutation,
} from "../../Redux/features/user/userApi";
import { RootState } from "../../Redux/store";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { useGetMyBookingsQuery } from "../../Redux/features/booking/bookingApi";
type User = {
  email?: string;
};
const UserHomePage = () => {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const user = useSelector((state: RootState) => state.auth.user) as User; // Access user info from Redux state
  const { email } = user;

  // Fetch user data based on email
  const {
    data: usersData,
    isLoading,
    refetch,
  } = useGetUserEmailQuery(email as string);
  const { data: myBooking } = useGetMyBookingsQuery(undefined);
  const users = usersData?.data || {};
  const { _id, image, name, phone, address } = users;
  const myBookings = myBooking?.data || [];
  const [updateUser] = useUpdateUserMutation();
  console.log(selectedUser);
  if (isLoading) {
    return <p>Loading...</p>;
  }

  const handleEditUser = (userId: string) => {
    const user = users;
    if (user) {
      setSelectedUserId(userId);
      setSelectedUser(user);

      const modal = document.getElementById(
        "editUserModal"
      ) as HTMLDialogElement;
      if (modal) {
        modal.showModal();
      }
    }
  };

  const handleEditFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const name = form.nameT.value;
    const email = form.email.value;
    const phone = form.phone.value;
    const address = form.address.value;
    const file = form.image.files[0];

    let imageUrl = image;

    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "frontend_preset");

      try {
        const response = await fetch(
          "https://api.cloudinary.com/v1_1/dnsqmhk8i/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await response.json();
        imageUrl = data.secure_url;
      } catch (error) {
        console.error("Error uploading image:", error);
        return;
      }
    }

    const userModifyData = {
      name,
      email,
      image: imageUrl,
      phone,
      address,
    };

    try {
      await updateUser({
        userId: selectedUserId,
        userModifyData,
      }).unwrap();

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Successfully Updated User info",
        showConfirmButton: false,
        timer: 1500,
      });

      const modal = document.getElementById(
        "editUserModal"
      ) as HTMLDialogElement;
      if (modal) {
        modal.close();
      }
      refetch();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <div>
      <h2 className="text-center underline text-black py-2">
        Welcome to DashBoard
      </h2>
      <div>
        <div className="flex flex-row justify-between px-5">
          <h2 className="text-3xl pl-5 text-black">Profile Info:</h2>
          <button
            onClick={() => handleEditUser(_id)}
            className="btn btn-sm bg-primary text-black"
          >
            Edit Info
          </button>
        </div>
        <dialog id="editUserModal" className="modal">
          <div className="modal-box bg-[#1A4870]">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>
            <form onSubmit={handleEditFormSubmit}>
              <div className="flex justify-center pt-5 ">
                <h1 className="text-white text-3xl ">
                  {selectedUserId ? "Edit User" : "Add New User"}
                </h1>
              </div>
              <p className="border border-1 border-gray-400 my-3 "></p>
              <div className="flex flex-col gap-2">
                {selectedUserId && (
                  <div className="text-white text-center mb-4">
                    <p>User ID: {selectedUserId}</p>
                  </div>
                )}
                <div>
                  <label className="pr-16 text-white">Name:</label>
                  <input
                    type="text"
                    name="nameT"
                    defaultValue={name}
                    placeholder="Enter user name"
                    className="input input-bordered input-primary w-full max-w-xs bg-inherit text-white"
                  />
                </div>
                <div>
                  <label className="pr-16 text-white">Email:</label>
                  <input
                    type="text"
                    readOnly
                    defaultValue={email}
                    name="email"
                    placeholder="Enter user email"
                    className="input input-bordered input-primary w-full max-w-xs bg-inherit text-white"
                  />
                </div>
                <div>
                  <label className="pr-3 text-white">Image (Optional):</label>
                  <input
                    type="file"
                    name="image"
                    className="file-input file-input-bordered file-input-primary file-input-sm w-full max-w-xs bg-transparent"
                  />
                </div>
                <div>
                  <label className="pr-16 text-white">Phone:</label>
                  <input
                    type="number"
                    defaultValue={phone}
                    name="phone"
                    placeholder="Enter user phone number"
                    className="input input-bordered input-primary w-full max-w-xs bg-inherit text-white"
                  />
                </div>

                <div className="flex flex-row align-middle">
                  <label className="pr-12 text-white">Address:</label>
                  <textarea
                    name="address"
                    defaultValue={address}
                    className="textarea textarea-bordered w-full max-w-xs bg-[#1A4870] text-white"
                    placeholder="address"
                  ></textarea>
                </div>
                <div className="flex justify-center my-5">
                  <button className="text-white btn bg-[#5B99C2] w-full text-2xl">
                    Edit
                  </button>
                </div>
              </div>
            </form>
          </div>
        </dialog>
        <section className="text-xl space-y-1 text-center flex flex-col justify-center">
          <div className="mx-auto py-5">
            <img
              src={
                image && image.includes(".co")
                  ? image
                  : "https://i.ibb.co/PrtzmM1/avator.png"
              }
              alt="User Avatar"
              className="w-56 h-32 rounded-3xl"
            />
          </div>
          <p>Name: {name}</p>
          <p>Email: {email}</p>
          <p>Phone: {phone}</p>
          <p>Address: {address}</p>
        </section>
        <div className="pl-5 pt-8">
          <div className="lg:container lg:mx-auto overflow-x-auto pb-5 w-full max-w-4xl">
            {/* Booking history */}
            {/* table view */}
            <div className="pl-5 pt-8">
              <h2 className="text-3xl pl-5 text-black">My Bookings History:</h2>
              <div className="container mx-auto overflow-x-auto pb-5 w-full max-w-4xl">
                <table className="table w-full">
                  <thead className="text-black text-lg">
                    <tr>
                      <th>Info(Name+category+model/year)</th>
                      <th>Date</th>
                      <th>Price(Hour)</th>
                      <th>Total Price</th>
                      <th>Status</th>
                      <th>Payment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myBookings.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center">
                          No upcoming bookings.
                        </td>
                      </tr>
                    ) : (
                      myBookings.map((booking: any) => (
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
                            {booking.date}({booking.startTime}-
                            {booking?.endTime})
                          </td>
                          <td>$ {booking.car.pricePerHour}</td>
                          <td>$ {booking.totalCost}</td>
                          <td> {booking.status}</td>
                          <td>
                            <div>
                              {booking.payment === "unPaid" ? (
                                <p className="btn btn-sm btn-secondary">
                                  Unpaid
                                </p>
                              ) : (
                                <p className="btn btn-sm btn-primary">Paid</p>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            {/* Booking history */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHomePage;
