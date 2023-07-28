import React, { useState, useEffect } from 'react';
// import { ethers } from 'ethers';
import Image from "next/image";
import Link from "next/link";

//IMPORT ICON
import { MdNotifications } from 'react-icons/md';
import { BsSearch } from 'react-icons/bs';
import { CgMenuLeft, CgMenuRight } from "react-icons/cg";

//CSS file
import Style from "./NavBar.module.css";
import { HelpCenter, Notification, Profile, SideBar, MarketPlace } from './index';
import { Button } from "../ComponentsIndex";
import images from '../../img';

const NavBar = () => {
  
  //UseState
  const [marketplace, setOpenMarketPlace] = useState(false);
  const [help, setHelp] = useState(false);
  const [notification, setNotification] = useState(false);
  const [profile, setProfile] = useState(false);
  const [openSideMenu, setOpenSideMenu] = useState(false);

  const openMenu = (e) => {
    const btnText = e.target.innerText;
    if(btnText == "Market Place"){
      setOpenMarketPlace(true);
      setHelp(false);
      setNotification(false);
      setProfile(false);
    }else if(btnText == "Help Center"){
      setOpenMarketPlace(false);
      setHelp(true);
      setNotification(false);
      setProfile(false);
    }else{
      setOpenMarketPlace(false);
      setHelp(false);
      setNotification(false);
      setProfile(false);
    }
  };

  const openNotification = () =>{
    if(!notification){
      setNotification(true);
      setOpenMarketPlace(false);
      setHelp(false);
      setProfile(false);
    }else{
      setNotification(false);
    }
  };

  const openProfile = () =>{
    if(!profile){
      setProfile(true)
      setHelp(false)
      setOpenMarketPlace(false)
      setNotification(false)
    }else{
      setProfile(false);
    }
  };

  const openSideBar= () => {
    if(!openSideMenu){
      setOpenSideMenu(true);
    }else{
      setOpenSideMenu(false);
    }
  };

  return(
    <div className={Style.navbar}>
      <div className={Style.navbar_container}>
        <div className={Style.navbar_container_left}>
          <div className={Style.logo}>
            <Image 
              src={images.logo}
              alt = "NFT MARKET PLACE"
              width = {100}
              height= {100}
            />
          </div>
          <div className={Style.navbar_container_left_input}>
            <div className={Style.navbar_container_left_box_input_box}>
              <input type='text' placeholder='Search NFT' />
              <BsSearch onClick={() => {}} className={Style.search_icon} />
            </div>
          </div>
        </div>
        {/*End of Left Section */}

        <div className={Style.navbar_container_right}>
          <div className={Style.navbar_container_right_discover}>
            {/*Discover Menu*/}
            <p onClick={(e) => openMenu(e)}> Market Place </p>
            { marketplace && (
              <div className={Style.navbar_container_right_discover_box}>
                <MarketPlace />
              </div>
            )}
          </div>
          
          {/*Help Center Menu*/}
          <div className={Style.navbar_container_right_help}>
            <p onClick={(e) => openMenu(e)}>Help Center</p>
            {help && (
              <div className={Style.navbar_container_right_help_box}>
                <HelpCenter />
              </div>
            )}
          </div>
          {/* NOTIFICATION*/}
          <div className={Style.navbar_container_right_notify}>
            <MdNotifications 
              className={Style.notify} 
              onClick={()=> openNotification()}
            />
            {notification && <Notification />}
          </div>

          {/* CREATE BUTTON SECTION*/}
          <div className={Style.navbar_container_right_button}>
            {/* <button onClick={connectWalletHandler} className={Style.connect_wallet_button}>{connButtonText}</button> */}
            <Button btnName="Create" handleClick={()=>{}}/>
          </div>

          {/*USER PROFILE*/}
          <div className={Style.navbar_container_right_profile_box}>
            <div className={Style.navbar_container_right_profile}>
              <Image 
                src={images.user1} 
                alt = "Profile" 
                width={40} 
                height={40} 
                onClick={()=> openProfile()}
                className={Style.navbar_container_right_profile}
              />
              {profile && <Profile />}
            </div>
          </div>

          {/* MENU BUTTON */}
          <div className={Style.navbar_container_right_menuBtn}>
            <CgMenuRight 
              className={Style.menuIcon}
              onClick={()=> openSideBar()} 
            />
          </div>
        </div>
      </div>

      {/* SIDEBAR COMPONENT */}
      {
        !openSideMenu && (
          <div className={Style.SideBar}>
            <SideBar setOpenSideMenu={setOpenSideMenu}/>
          </div>
        )
      }
    </div>
  );
};

export default NavBar;