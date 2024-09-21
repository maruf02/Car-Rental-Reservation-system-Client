import StarRatings from "react-star-ratings";
import SideBySideMagnifier from "../ImageMagnifier/SideBySideMagnifier";

import { useGetCarByIdQuery } from "../../Redux/features/car/carApi";
import { Link, useParams } from "react-router-dom";

const CarDetailsViewPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: productsData } = useGetCarByIdQuery(id as string);
  const product = productsData?.data || {};
  const images = product.images || [];

  return (
    <div className="my-10 h-full lg:h-[700px] min-h-screen md:min-h-full">
      <div className="text-3xl text-black font-semibold underline text-center pb-8 md:pb-14">
        See your Product in details:
      </div>
      <div className="flex flex-col lg:flex-row  w-11/12   mx-auto h-full gap-10">
        {/* left side portion */}
        <div className="w-full md:w-full h-full flex justify-center  ">
          <SideBySideMagnifier images={images} />
        </div>
        {/* Right side portion */}
        <div className="w-full lg:w-4/6 h-fit  flex flex-col justify-between">
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
                <>
                  <span className="text-green-500">{product.status}</span>
                </>
              ) : (
                <>
                  <span className="text-red-500">{product.status}</span>
                </>
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

            <p className="broder border-2 border-gray-300 my-2"></p>
            <p>Description: {product.description}</p>
          </div>
          {product.status === "unavailable" ? (
            <>
              <Link to="/Booking">
                <div className="flex justify-center ">
                  <button className="btn btn-primary mt-4 my-5 w-2/4 mt-5">
                    Book Now
                  </button>

                  <br />
                </div>
              </Link>
            </>
          ) : (
            <>
              <Link to="/Booking">
                <div className="flex justify-center ">
                  <button className="btn btn-primary mt-4 my-5 w-2/4 mt-5">
                    Book Now
                  </button>

                  <br />
                </div>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarDetailsViewPage;
