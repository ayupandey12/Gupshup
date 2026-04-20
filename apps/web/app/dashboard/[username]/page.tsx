import "dotenv/config"
import { Roomssection } from "../../components/Roomssection";
import { Loggedingprovider } from "../../components/Loggedingprovider";
import { Createroomsection } from "../../components/Createroomsection";
import { Joinroomsection } from "../../components/Joinroomsection";

const dashboard=()=>{
  return (<>
       <Loggedingprovider>
    <div>
      <Roomssection/> 
    </div>
    <div>
      <Createroomsection/>
    </div>
    <div>
      <Joinroomsection/>
    </div>
      </Loggedingprovider> 
      
  </>
  )
}

export default dashboard;