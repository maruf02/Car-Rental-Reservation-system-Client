import { useRef } from "react";
import { FaLongArrowAltRight } from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";

import { motion } from "framer-motion";
import { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Virtual, Navigation, Pagination, Autoplay } from "swiper/modules";
import { useGetAllCarsQuery } from "../../../Redux/features/car/carApi";
import StarRatings from "react-star-ratings";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const FeatureCar = () => {
  const swiperRef = useRef<SwiperType | null>(null);

  const {
    data: productsData,
    isError,
    isLoading,
  } = useGetAllCarsQuery(undefined);

  const handleMouseEnter = () => {
    if (swiperRef.current && swiperRef.current.autoplay) {
      swiperRef.current.autoplay.stop();
    }
  };

  const handleMouseLeave = () => {
    if (swiperRef.current && swiperRef.current.autoplay) {
      swiperRef.current.autoplay.start();
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (isError) {
    return <div>Error loading products</div>;
  }

  const getRandomProducts = (products: any) => {
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 8);
  };

  const randomProducts = getRandomProducts(productsData?.data || []);
  return (
    <div>
      <div>
        <div className="w-full h-full my-5">
          {/* title section */}
          <div className="flex flex-row justify-between py-5">
            <h1 className="text-xl md:text-3xl text-black font-bold">
              Featured Products:
            </h1>
            <NavLink to="/products" className="activeNavLink ">
              <button className="btn btn-primary btn-sm flex flex-row justify-center align-middle items-center gap-1 mr-5">
                View More
                <FaLongArrowAltRight className="text-black" />
              </button>
            </NavLink>
          </div>
          <div className="border border-2 border-gray-400"></div>
          {/* product view section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2 }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="px-8 mt-5 w-full h-[full] my-1">
              <div className="flex flex-wrap justify-center align-middle gap-5">
                {randomProducts.length === 0 ? (
                  <p>Sorry, no products available</p>
                ) : (
                  <Swiper
                    // ref={swiperRef}
                    onSwiper={(swiper) => {
                      swiperRef.current = swiper;
                    }}
                    direction="horizontal"
                    slidesPerView={1}
                    breakpoints={{
                      640: {
                        slidesPerView: 1,
                      },
                      768: {
                        slidesPerView: 2,
                      },
                      1024: {
                        slidesPerView: 3,
                      },
                      1280: {
                        slidesPerView: 4,
                      },
                      1536: {
                        slidesPerView: 5,
                      },
                    }}
                    spaceBetween={10}
                    virtual
                    navigation
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 1000, disableOnInteraction: false }}
                    modules={[Virtual, Navigation, Pagination, Autoplay]}
                    className="h-[650px]"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    {randomProducts.map((product) => (
                      <SwiperSlide key={product._id}>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          onMouseEnter={handleMouseEnter}
                          onMouseLeave={handleMouseLeave}
                        >
                          <Link to={`/ProductDetailsView/${product._id}`}>
                            <div className="card glass w-80">
                              <figure>
                                <img
                                  src={product.images[0]}
                                  alt={product.name}
                                  className="w-80 h-60"
                                />
                              </figure>
                              <div className="my-5">
                                <div className="space-y-0 pl-5">
                                  <div className="badge badge-outline">
                                    {product.category}
                                  </div>
                                  <h2 className="card-title m-0 py-1 text-2xl w-full h-20">
                                    {product.name}
                                  </h2>
                                  <div className="flex justify-between align-middle pr-5 pb-3">
                                    <p className="m-0 text-lg">
                                      PricePerHour: ${product.pricePerHour}
                                    </p>
                                    <StarRatings
                                      rating={product.rating}
                                      starRatedColor="#f39c12"
                                      numberOfStars={5}
                                      name="rating"
                                      starDimension="18px"
                                      starSpacing="1px"
                                    />
                                  </div>
                                  <p className="m-0 text-md h-20">
                                    Description: {product.description}
                                  </p>
                                  <p className="w-full h-20 flex flex-row flex-wrap py-5">
                                    Feature:
                                    {product.features.map((product: any) => (
                                      <>
                                        <div
                                          key={product._id}
                                          className="badge badge-outline"
                                        >
                                          {product}
                                        </div>
                                      </>
                                    ))}
                                  </p>
                                  {/* <div className="badge badge-outline">
                                    Feature: {product.features.join(", ")}
                                  </div> */}
                                </div>
                                <Link to={`/ProductDetailsView/${product._id}`}>
                                  <div className="card-actions mt-3">
                                    <button className="btn btn-primary w-full">
                                      View Details
                                    </button>
                                  </div>
                                </Link>
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                )}
              </div>
            </div>
          </motion.div>
          {/* product view section */}
          <div className="flex flex-row justify-between">
            <h1></h1>
            <NavLink to="/products" className="activeNavLink ">
              <button className="btn btn-primary btn-sm flex flex-row justify-center align-middle items-center gap-1 mr-5">
                View More
                <FaLongArrowAltRight className="text-black" />
              </button>
            </NavLink>
          </div>
          {/* product view section */}
        </div>
      </div>
    </div>
  );
};

export default FeatureCar;
