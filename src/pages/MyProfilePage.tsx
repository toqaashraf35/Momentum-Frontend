import Header from "../layouts/Header";
import PersonalInfoCard from "../layouts/PersonalInfoCard";
import ProfileCard from "../layouts/ProfileCard";

export default function HomePage() {
  return (
    <div className="bg-[var(--bg)] min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 flex flex-col pt-20">
        <div className="w-full">
          <ProfileCard />
        </div>

        <div className="w-full flex justify-end pr-4 mt-4">
          <div className="w-full max-w-lg">
            <PersonalInfoCard />
          </div>
        </div>
      </div>
    </div>
  );
}
