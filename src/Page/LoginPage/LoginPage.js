import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Modal } from 'antd';
import './Login.scss';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { loginUser } from '../../Redux/auth/authSlice';
import { localStorageService } from '../../services/localStorageService';
import { authService } from '../../services/authService';
import { openNotificationIcon } from '../../Components/NotificationIcon/NotificationIcon';

function LoginPage() {
  const [email, setEmail] = useState('');
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const onFinish = (values) => {
    console.log(values)
    dispatch(loginUser(values))

  };
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  useEffect(() => {
    const role = localStorageService.get('USER')?.userDTO?.role?.[0];
    console.log(role);
    if (isLoggedIn && role) {
      if (role === "CUSTOMER") {
        navigate("/");
      } else {
        navigate("/")
      }
    }
  }, [isLoggedIn, navigate]);

  const handleForgotPassword = async () => {
    try {
      await authService.forgotPassword(email);
      // Hiển thị thông báo thành công nếu cần
      openNotificationIcon('success', 'Thành công', 'Gửi yêu cầu thành công!');
      setModalOpen(false);
    } catch (error) {
      console.error('Quên mật khẩu thất bại:', error);
      // Hiển thị thông báo lỗi
      openNotificationIcon('erorr', 'Thất bại', 'Gửi yêu cầu thất bại!');
    }
  };

  const handleCancelForgotPassword = () => {
    // Đặt lại trạng thái hoặc thực hiện các tác vụ khác nếu cần
    setModalOpen(false);
  };

  return (
    <div className="login flex items-center justify-center h-screen mb:p-0 sm :p-0 lg:p-[24px] ">
      <div className="flex bg-white items-center relative w-[70rem] border rounded-[0.5rem] login-wrapper p-5 mb:h-screen sm:h-screen md:h-screen lg:h-[100%] animate__animated animate__fadeInUp">
        <Link className="absolute top-[24px] left-[24px]" to="/">
          <img
            className=" w-[6rem]"
            src="https://res-console.cloudinary.com/dzhdgoh2y/thumbnails/v1/image/upload/v1702968893/bG9nb19pbTN4aGM=/grid_landscape"
            alt=""
          />
        </Link>

        <div className=" mb:w-full sm:w-full lg:w-2/4 h-screen flex justify-center items-center">
          <div className="animate__delay-1s animate__animated animate__fadeInUp">
            <div className="flex justify-between mb-2 items-center animate__delay-1s animate__animated animate__fadeInUp">
              <h1 className="font-bold text-[20px]">Đăng nhập</h1>
            </div>
            <Form
              name="basic"
              className="form-login"
              labelCol={{
                span: 8,
              }}
              wrapperCol={{
                span: 16,
              }}
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
              autoComplete="off"
            >
              <Form.Item
                name="email"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng điền thông tin vào!',
                  },
                ]}
              >
                <Input
                  className="input border px-[14px] py-[14px] rounded-[0.5rem] w-[320px] input-user"
                  placeholder='Email hoặc số điện thoại của bạn'
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng điền thông tin vào!',
                  },
                ]}
              >
                <Input.Password
                  className="border password px-[14px] py-[14px] rounded-[0.5rem] w-[320px] "
                  placeholder='Mật khẩu'
                />
              </Form.Item>
              <button
                className=" w-full py-3 rounded-[0.5rem] bg-primary hover:bg-[#0A4D68] transition-all btn-login text-white"
                type="primary"
                size="large"
                htmlType="submit"
              >
                Đăng nhập
              </button>
            </Form>
            <div className="w-full flex justify-between">
              <Link to="/register" className="mt-5 text-blue w-full inline text-left text-bold underline">
                Bạn chưa có tài khoản
              </Link>
              <Link onClick={() => setModalOpen(true)} className="mt-5 text-blue w-full inline text-right text-bold underline">
                quên mật khẩu
              </Link>
            </div>
            <div className="relative">
              <p
                className="my-5 text-center opacity-50 relative login-with"
              >
                tiếp tục
              </p>
            </div>
            <div>
              <button className="flex mt-5 justify-center items-center text-[16px] w-full border p-3 rounded-[0.5rem]">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/768px-Facebook_Logo_%282019%29.png"
                  alt=""
                  className="w-[22px] mr-2"
                />
                Facebook
              </button>
            </div>
          </div>
        </div>
        
        <div className="w-2/4 mb:hidden sm:hidden lg:flex relative bg-[#e86f7d] overflow-hidden h-full flex justify-center items-center rounded-[0.5rem]">
          <div className="glass h-[80%] relative w-[30rem] rouded-[0.5rem] bg-mainColor z-10 animate__delay-1s animate__animated animate__fadeInUp">
            <h1 className="text-white text-[30px] text-left p-5">
              Bắt đầu hành trình tuyệt vời của bạn chỉ qua 1 nhấp chuột
            </h1>
            <img src="../img/img.png" className="bottom-0 w-[70%] absolute left-20 " alt="" />
          </div>
          <img
            className="absolute right-[9rem] bottom-0 z-none"
            src="../img/decoration.png"
            alt=""
          />
        </div>
      </div>
      <Modal
        title="Quên mật khẩu"
        centered
        visible={modalOpen}
        onOk={handleForgotPassword}
        onCancel={handleCancelForgotPassword}
      >
        <br />
        <p className='mb-1 ml-1'>{t('Nhập email của bạn để đặt lại mật khẩu')}</p>
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Nhập email"
        />
      </Modal>
    </div>
  );
}

export default LoginPage;
