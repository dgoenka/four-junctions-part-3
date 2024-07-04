import { cookies, headers } from "next/headers";
import { Pathsinfo } from "@/pathsinfo";
import Link from "next/link";

const Header = () => {
  const headerList = headers();
  const pathname = headerList.get("x-current-path");
  const token = cookies().get("token")?.value || "";
  const pathInfo = Pathsinfo.find((pathInArr) => pathInArr.path === pathname);
  return (
    <div className={"header-box"}>
      <h1>
        <b>imdB Clone</b>
      </h1>
      {token ? (
        <div>
          <Link
            href={"/logout"}
            className={"btn secondary-btn"}
            type={"submit"}
          >
            Logout
          </Link>
        </div>
      ) : pathInfo ? (
        <h1>{pathInfo.title}</h1>
      ) : null}
    </div>
  );
};

export default Header;
