import React, { useEffect, useState } from "react";
import { Button, Skeleton } from "antd";
import "./HomePage.scss";
import { useDispatch, useSelector } from "react-redux";
import Banner from "../../Components/Banner/Banner";
import BlogBanner from "./BlogBanner";
import { useTranslation } from "react-i18next";
import BannerVideo from "../../Components/Banner/BannerVideo";
import ExploreNearby from "./ExploreNearby";
import CardItem from "../../Components/CardItem/CardItem";
import { getRoomList } from "../../Redux/room/roomList";
import SkeletonItem from "../../Components/Skeleton/SkeletonItem";
import { AiOutlineSortAscending, AiOutlineSortDescending } from "react-icons/ai";

function HomePage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const allRoom = useSelector((state) => state.room.listRoom.allRoom);
  const [room, setRoom] = useState([]);

  // Ghi chú: Khi allRoom thay đổi, cập nhật giá trị cho room
  useEffect(() => {
    setRoom(allRoom);
  }, [allRoom]);

  const isfetching = useSelector((state) => state.room.listRoom.isfetching);
  const [openShadowFilter, setopenShadowFilter] = useState(false);
  const [queyFilter, setQueyFilter] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentItems = room?.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(room?.length / itemsPerPage);

  const handleQueyFilter = (data) => {
    setQueyFilter(data);
  };

  // Ghi chú: Fetch danh sách phòng khi component được tạo
  useEffect(() => {
    dispatch(getRoomList());
  }, []);

  const renderRoomItem = () => {
    return Array.isArray(currentItems)
      ? currentItems.map((roomInfor, index) => (
        <CardItem key={index} roomInfor={roomInfor} />
      ))
      : null;
  };

  const handleDecrease = () => {
    setRoom([...room].sort((a, b) => (a.price > b.price ? -1 : 1)));
  };

  const handleIncrease = () => {
    setRoom([...room].sort((a, b) => (a.price > b.price ? 1 : -1)));
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const closeNav = () => {
    if (window.scrollY >= 1100) {
      setopenShadowFilter(true);
    }
    if (window.scrollY < 1100) {
      setopenShadowFilter(false);
    }
  };

  // Ghi chú: Thêm sự kiện lắng nghe cuộn trang
  useEffect(() => {
    window.addEventListener("scroll", closeNav);
    return () => {
      window.removeEventListener("scroll", closeNav);
    };
  }, []);

  return (
    <div>
      <div className="container m-auto mb:mt-[10rem] sm:mt-[10rem] lg:mt-20 mb-10">
        <div className="mb-10">
          {/* Nội dung bổ sung */}
        </div>
      </div>
      <div className="container mb-5 m-auto mt-10 flex justify-start space-x-3 ">
        <Button
          className="font-bold text-primary"
          onClick={handleDecrease}
          icon={<AiOutlineSortAscending />}
        >
          Từ thấp
        </Button>
        <Button
          className="font-bold text-primary"
          onClick={handleIncrease}
          icon={<AiOutlineSortDescending />}
        >
          Từ cao
        </Button>
      </div>
      <div className="w-[1460px] m-auto grid mb:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-5 gap-6">
        {isfetching ? <SkeletonItem /> : renderRoomItem()}
      </div>
      <div className="flex justify-center my-10 space-x-3">
        {Array.from({ length: totalPages }).map((_, index) => (
          <Button key={index} onClick={() => paginate(index + 1)}>
            {index + 1}
          </Button>
        ))}
      </div>
      <div className="mb:w-full sm:w-full lg:container mx-auto">
        <Banner />
      </div>
      <div className="container mx-auto my-10">
        <BlogBanner />
      </div>
      <div className="flex relative mb:hidden mt-10 bg-black w-full h-screen">
        <div className="flex relative  bg-black w-full h-screen mb:flex-col sm:flex-col ">
          <BannerVideo />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
