import "dotenv/config"
import { Roomssection } from "../../components/Roomssection";
import { Loggedingprovider } from "../../components/Loggedingprovider";
import { Createroomsection } from "../../components/Createroomsection";
import { Joinroomsection } from "../../components/Joinroomsection";

const dashboard = () => {
    return (
        <>
            <Loggedingprovider>
                <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
                    <div className="space-y-8">
                        <Roomssection />
                    </div>
                    <div className="space-y-8">
                        <Createroomsection />
                        <Joinroomsection />
                    </div>
                </div>
            </Loggedingprovider>
        </>
    );
};

export default dashboard;