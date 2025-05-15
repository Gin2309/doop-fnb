import React, { useState, useEffect } from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";
import SideBar from "./SideBar";

type ILayoutProps = {
  meta: React.ReactNode;
  title?: string | React.ReactNode;
  children: React.ReactNode;
  noMargin?: boolean;
};

const Layout = (props: ILayoutProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen((prevState) => !prevState);
  };

  const breakPoint = 1100;

  useEffect(() => {
    const handleResize = () => {
      const isSmall = window.innerWidth < breakPoint;
      setIsSmallScreen(isSmall);
      setIsOpen(!isSmall);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isSmallScreen && !isOpen) {
      const handleClickOutside = (event: MouseEvent) => {
        const sidebar = document.querySelector(".sidebar");
        if (sidebar && !sidebar.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }

    return () => {};
  }, [isSmallScreen, isOpen]);
  return (
    <div>
      {props.meta}

      {isSmallScreen && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className="mx-auto min-h-screen w-full ">
        <div className="flex">
          <div
            className={`z-20 sidebar transition-transform duration-300 ${
              isSmallScreen
                ? `fixed top-0 left-0 h-full w-[250px] transform ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                  }`
                : ""
            }`}
          >
            <SideBar open={isOpen} />
          </div>

          <div
            className=" content  flex h-screen w-full flex-col overflow-y-auto"
            style={{
              backgroundImage: `url("/images/background.png")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="flex grow flex-col">
              <Header
                title={props.title}
                open={isOpen}
                toggle={toggleSidebar}
              />

              <div
                className={`main-content grow ${
                  !props.noMargin && "2xs:px-4 md:px-8"
                }`}
              >
                <div className="text-3xl font-semibold ">{props?.title}</div>
                <div>{props.children}</div>
              </div>
            </div>

            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

export { Layout };
