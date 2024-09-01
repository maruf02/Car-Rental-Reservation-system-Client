import { motion } from "framer-motion";
import { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Virtual, Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useRef } from "react";
import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa";

const teamMembers = [
  {
    name: "Alice Brown",
    role: "Founder & CEO",
    image: "https://i.postimg.cc/sgdj6mTv/download-1.jpg",
    bio: "Alice is an outdoor enthusiast who started Camper Shop to inspire others to explore the beauty of nature.",
  },
  {
    name: "Michael Green",
    role: "Lead Designer",
    image: "https://i.postimg.cc/X7yNkmcR/download.png",
    bio: "Michael is passionate about creating innovative designs that blend functionality with aesthetics, ensuring every product stands out.",
  },
  {
    name: "Sophia Williams",
    role: "Customer Support",
    image: "https://i.postimg.cc/sgdj6mTv/download-1.jpg",
    bio: "Sophia is committed to delivering exceptional customer service, making sure every camper's needs are met with care.",
  },
  {
    name: "David Thompson",
    role: "Product Manager",
    image: "https://i.postimg.cc/X7yNkmcR/download.png",
    bio: "David oversees the product development process, ensuring that every item is crafted with the highest standards of quality and durability.",
  },
  {
    name: "Olivia Martinez",
    role: "Marketing Specialist",
    image: "https://i.postimg.cc/sgdj6mTv/download-1.jpg",
    bio: "Olivia creates impactful marketing campaigns that resonate with outdoor lovers and share our brand’s story.",
  },
  {
    name: "Lucas Miller",
    role: "Operations Manager",
    image: "https://i.postimg.cc/sgdj6mTv/download-1.jpg",
    bio: "Lucas ensures smooth operations across all departments, keeping Camper Shop running efficiently and effectively.",
  },
  {
    name: "Emma Johnson",
    role: "Logistics Coordinator",
    image: "https://i.postimg.cc/X7yNkmcR/download.png",
    bio: "Emma manages the logistics with precision, ensuring timely delivery of our products to customers around the globe.",
  },
  {
    name: "Benjamin Lee",
    role: "Financial Analyst",
    image: "https://i.postimg.cc/sgdj6mTv/download-1.jpg",
    bio: "Benjamin analyzes financial data to help Camper Shop make informed decisions and maintain a healthy growth trajectory.",
  },
  {
    name: "Isabella Davis",
    role: "Social Media Manager",
    image: "https://i.postimg.cc/X7yNkmcR/download.png",
    bio: "Isabella manages our social media presence, crafting content that engages and grows our community of adventurers.",
  },
  {
    name: "James White",
    role: "E-commerce Specialist",
    image: "https://i.postimg.cc/sgdj6mTv/download-1.jpg",
    bio: "James optimizes our online store, ensuring a seamless shopping experience for all our customers.",
  },
  {
    name: "Charlotte Harris",
    role: "Content Creator",
    image: "https://i.postimg.cc/X7yNkmcR/download.png",
    bio: "Charlotte is the creative mind behind our blog and video content, sharing tips and inspiration for outdoor adventures.",
  },
  {
    name: "Henry Wilson",
    role: "IT Specialist",
    image: "https://i.postimg.cc/sgdj6mTv/download-1.jpg",
    bio: "Henry maintains our technical infrastructure, ensuring that all our systems are secure and running smoothly.",
  },
  {
    name: "Ava Anderson",
    role: "Event Coordinator",
    image: "https://i.postimg.cc/X7yNkmcR/download.png",
    bio: "Ava organizes our community events, bringing together outdoor enthusiasts to share their love for camping and nature.",
  },
];

const TestimonialSection = () => {
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
      <div className="py-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2 }}
          className="text-center"
        >
          <h2 className="text-3xl font-semibold mb-6">
            What Client say About Us
          </h2>
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
            className="h-96"
          >
            {teamMembers.map((member, index) => (
              <SwiperSlide key={index} virtualIndex={index}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white rounded-lg shadow-lg p-6 mx-auto w-full sm:w-3/4"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 mx-auto rounded-full mb-4"
                  />
                  <h3 className="text-xl font-medium">{member.name}</h3>
                  {/* <p className="text-sm text-gray-500">{member.role}</p> */}
                  <p className="mt-2 text-gray-700 flex ">
                    <FaQuoteLeft />
                    {member.bio}
                    <FaQuoteRight />
                  </p>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </div>
  );
};

export default TestimonialSection;
