import Header from "../layouts/Header";
import Chat from "../layouts/Chat";

export default function HomePage() {
  return (
    <>
      <div className="grid grid-rows-[18%_1fr]">
        <div>
          <Header />
        </div>
        <div>
          <Chat />
        </div>
      </div>
    </>
  );
}
