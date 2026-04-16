import "dotenv/config"
import { redirect } from "next/navigation";
import { Roomssection } from "../../components/Roomssection";
import { Loggedingprovider } from "../../components/Loggedingprovider";

const dashboard=()=>{
  return (<>
       <Loggedingprovider>
    <div>
      {/* <Roomssection/> */}
      <Roomssection/>
    </div>
       </Loggedingprovider>
    
  </>
  )
}

export default dashboard;