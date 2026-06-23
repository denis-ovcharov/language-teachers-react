import { MagnifyingGlass } from "react-loader-spinner";

export default function Loader() {
  return (
    <div
      style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}
    >
      <MagnifyingGlass
        visible={true}
        height="80"
        width="80"
        ariaLabel="magnifying-glass-loading"
        wrapperStyle={{}}
        wrapperClass="magnifying-glass-wrapper"
        glassColor="#faf8f6"
        color="#b66834"
      />
    </div>
  );
}
