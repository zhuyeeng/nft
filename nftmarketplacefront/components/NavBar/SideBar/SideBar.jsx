import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { GrClose } from 'react-icons/gr';
import { TiSocialFacebook, TiSocialLinkedin, TiSocialTwitter, TiSocialYoutube, TiSocialInstagram, TiArrowSortedDown, TiArrowSortedUp } from 'react-icons/ti';

//CSS File
import Style from './SideBar.module.css';
import images from '../../../img';
import Button from '../../Button/Button';

const SideBar = ({ setOpenSideMenu}) => {
  const [openDiscover, setOpenDiscover] = useState(false);
  const [openHelp, setOpenHelp] = useState(false);

  // Discover Menu
  const discover = [
    {
      name: "Collection",
      link: "collection"
    },
    {
      name: "Search",
      link: "search"
    },
    {
      name: "Author Profile",
      link: "author-profile"
    },
    {
      name: "NFT Details",
      link: "NFT-details"
    },
    {
      name: "Account Setting",
      link: "account-setting"
    },
    {
      name: "Connect Wallet",
      link: "connect-wallet"
    },
    {
      name: "Blog",
      link: "blog"
    }
  ]

  // Help Center
  const helpCenter = [
    {
      name: "About",
      link: "about"
    },
    {
      name: "Contact Us",
      link: "contact us"
    },
    {
      name: "Sign Up",
      link: "sign-up"
    },
    {
      name: "Sign In",
      link: "sign-in"
    },
    {
      name: "Subscription",
      link: "subscription"
    }
  ]

  const openDiscoverMenu = () => {
    if(!openDiscover){
      setOpenDiscover(true);
    }else{
      setOpenDiscover(false);
    }
  };

  const openHelpMenu = () => {
    if(!openHelpMenu){
      setOpenHelp(true);
    }else{
      setOpenHelp(false);
    }
  };

  const close_SideBar = () => {
    setOpenSideMenu(true);
  };


  return (
    <div className={Style.sideBar}>
      <GrClose 
        className={Style.sideBarcloseBtn} 
        onClick={() => close_SideBar()}
      />

      <div className={Style.sideBar_box}>
        <Image
          src={images.logo}
          alt="logo"
          width={150}
          height={150}
        />
        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
        <div className={Style.sideBar_social}>
          <a href='#'>
            <TiSocialFacebook />
          </a>
          <a href='#'>
            <TiSocialLinkedin />
          </a>
          <a href='#'>
            <TiSocialTwitter />
          </a>
          <a href='#'>
            <TiSocialYoutube />
          </a>
          <a href='#'>
            <TiSocialInstagram />
          </a>
        </div>
      </div>

      <div className={Style.sideBar_menu}>
        <div>
          <div className={Style.sideBar_menu_box} onClick={() => openDiscoverMenu()}>
            <p>Discover</p>
            <TiArrowSortedDown />
          </div>

          {
            openDiscover && (
              <div className={Style.sideBar_discover}>
                {discover.map((el,i) => (
                  <p key={i + 1}>
                    <Link href={{pathname: '${el.link}' }}>{el.name}</Link>
                  </p>
                ))}
              </div>
            )}
        </div>

        <div>
          <div className={Style.sideBar_menu_box} onClick={() => openHelpMenu()}>
            <p>Help Center</p>
            <TiArrowSortedDown />
          </div>

          {
            openHelp && (
              <div className={Style.sideBar_discover}>
                {helpCenter.map((el, i) => (
                  <p key = {i + 1}>
                    <Link href={{pathname: '${el.link}' }}>{el.name}</Link>
                  </p>
                ))}
              </div>
            )}
        </div>
      </div>

      <div className={Style.sideBar_button}>
        <Button btnName="Create" />
        <Button btnName="Connect Wallet" />
      </div>
    </div>
  );
};

export default SideBar;