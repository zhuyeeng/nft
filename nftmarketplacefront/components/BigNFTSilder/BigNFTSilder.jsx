import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { AiFillFire, AitfillHeart, AiOutlineHeart } from 'react-icons/ai';
import { MdVerified, MdTimer } from 'react-icons/md';
import { TbArrowBigLeftLine, TbArrowrightLine } from 'react-icons/tb';

import Style from './BigNFTSilder';
import images from '../../img';
import Button from '../Button/Button';

const BigNFTSilder = () => {

    const [idNumber, setIdNumber] = useState(1);

    const sliderData = [
        {
            title: "First",
            id: 1,
            name: "Name",
            collection: "GYm",
            price: "00000064664 ETH",
            like: 243,
            image: images.user1,
            nftImage: images.nft_image_1,
            time:{
                days: 27,
                hours: 10,
                minutes: 11,
                seconds: 35
            }
        },
        {
            title: "Second",
            id: 2,
            name: "Name_2",
            collection: "GYM",
            price: "00000064664 ETH",
            like: 213,
            image: images.user2,
            nftImage: images.nft_image_2,
            time:{
                days: 27,
                hours: 10,
                minutes: 11,
                seconds: 35
            }
        },
        {
            title: "Third",
            id: 3,
            name: "Name_3",
            collection: "GYM3",
            price: "00000064664 ETH",
            like: 288,
            image: images.user3,
            nftImage: images.nft_image_3,
            time:{
                days: 27,
                hours: 10,
                minutes: 11,
                seconds: 35
            }
        },
        {
            title: "Fourth",
            id: 4,
            name: "Name_4",
            collection: "GYM4",
            price: "00000064664 ETH",
            like: 210,
            image: images.user4,
            nftImage: images.nft_image_4,
            time:{
                days: 27,
                hours: 10,
                minutes: 11,
                seconds: 35
            }
        }
    ];

    return (
        <div className={Style.bigNFTSilder}>
            <div className={Style.bigNFTSilder_box}>
                <div className={Style.bigNFTSilder_box_left}>
                    <h2>{sliderData[idNumber].title}</h2>
                    <div className={Style.bigNFTSilder_box_left_creator}>
                        <div className={Style.bigNFTSilder_box_left_creator_profile}>
                            <Image
                                src={sliderData[idNumber].image}
                                alt='Profile Image'
                                width={50}
                                height={50}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BigNFTSilder;