import React from 'react'
import Link from 'next/link';

//CSS File
import Style from "./MarketPlace.module.css";

const MarketPlace = () => {
    const marketItem = [
        {
            name: "Collection",
            link: "collection"
        },
        {
            name: "NFT Details",
            link: "NFT-details"
        }
    ]

    return (
    <div>
        { marketItem.map((el, i) => (
            <div key={ i + 1 } className={Style.MarketPlace}>
                <Link href={{pathname: `${el.link}` }}>{el.name}</Link>
            </div>
        ))}
    </div>
    )
};

export default MarketPlace;