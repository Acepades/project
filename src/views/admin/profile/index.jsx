import Banner from "./components/Banner";
import BadgeGrid from "./components/BadgeGrid";
const ProfileOverview = () => {
 
  return (
    <div className="flex w-full flex-col gap-5">
      <div className="w-ful mt-3 flex h-fit flex-col gap-5 lg:grid lg:grid-cols-12">
        <div className="col-span-12 lg:!mb-0">
          <Banner />
          <BadgeGrid/>
        </div>
      </div>
      <div style={{ height: "50vh" }}></div>
    </div>
  );
};

export default ProfileOverview;
