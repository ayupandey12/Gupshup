import { Findallrooms } from "../lib/actions/Findallrooms"
export const Roomssection=async ()=>{
    const {rooms,mess}= await Findallrooms();
    return (
        <div className="w-full h-full flex items-center justify-center">
            <h1 className="text-3xl font-bold">Rooms Section</h1>
            <div className="w-full h-full flex items-center justify-center">
                {rooms?.map((room)=>(
                    <div key={room.id} className="w-64 h-32 bg-gray-200 rounded-lg flex items-center justify-center m-4">
                        <h2 className="text-xl font-bold">{room.name}</h2>
                    </div>
                ))}
            </div>
        </div>

    )
}