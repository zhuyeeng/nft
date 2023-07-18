import React from 'react'
import Image from 'next/image';
import { FaUserAlt, FaUserEdit, faRegImage, faUserEdit } from 'react-icons/fa';
import { MdHelpCenter } from 'react-icons/md';
import {TbDownloadOff, TbDownload } from 'react-icons/tb';
import Link from 'next/link';

//CSS File
import Style from './Profile.module.css';
import image from '../../../img';

const Profile = () => {
  return (
    <div className={Style.profile}>
      <div className={Style.profile_account}>
        <Image
          src={image.user1}
          alt="user profile"
          width={50}
          height={50}
          className={Style.profile_account_img}
        />

        <div className={Style.profile_account_info}>
          <p>Jing Zhi</p>
          <small>X038542616545613621....</small>
        </div>
      </div>
      <div className={Style.profile_menu}>
        <div className={Style.profile_menu_one}>
          <div className={Style.profile_menu_one_item}>
            <FaUserAlt />
            <p>
              <Link href={{pathname: '/myprofile'}}>MyProfile</Link>
            </p>
          </div>

          <div className={Style.profile_menu_one_item}>
            <FaUserEdit />
            <p>
              <Link href={{pathname: '/my-items'}}>MyProfile</Link>
            </p>
          </div>

        </div>

        <div className={Style.profile_menu_two}>
          <div className={Style.profile_menu_one_item}>
            <MdHelpCenter />
            <p>
              <Link href={{pathname: "/help"}}>Help</Link>
            </p>
          </div>

          <div className={Style.profile_menu_one_item}>
            <TbDownload />
            <p>
              <Link href={{pathname: "/disconnect"}}>Help</Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Profile;