import { Modal, Space, Table } from "antd"
import { useEffect, useState } from "react";
import { amenityService } from "../../../services/amenityService";
import { IoIosAddCircleOutline } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";



export default function AmenityManger() {
  
    const Amenity = {
      id: Number,
      name: String,
      imageUrl: String
    }
    const { Column } = Table;
    const [amenities, setAmenities] = useState([]);
    const [pageSize, setPageSize] = useState(3);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedAmenity, setSelectedAmenity] = useState(null);
    const [amenityId, setAmenityId] = useState();
    const [reloadPage, setReloadPage] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const getAmenities = async () => {
          try {
            const items = await amenityService.getAmenityList();
            setAmenities(items.data);
          } catch (error) {
            console.log(error);
          }
        };
        getAmenities();
    }, []);

    const handleDelete = (record) => {
      const id = record.id;
      setAmenityId(id);
      setSelectedAmenity(record);
      setModalVisible(true);
    };
    
    const handleDeleteBlog = async () => {
      console.log(amenityId);
      try {
        await amenityService.delete(amenityId);
        console.log('Amenity deleted successfully');
        setReloadPage(!reloadPage);
        navigate("/manager/amenity")
      } catch (error) {
        console.error('Failed to delete amenity:', error);
      }
      setModalVisible(false);
    };

    return(
        <div className="w-full">
            <div className="headerManager font-roboto mb-5 flex justify-between">
                <h1 className="font-bold text-[20px] uppercase ">
                    Amenity Management
                </h1>
                <button onClick={() => { navigate('/manager/amenity-add') }} className="text-white bg-primary font-medium rounded-lg text-sm px-4 py-2 flex items-center hover:scale-110 transition-all">Add <IoIosAddCircleOutline className='ml-2 text-[20px]' /> </button>
            </div>
            <Table 
              dataSource={amenities}
              pagination={{
                total: amenities?.length,
                pageSize: pageSize,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
              }}
            >
              <Column title="ID" dataIndex="id" key="id" />
              <Column title="Name" dataIndex="name" key="name" />
              <Column title="ImageUrl" dataIndex="imageUrl" key="imageUrl" />
              <Column
                title="Action"
                key="action"
                render={(text, record) => (
                  <div className='flex'>
                    <Space size="middle" className='mr-3'>
                      <AiOutlineEdit
                        onClick={() => {
                          navigate(`/manager/amenity-update/${record.id}`)
                        }}
                        className="text-[20px] hover:scale-125 hover:text-red-700 transition-all"
                      />
                    </Space>
                    <Space size="middle">
                      <AiOutlineDelete
                        onClick={() => {
                          handleDelete(record);
                        }}
                        className="text-[20px] hover:scale-125 hover:text-red-700 transition-all"
                      />
                    </Space>
                  </div>
                )}
              />
            </Table>
            <Modal
              title={`Delete amenity: ${selectedAmenity?.name}`}
              visible={modalVisible}
              onOk={handleDeleteBlog}
              onCancel={() => setModalVisible(false)}
            ></Modal>              
        </div>
    )
}