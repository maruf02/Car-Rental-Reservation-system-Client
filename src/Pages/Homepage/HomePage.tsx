import BannerSection from "./BannerSection/BannerSection";
import FeatureCar from "./FeatureCar/FeatureCar";
import TestimonialSection from "./TestimonialSection/TestimonialSection";
import WhyChooseUsSection from "./WhyChooseUsSection/WhyChooseUsSection";

const HomePage = () => {
  console.log("object");
  return (
    <div>
      <BannerSection />
      <FeatureCar />
      <WhyChooseUsSection />
      <TestimonialSection />
    </div>
  );
};

export default HomePage;
