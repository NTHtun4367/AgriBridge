import Navigation from "@/common/home/Navigation";
import Footer from "@/common/home/Footer";
import CropPriceHistory from "@/components/market/CropPriceHistory";

function CropPriceHistoryLanding() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navigation />
      <div className=" pt-24 sm:pt-32">
        <CropPriceHistory />
      </div>
      <Footer />
    </div>
  );
}

export default CropPriceHistoryLanding;
