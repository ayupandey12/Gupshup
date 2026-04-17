import "dotenv/config"
import { redirect } from "next/navigation";
import { Roomssection } from "../../components/Roomssection";
import { Loggedingprovider } from "../../components/Loggedingprovider";
import { Createroomsection } from "../../components/Createroomsection";

const dashboard=()=>{
  return (<>
       <Loggedingprovider>
    <div>
      {/* <Roomssection/> */}
      <Roomssection/>
    </div>
    <div>
      <Createroomsection/>
    </div>
       </Loggedingprovider>
    
  </>
  )
}

export default dashboard;