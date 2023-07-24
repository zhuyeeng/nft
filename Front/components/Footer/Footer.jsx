import React from 'react'
import Image from 'next/image';
import { TiSocialFacebook, TiSocialLinkedin, TiSocialTwitter, TiSocialYoutube, TiSocialInstagram, TiArrowSortedDown, TiArrowSortedUp } from 'react-icons/ti';
import { RiSendPlaneFill } from 'react-icons/ri';

import Style from './Footer.module.css';
import images from '../../img';
import { MarketPlace, HelpCenter } from '../NavBar/index';

const Footer = () => {
    return(
        <div className={Style.footer}>
            <div className={Style.footer_box}>
                <div className={Style.footer_box_social}>
                    <Image src={images.logo} alt="footer logo" height={100} width={100} />
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                        Nam tempus hendrerit efficitur. Donec interdum purus ligula, ac faucibus urna elementum a. 
                        Maecenas non pretium ligula. In ultricies ut lorem vitae imperdiet. 
                        Aenean egestas placerat nulla, vel dapibus tortor iaculis sit amet. Interdum et malesuada fames ac ante ipsum primis in faucibus. 
                    </p>

                    <div className={Style.footer_social}>
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
                            <TiSocialInstagram/>
                        </a>
                    </div>
                </div>

                <div className={Style.footer_box_discover}>
                    <h3>Market Place</h3>
                    <MarketPlace />
                </div>

                <div className={Style.footer_box_help}>
                    <h3>Help Center</h3>
                    <HelpCenter />
                </div>

                <div className={Style.subscribe}>
                    <h3>Subscribe</h3>
                    <div className={Style.subscribe_box}>
                        <input type='email' placeholder='Enter your email' />
                        <RiSendPlaneFill className={Style.subscribe_box_send} />
                    </div>

                    <div className={Style.subscribe_box_info}>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam tempus hendrerit efficitur. 
                            Donec interdum purus ligula, ac faucibus urna elementum a.</p>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Footer