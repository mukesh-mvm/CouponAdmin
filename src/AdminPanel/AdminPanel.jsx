import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout, Menu, Avatar, Button, Dropdown } from "antd";
import { useAuth } from "../context/auth";
import "../Style/AdminPanel.css";
import {
  UserOutlined,
  DashboardOutlined,
  TeamOutlined,
  CarOutlined,
  EnvironmentOutlined,
  CarryOutOutlined,
  FormOutlined,
  HomeOutlined,
  WarningOutlined,
  TruckOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

const { Header, Sider, Content } = Layout;

import Users from "./Users";
import Category from "./Category";
import BestOffer from "./BestOffer";
import DealOnFire from "./DealOnFire";

import Coupon from "./Coupon";

// import logo from "../../public/logo.png";
// properties-details

const AdminPanel = () => {
  const [selectedTab, setSelectedTab] = useState("categories");
  const [id, setId] = useState();
  const navigate = useNavigate();
  const [auth, setAuth] = useAuth();
 
  const auth1 = JSON.parse(localStorage.getItem('auth'));

  const handleMenuClick = (e) => {
    setSelectedTab(e.key);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  const renderContent = () => {
    switch (selectedTab) {

      case "users":
      return <Users />;
       
        case "categories":
        return <Category />;

        case "coupon":
        return <Coupon />;

        case "best-offer":
        return <BestOffer />;
        
        case "deal-on-fire":
        return <DealOnFire />;

    }
  };

  const menuItems = [
    { key: "categories", icon: <HomeOutlined />, label: "Categories" },
    { key: "coupon", icon: <TeamOutlined  />, label: "Coupon" },
    { key: "best-offer", icon: <TeamOutlined  />, label: "Best Offer" },
    { key: "deal-on-fire", icon: <TeamOutlined  />, label: "Deal On Fire" },
  
  ];



  const menuItems1 = [
  
    { key: "categories", icon: <HomeOutlined />, label: "Categories" },
   
    { key: "coupon", icon: <TeamOutlined  />, label: "Coupon" },
     { key: "best-offer", icon: <TeamOutlined  />, label: "Best Offer" },
      { key: "deal-on-fire", icon: <TeamOutlined  />, label: "Deal On Fire" },
  
   
  ];
  return (
    <Layout style={{ minHeight: "100vh", maxWidth: "100vw" }}>
      <Header className="header">
        <div className="logo-vinMart">
          {/* <img src={logo} alt="dewanRealty Logo" /> */}
          {/* <h1>logo</h1> */}
        </div>

        <Button
          type="primary"
          onClick={handleLogout}
          style={{ marginLeft: "20px" }}
        >
          Logout
        </Button>
      </Header>

      <Layout>
        <Sider className="sider">
          <Menu
            mode="inline"
            defaultSelectedKeys={["dashboard"]}
            style={{ height: "100%", borderRight: 0 }}
            onClick={handleMenuClick}
          >
            {/* <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
              Dashboard
            </Menu.Item> */}


            {
              auth1?.user?.role==='superAdmin'?(<>
                  {menuItems1?.map((menuItem) => (
              <Menu.Item key={menuItem?.key} icon={menuItem?.icon}>
                {menuItem?.label}
              </Menu.Item>
            ))}
              </>):(<>
                 
                 {menuItems?.map((menuItem) => (
              <Menu.Item key={menuItem?.key} icon={menuItem?.icon}>
                {menuItem?.label}
              </Menu.Item>
            ))}
              </>)
            }

            
          </Menu>
        </Sider>

        <Layout style={{ padding: "24px" }}>
          <Content className="content">{renderContent()}</Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AdminPanel;
