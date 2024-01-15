import { AiOutlineBarChart } from "react-icons/ai";
import { BsFillHouseGearFill, BsFillPencilFill } from "react-icons/bs";
import { RiAccountCircleFill } from "react-icons/ri";
import { TbAirConditioning, TbTemperature, TbWashMachine, TbDeviceDesktop, TbParking, TbToolsKitchen3, TbPool, TbDog } from "react-icons/tb";
import { Link } from "react-router-dom";

export default function CategoryList() {

    const categoryListData = [
        {
            name: "Máy nhiệt độ nước",
            path: "/category/hotAndColdMachine",
            Icon: TbTemperature,
        },
        {
            name: "Máy giặt",
            path: "/category/washingMachine",
            Icon: TbWashMachine,
        },
        {
            name: "Tivi",
            path: "/category/television",
            Icon: TbDeviceDesktop,
        },
        {
            name: "Máy điều hòa",
            path: "/category/airConditioner",
            Icon: TbAirConditioning,
        },
        {
            name: "Chỗ đậu xe",
            path: "/category/parking",
            Icon: TbParking,
        },
        {
            name: "Nhà bếp",
            path: "/category/kitchen",
            Icon: TbToolsKitchen3,
        },
        {
            name: "Hồ bơi",
            path: "/category/pool",
            Icon: TbPool,
        },
        {
            name: "Cho phép thú cưng",
            path: "/category/allowPet",
            Icon: TbDog,
        },
        // Add other Admin items here if needed
    ];

    const render = () => {
        return categoryListData?.map((item, i) => (
            <div key={i}>
                <Link
                    to={item.path}
                    href="#"
                    className="flex hover:bg-slate-300 p-3 rounded"
                >
                    <item.Icon className="w-10 h-10 mr-2 text-bold" />
                    <span className="font-semibold ml-3 text-2xl whitespace-nowrap">{item.name}</span>
                </Link>
            </div>
        ));
    }

    return (
        <div className="bg-white grid grid-cols-4 gap-3">
            {render()}
        </div>
    )
}