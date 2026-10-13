import { NavLink } from "react-router-dom";
import { Trophy, House, Users, ChartScatter, CalendarDays } from "lucide-react";

const navigationItems = [
  { label: "Home", path: "/", icon: House },
  { label: "My Team", path: "/team", icon: Users },
  { label: "Players", path: "/players", icon: ChartScatter },
  { label: "Fixtures", path: "/fixtures", icon: CalendarDays },
];

export default function MainNavigation() {
  return (
    <header className="main-navigation">
      <div className="main-navigation__brand-row">
        <NavLink
          to="/"
          className="main-navigation__brand"
        >
          <Trophy size={24} className="main-navigation__trophy" aria-hidden="true" />
          <span>FPL Analytics</span>
        </NavLink>
      </div>
      <nav aria-label="Main navigation" className="main-navigation__links">
          {navigationItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  `main-navigation__link${isActive ? " main-navigation__link--active" : ""}`
                }
              >
                <Icon size={18} strokeWidth={2} aria-hidden="true" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
      </nav>
    </header>
  );
}
