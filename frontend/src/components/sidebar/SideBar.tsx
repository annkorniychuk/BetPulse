import type { FunctionComponent } from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';
import './SideBar.css';

// Імпорт іконок
import menuIcon from '../../assets/icons/Vector-9.svg';
import homeIcon from '../../assets/icons/Vector-8.svg';
import basketballIcon from '../../assets/icons/Vector-6.svg';
import footballIcon from '../../assets/icons/Vector-3.svg';
import tennisIcon from '../../assets/icons/Vector-2.svg';
import volleyballIcon from '../../assets/icons/Vector-1.svg';
import catalogIcon from '../../assets/icons/Vector.svg';
import cardsIcon from '../../assets/icons/Vector-4.svg';
import liveCasinoIcon from '../../assets/icons/Vector-7.svg';
import arrowIcon from '../../assets/icons/arrow.svg';
import defaultIcon from '../../assets/icons/Vector.svg';

// Типи даних
interface CompetitionDto {
    id: number;
    name: string;
    count: number;
    country: string;
}

interface SportDto {
    id: number;
    name: string;
    competitions: CompetitionDto[];
}

interface SubMenuItem {
    label: string;
    id?: number;
    count?: number;
    countryName?: string;
}

interface MenuItem {
    icon: string;
    label: string;
    icon2?: string;
    subMenu?: SubMenuItem[];
    path?: string;
    isSport?: boolean;
}

const Sidebar: FunctionComponent = () => {
    const [open, setOpen] = useState(false);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const navigate = useNavigate();

    const getIconForSport = (sportName: string) => {
        const lowerName = sportName.toLowerCase();
        if (lowerName.includes('football') || lowerName.includes('soccer') || lowerName.includes('футбол')) return footballIcon;
        if (lowerName.includes('basketball') || lowerName.includes('баскетбол')) return basketballIcon;
        if (lowerName.includes('tennis') || lowerName.includes('теніс')) return tennisIcon;
        if (lowerName.includes('volleyball') || lowerName.includes('волейбол')) return volleyballIcon;
        return defaultIcon;
    };

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const staticTop: MenuItem[] = [
                    { icon: menuIcon, label: 'Меню', icon2: arrowIcon },
                    { icon: homeIcon, label: 'Головна сторінка', path: '/' },
                ];

                const response = await api.get<SportDto[]>('/sports');
                const sportsData = response.data;

                // 👇 ВИПРАВЛЕНО: явно вказали типи (sport: SportDto)
                const dynamicSports: MenuItem[] = sportsData.map((sport: SportDto) => {
                    const countryCounts: { [key: string]: number } = {};

                    sport.competitions.forEach((comp) => {
                        const country = comp.country || "Світ";
                        if (!countryCounts[country]) {
                            countryCounts[country] = 0;
                        }
                        countryCounts[country]++;
                    });

                    const subMenu: SubMenuItem[] = Object.keys(countryCounts).map((countryName) => ({
                        label: countryName,
                        count: countryCounts[countryName],
                        countryName: countryName
                    }));

                    return {
                        icon: getIconForSport(sport.name),
                        label: sport.name,
                        icon2: arrowIcon,
                        isSport: true,
                        // 👇 ВИПРАВЛЕНО: явно вказали типи (comp: CompetitionDto)
                        subMenu: subMenu
                    };
                });

                const staticBottom: MenuItem[] = [
                    { icon: catalogIcon, label: 'Каталог ігр' },
                    { icon: cardsIcon, label: 'Карти' },
                    {
                        icon: liveCasinoIcon,
                        label: 'Лайв-казино',
                        icon2: arrowIcon,
                        subMenu: [
                            { label: 'Рулетка' },
                            { label: 'Блекджек' },
                        ]
                    },
                ];

                setMenuItems([...staticTop, ...dynamicSports, ...staticBottom]);

            } catch (error) {
                console.error("Помилка завантаження меню:", error);
            }
        };

        fetchMenu();
    }, []);

    const handleItemClick = (item: MenuItem) => {
        if (item.path) {
            navigate(item.path);
        }
    };

    const handleSubItemClick = (sub: SubMenuItem) => {
        if (sub.countryName) {
            // Тут поки лог, бо сторінки країни ще нема
            console.log(sub.countryName);
        } else if (sub.id) {
            navigate(`/competition/${sub.id}`);
        }
    };

    return (
        <>
            <div
                className={`sidebar ${open ? 'sidebar--open' : ''}`}
                onMouseEnter={() => setOpen(true)}
                onMouseLeave={() => setOpen(false)}
            >
                {menuItems.map((item, index) => (
                    <div key={index} className="sidebar-item-wrapper">
                        <button
                            className={`sidebar-item ${item.label === 'Головна сторінка' ? 'item-home' : ''}`}
                            onClick={() => handleItemClick(item)}
                        >
                            <img src={item.icon} alt={item.label} className="sidebar-icon" />
                            <span className="sidebar-label">{item.label}</span>

                            {item.subMenu && item.subMenu.length > 0 && (
                                <img src={item.icon2} alt="Expand" className="sidebar-arrow" />
                            )}
                        </button>

                        {item.subMenu && item.subMenu.length > 0 && (
                            <div className={`sidebar-submenu ${open ? 'visible' : 'hidden'}`}>
                                {item.subMenu.map((sub, subIndex) => (
                                    <div
                                        key={subIndex}
                                        className="submenu-item"
                                        onClick={() => handleSubItemClick(sub)}
                                    >
                                        <span>{sub.label}</span>
                                        {sub.count !== undefined && sub.count > 0 && (
                                            <span className="submenu-count">{sub.count}</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className={`sidebar-overlay ${open ? 'sidebar-overlay--active' : ''}`}></div>
        </>
    );
};

export default Sidebar;