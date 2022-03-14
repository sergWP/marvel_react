import ErrorMsg from "../errorMsg/errorMsg";
import {Link, useLocation} from "react-router-dom";

const Page404 = () => {
    let location = useLocation();
    return (
        <div>
            <ErrorMsg/>
            <h3>
                No match for <code>{location.pathname}</code>
            </h3>
            <Link to="/">Back to main page</Link>
      </div>
    )
}

export default Page404