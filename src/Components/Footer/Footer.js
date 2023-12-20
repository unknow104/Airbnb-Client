import React from "react";
import "./Footer.scss";
import { useTranslation } from "react-i18next";

function Footer() {
  const { t } = useTranslation();
  return (
    <div className="footer-infor bg-[#F7F7F7] pt-8 pb-[5rem]  w-full border-t-[1px] border-[#DDDDDD] ">
      <div className="container m-auto grid mb:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div className="text-left">
          <h2 className="mb-4 font-[600] text-[0.8rem]">{t("Hỗ trợ")}</h2>
          <ul className="text-[0.8rem]">
            <li className="mb-4 font-[400]">
              {" "}
              <a>{t("Trung tâm trợ giúp")}</a>
            </li>
            <li className="mb-4 font-200">
              {" "}
              <a>AirCover</a>
            </li>
            <li className="mb-4 font-200">
              {" "}
              <a>Thông tin an toàn</a>
            </li>
            <li className="mb-4 font-200">
              {" "}
              <a>Hỗ trợ người khuyết tật</a>
            </li>
            <li className="mb-4 font-200">
              {" "}
              <a>Lựa chọn hủy đặt phòng</a>
            </li>
            <li className="mb-4 font-200">
              {" "}
              <a>Đối phó với COVID-19</a>
            </li>
            <li className="mb-4 font-200">
              {" "}
              <a>Báo cáo vấn đề hàng xóm</a>
            </li>
          </ul>
        </div>
        <div className="text-left">
          <h2 className="mb-4 font-[600] text-[0.8rem]">{t("Cộng đồng")}</h2>
          <ul className="text-[0.8rem]">
            <li className="mb-4 font-[400]">
              {" "}
              <a> Nhà ở cứu trợ thảm họa</a>
            </li>
            <li className="mb-4 font-200">
              {" "}
              <a>Ủng hộ người tị nạn Afghanistan</a>
            </li>
            <li className="mb-4 font-200">
              {" "}
              <a>Chống lại phân biệt đối xử</a>
            </li>
            <li className="mb-4 font-200">
              {" "}
              <a>Ủng hộ người tị nạn Afghanistan</a>
            </li>
            <li className="mb-4 font-200">
              {" "}
              <a>Chống lại phân biệt đối xử</a>
            </li>
            <li className="mb-4 font-200">
              {" "}
              <a>Ủng hộ người tị nạn Afghanistan</a>
            </li>
            <li className="mb-4 font-200">
              {" "}
              <a>Chống lại phân biệt đối xử</a>
            </li>
          </ul>
        </div>
        <div className="text-left">
          <h2 className="mb-4 font-[600] text-[0.8rem]">{t("Đăng ký")}</h2>
          <ul className="text-[0.8rem]">
            <li className="mb-4 font-[400]">
              {" "}
              <a>Thử nghiệm đăng ký</a>
            </li>
            <li className="mb-4 font-200">
              {" "}
              <a>Panther cho Chủ nhà</a>
            </li>
            <li className="mb-4 font-200">
              {" "}
              <a>Khám phá tài nguyên đăng ký</a>
            </li>
            <li className="mb-4 font-200">
              {" "}
              <a>Thăm diễn đàn cộng đồng của chúng tôi</a>
            </li>
            <li className="mb-4 font-200">
              {" "}
              <a>Cách đăng ký một cách có trách nhiệm</a>
            </li>
          </ul>
        </div>
        <div className="text-left">
          <h2 className="mb-4 font-[600] text-[0.8rem]">Panther</h2>
          <ul className="text-[0.8rem]">
            <li className="mb-4 font-[400]">
              {" "}
              <a>Phòng báo cáo</a>
            </li>
            <li className="mb-4 font-200">
              {" "}
              <a>Tìm hiểu về tính năng mới</a>
            </li>
            <li className="mb-4 font-200">
              {" "}
              <a>Thư từ từ người sáng lập chúng tôi</a>
            </li>
            <li className="mb-4 font-200">
              {" "}
              <a>Sự nghiệp</a>
            </li>
            <li className="mb-4 font-200">
              {" "}
              <a>Nhà đầu tư</a>
            </li>
            <li className="mb-4 font-200">
              {" "}
              <a>Thẻ quà tặng</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Footer;
