import React from 'react';
import Image from 'next/image';

import Style from './HeroSection.module.css';
import { Button } from '../ComponentsIndex';
import image from '../../img';


const HeroSection = () => {
  return (
    <div className={Style.heroSection}>
        <div className={Style.heroSection_box}>
            <div className={Style.heroSection_box_left}>
                <h1>Discover,Collect, and Sell NFTs</h1>
                <p>
                    Discover the most outstanding NFTs in all topics of life. Creative your NFTs and sell them
                </p>

                <Button btnName="Start Your Search" />
            </div>
            <div className={Style.heroSection_box_right}>
                <Image 
                    src={image.hero}
                    alt='Hero Section'
                    height={600}
                    width={600}
                />
            </div>
        </div>
    </div>
  )
}

export default HeroSection