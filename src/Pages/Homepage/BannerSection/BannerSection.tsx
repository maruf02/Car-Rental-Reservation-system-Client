import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Button, DatePicker, Input } from "antd";
import dayjs from "dayjs";
import { RangePickerProps } from "antd/es/date-picker";
import { Swiper as SwiperType } from "swiper";
import { useRef } from "react";
import { motion } from "framer-motion";

const images = [
  "https://i.postimg.cc/tC68tQ11/pexels-soumil-kumar-4325-735911.jpg",
  "https://i.postimg.cc/tC68tQ11/pexels-soumil-kumar-4325-735911.jpg",
  "https://i.postimg.cc/tC68tQ11/pexels-soumil-kumar-4325-735911.jpg",
  "https://i.postimg.cc/tC68tQ11/pexels-soumil-kumar-4325-735911.jpg",
  "https://i.postimg.cc/tC68tQ11/pexels-soumil-kumar-4325-735911.jpg",
];

const disabledDate: RangePickerProps["disabledDate"] = (current) => {
  // Can not select days before today and today
  return current && current < dayjs().endOf("day");
};

const BannerSection = () => {
  const swiperRef = useRef<SwiperType | null>(null);

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
  return (
    <div>
      <div className="mb-5">
        <Swiper
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          spaceBetween={30}
          centeredSlides={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          modules={[Autoplay, Pagination, Navigation]}
          className="mySwiper w-full h-fit"
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                // className="bg-white rounded-lg shadow-lg p-6 mx-auto w-full sm:w-3/4"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div className="relative">
                  <img
                    src={image}
                    alt={`Slide ${index + 1}`}
                    className="object-cover w-full h-[600px]"
                  />
                  <div className="absolute top-0 left-0 w-full h-full bg-black opacity-60"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white z-10">
                    <h1 className="text-2xl lg:text-5xl font-bold mb-5 text-[#F9DBBA]">
                      Welcome To CAMPER SHOP
                    </h1>
                    <div className="text-xl lg:text-3xl font-semibold text-[#5B99C2] mb-5">
                      Get Your Result by Searching your time and location
                      <div className="pt-5">
                        <Input
                          placeholder="Enter location"
                          className="w-2/6 mr-1"
                        />
                        <DatePicker
                          format="YYYY-MM-DD "
                          disabledDate={disabledDate}
                          // showTime={{
                          //   defaultValue: dayjs("00:00:00", "HH:mm:ss"),
                          // }}
                        />
                      </div>
                      <Button
                        type="primary"
                        style={{
                          backgroundColor: "#5B99C2",
                          borderColor: "#5B99C2",
                        }}
                        className="mt-2"
                      >
                        Book Now
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default BannerSection;
