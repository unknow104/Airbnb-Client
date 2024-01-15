import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%', // Thay đổi chiều rộng của bản đồ
  height: '400px' // Thay đổi chiều cao của bản đồ
};

const Map = ({ address }) => {
  const defaultCenter = {
    lat: 11.9425783,
    lng: 108.4343696
  };

  const icon = {
    url: '/img/airbnb.png',
    scaledSize: {
      width: 45,
      height: 45
    }
  };

  const options = {
    styles: [
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      }
    ],
  };

  return (
    <LoadScript
      googleMapsApiKey="AIzaSyAQ4hwi9JTqJKOkuU7JdU0LxsqTYycrQnk" // Thay thế YOUR_API_KEY_HERE bằng khóa API của bạn
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={defaultCenter} // Sử dụng defaultCenter nếu không có dữ liệu địa chỉ
        zoom={14}
        options={options}
      >
        {address?.map((addr, index) => (
          <Marker
            key={index}
            icon={icon}
            position={{ lat: addr?.address?.lat, lng: addr?.address?.lng }}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

export default Map;
