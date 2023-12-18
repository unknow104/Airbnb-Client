import React, { useEffect, useState } from 'react';
import { Form, Input, Button, DatePicker, Radio, Upload, message } from 'antd';
import 'react-quill/dist/quill.snow.css';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../../services/userService';
import dayjs from 'dayjs';
import { openNotificationIcon } from '../../../Components/NotificationIcon/NotificationIcon';
import { FaArrowLeft, FaPlus } from 'react-icons/fa';
import { AiOutlineLoading } from 'react-icons/ai';
import { IoPulseOutline } from 'react-icons/io5';

export default function ChangePasswordPage() {
    const [form] = Form.useForm();
    const [content, setContent] = useState('');
    const [user, setUser] = useState({});
    const [imageUrl, setImageUrl] = useState();
    const [imageChange, setImageChange] = useState([]);
    const { id } = useParams();
    const navigate = useNavigate();
    const [passwordVisible, setPasswordVisible] = React.useState(false);
    const [newPassword, setNewPassword] = useState();

    useEffect(() => {
        const fetchDetailProduct = async () => {
            try {
                const response = await userService.getInformation(id);
                setUser(response.data);

            } catch (error) {
                console.log(error);
                openNotificationIcon('error', 'Lỗi', 'Có lỗi khi cập nhập!');
            }
        };
        fetchDetailProduct();
    }, []);

    const onFinish = async (values) => {
        try {
            const formData = new FormData();
            formData.append('currentPassword', values.currentPassword);
            formData.append('newPassword', values.password);

            await userService.changePassword(id, formData);
            navigate('/profile');
            openNotificationIcon("success", "Thành công", "Bạn đã thay đổi mật khẩu thành công thành công")
        } catch (error) {
            console.log(error);
            openNotificationIcon("fail", "Thất bại", "Có lỗi khi thay đổi mật khẩu")
        }
    };

    const labelCol = { span: 4 };
    const wrapperCol = { span: 16 };

    return (
        <div className="container h-max mt-32">
            <div className='ms-40'>
                <button className='flex h-12 align-middle' onClick={() => { navigate('/profile') }}>
                    <FaArrowLeft className='my-auto' /> <span className='font-semibold ms-3 text-lg my-auto'>Quay lại</span>
                </button>
            </div>
            <h1 className="uppercase font-bold text-primary text-[20px] text-center my-5">
                Thay đổi mật khẩu của bạn
            </h1>

            <Form form={form} onFinish={onFinish}>
                <Form.Item
                    label="Current password"
                    name="currentPassword"
                    rules={[{ required: true, message: 'Vui lòng điền đầy đủ thông tin' }]}
                    labelCol={labelCol}
                    wrapperCol={wrapperCol}
                >
                    <Input.Password placeholder="Current password" />
                </Form.Item>

                <Form.Item
                    name="password"
                    label="New Password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                    ]}
                    hasFeedback
                    labelCol={labelCol}
                    wrapperCol={wrapperCol}
                >
                    <Input.Password placeholder='New password' />
                </Form.Item>

                <Form.Item
                    name="confirm"
                    label="Confirm new Password"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: 'Please confirm your password!',
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('The new password that you entered do not match!'));
                            },
                        }),
                    ]}
                    labelCol={labelCol}
                    wrapperCol={wrapperCol}
                >
                    <Input.Password placeholder='Confirm new password' />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: labelCol.span, span: wrapperCol.span }}>
                    <Button className="font-semibold text-white bg-gradient-to-r from-pink-600 to-red-500" htmlType="submit">
                        Cập nhật
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}
