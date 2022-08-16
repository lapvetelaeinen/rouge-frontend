import { Discovery } from "aws-sdk";
import Loading from "../components/svg/Loading";

export default function Loader() {
  return (
    <div className="h-screen flex fixed top-0 z-50">
      <div className="m-[auto] ml-[50%]">
        <Loading />
      </div>
    </div>
  );
}
