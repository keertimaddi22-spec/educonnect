import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiBook,
  FiUser,
  FiFileText,
  FiSearch,
  FiLogOut,
  FiMenu,
  FiChevronRight,
} from "react-icons/fi";

import "./Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();

  // ✅ MOBILE PE DEFAULT COLLAPSED
  const [collapsed, setCollapsed] = useState(true);
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const name = localStorage.getItem("name");
  const role = localStorage.getItem("role");

  // ✅ SCREEN RESIZE HANDLE
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setCollapsed(true);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const options = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Courses", path: "/courses" },
    { label: "Assignments", path: "/assignments" },
    { label: "Channels", path: "/channels" },
  ];

  const filtered = options.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSelect = (path) => {
    navigate(path);
    setSearch("");
    setShowDropdown(false);

    // ✅ MOBILE PE CLICK KE BAAD AUTO COLLAPSE
    if (window.innerWidth <= 768) {
      setCollapsed(true);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <>
      {!collapsed && (
        <div className="sidebar-backdrop" onClick={() => setCollapsed(true)} />
      )}
      <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="top-section">
          {/* TOP BAR */}
          <div className="top-bar">
            <div className="dots">
              <span></span>
              <span></span>
              <span></span>
            </div>

            {collapsed ? (
              <FiChevronRight
                className="menu-toggle"
                onClick={() => setCollapsed(false)}
              />
            ) : (
              <FiMenu
                className="menu-toggle"
                onClick={() => setCollapsed(true)}
              />
            )}
          </div>

          {/* PROFILE */}
          <div className="profile">
            <img
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${name}`}
              alt="profile"
            />

            <div className="profile-text">
              <h3>{name}</h3>
              <p>{role}</p>
            </div>
          </div>

          {/* SEARCH */}
          {!collapsed && (
            <div className="search-box">
              <FiSearch className="search-icon" />

              <input
                placeholder="Search..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setShowDropdown(true);
                }}
              />

              {showDropdown && search && (
                <div className="search-dropdown">
                  {filtered.length > 0 ? (
                    filtered.map((item, i) => (
                      <div
                        key={i}
                        className="dropdown-item"
                        onClick={() => handleSelect(item.path)}
                      >
                        {item.label}
                      </div>
                    ))
                  ) : (
                    <div className="dropdown-item">No results</div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* MENU */}
          <div className="menu">
            <NavLink
              to="/dashboard"
              onClick={() => window.innerWidth <= 768 && setCollapsed(true)}
            >
              <FiHome />
              <span>Dashboard</span>
            </NavLink>

            <NavLink
              to="/courses"
              onClick={() => window.innerWidth <= 768 && setCollapsed(true)}
            >
              <FiBook />
              <span>Courses</span>
            </NavLink>

            <NavLink
              to="/assignments"
              onClick={() => window.innerWidth <= 768 && setCollapsed(true)}
            >
              <FiFileText />
              <span>Assignments</span>
            </NavLink>

            <NavLink
              to="/channels"
              onClick={() => window.innerWidth <= 768 && setCollapsed(true)}
            >
              <FiUser />
              <span>Channels</span>
            </NavLink>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="bottom">
          {!collapsed && <div className="upload-box">⬆ Upload Files</div>}

          <button className="logout-btn" onClick={handleLogout}>
            <FiLogOut />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
