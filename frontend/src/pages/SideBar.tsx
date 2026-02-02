import type { FunctionComponent } from 'react';
import { useState } from 'react';
import './Sidebar.css';

import menuIcon from '../assets/icons/Vector-9.svg';
import homeIcon from '../assets/icons/Vector-8.svg';
import basketballIcon from '../assets/icons/Vector-6.svg';
import footballIcon from '../assets/icons/Vector-3.svg';
import tennisIcon from '../assets/icons/Vector-2.svg';
import volleyballIcon from '../assets/icons/Vector-1.svg';
import catalogIcon from '../assets/icons/Vector.svg';
import cardsIcon from '../assets/icons/Vector-4.svg';
import liveCasinoIcon from '../assets/icons/Vector-7.svg';
import arrowIcon from '../assets/icons/Vector-5.svg';

interface SubMenuItem {
    label: string;
    count?: number;
}

interface MenuItem {
    icon: string;
    label: string;
    icon2: string;
    subMenu?: SubMenuItem[];
}

const menuItems: MenuItem[] = [
    { icon: menuIcon, label: 'Меню', icon2: arrowIcon },
    { icon: homeIcon, label: 'Головна сторінка', icon2: arrowIcon },
    {
        icon: basketballIcon,
        label: 'Баскетбол',
        icon2: arrowIcon,
        subMenu: [
            { label: 'Україна', count: 12 },
            { label: 'США', count: 3 },
            { label: 'Європа', count: 42 },
        ],
    },
    {
        icon: footballIcon,
        label: 'Футбол',
        icon2: arrowIcon,
        subMenu: [
            { label: 'Англія', count: 97 },
            { label: 'Іспанія', count: 37 },
            { label: 'Італія', count: 43 },
            { label: 'Німеччина', count: 46 },
            { label: 'Франція', count: 38 },
        ],
    },
    {
        icon: tennisIcon,
        label: 'Теніс',
        icon2: arrowIcon,
        subMenu: [
            { label: 'Австралія', count: 97 },
            { label: 'Нова Зеландія', count: 5 },
            { label: 'США', count: 50 },
            { label: 'Франція', count: 17 },
        ],
    },
    {
        icon: volleyballIcon,
        label: 'Волейбол',
        icon2: arrowIcon,
        subMenu: [
            { label: 'Австралія', count: 97 },
            { label: 'Нова Зеландія', count: 5 },
            { label: 'США', count: 50 },
            { label: 'Франція', count: 17 },
        ],
    },
    { icon: catalogIcon, label: 'Каталог ігр', icon2: arrowIcon },
    { icon: cardsIcon, label: 'Карти', icon2: arrowIcon },
    {
        icon: liveCasinoIcon,
        label: 'Лайв-казино',
        icon2: arrowIcon,
        subMenu: [
            { label: 'Рулетка' },
            { label: 'Блекджек' },
            { label: 'Баккара' },
            { label: 'Ігрові шоу' },
        ],
    },
];

const Sidebar: FunctionComponent = () => {
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* Sidebar */}
            <div
                className={`sidebar ${open ? 'open' : ''}`}
                onMouseEnter={() => setOpen(true)}
                onMouseLeave={() => setOpen(false)}
            >
                {menuItems.map((item, index) => (
                    <div key={index} className="sidebar-item-wrapper">
                        <button className="sidebar-item">
                            <img src={item.icon} alt={item.label} className="sidebar-icon" />
                            <span className="sidebar-label">{item.label}</span>
                            {item.subMenu && <img src={item.icon2} alt="Expand" className="sidebar-arrow" />}
                        </button>

                        {item.subMenu && (
                            <div className="sidebar-submenu">
                                {item.subMenu.map((sub, subIndex) => (
                                    <div key={subIndex} className="submenu-item">
                                        <span>{sub.label}</span>
                                        {sub.count !== undefined && <span className="submenu-count">{sub.count}</span>}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Overlay для блюру */}
            <div className={`sidebar-overlay ${open ? 'active' : ''}`}></div>
        </>
    );
};

export default Sidebar;