import React, { useState, useEffect } from "react";
import { Drawer, IconButton, List } from "@material-ui/core";
import {
  Home as HomeIcon,
  Person as PersonIcon,
  NotificationsNone as NotificationsIcon,
  FormatSize as TypographyIcon,
  FilterNone as UIElementsIcon,
  BorderAll as TableIcon,
  QuestionAnswer as SupportIcon,
  LibraryBooks as LibraryIcon,
  HelpOutline as FAQIcon,
  ArrowBack as ArrowBackIcon,
  DateRange as DateRangeIcon,
  AccessAlarms as AccessAlarmsIcon
} from "@material-ui/icons";
import { useTheme } from "@material-ui/styles";
import { withRouter } from "react-router-dom";
import classNames from "classnames";

// styles
import useStyles from "./styles";

// components
import SidebarLink from "./components/SidebarLink/SidebarLink";
import Dot from "./components/Dot";

// context
import {
  useLayoutState,
  useLayoutDispatch,
  toggleSidebar,
} from "../../context/LayoutContext";

if(localStorage.getItem('type') === 'physiotherapists'){
  var structure = [
    { id: 0, label: "預約診症", link: "/app/book", icon: <DateRangeIcon /> },
    { id: 1, label: "預約記錄", link: "/app/appointment", icon: <AccessAlarmsIcon /> },
  ];
}
else{
  var structure = [
    { id: 0, label: "個人資料", link: "/app/personal", icon: <PersonIcon /> },
    { id: 1, label: "預約診症", link: "/app/book", icon: <DateRangeIcon /> },
    { id: 2, label: "預約記錄", link: "/app/appointment", icon: <AccessAlarmsIcon /> },
    {
      id: 1,
      label: "Typography",
      link: "/app/typography",
      icon: <TypographyIcon />,
    },
    { id: 2, label: "Tables", link: "/app/tables", icon: <TableIcon /> },
    {
      id: 3,
      label: "Notifications",
      link: "/app/notifications",
      icon: <NotificationsIcon />,
    },
    {
      id: 4,
      label: "UI Elements",
      link: "/app/ui",
      icon: <UIElementsIcon />,
      children: [
        { label: "Icons", link: "/app/ui/icons" },
        { label: "Charts", link: "/app/ui/charts" },
        { label: "Maps", link: "/app/ui/maps" },
      ],
    },
  ];
}

function Sidebar({ location }) {
  var classes = useStyles();
  var theme = useTheme();

  // global
  var { isSidebarOpened } = useLayoutState();
  var layoutDispatch = useLayoutDispatch();

  // local
  var [isPermanent, setPermanent] = useState(true);

  useEffect(function() {
    window.addEventListener("resize", handleWindowWidthChange);
    handleWindowWidthChange();
    return function cleanup() {
      window.removeEventListener("resize", handleWindowWidthChange);
    };
  });

  return (
    <Drawer
      variant={isPermanent ? "permanent" : "temporary"}
      className={classNames(classes.drawer, {
        [classes.drawerOpen]: isSidebarOpened,
        [classes.drawerClose]: !isSidebarOpened,
      })}
      classes={{
        paper: classNames({
          [classes.drawerOpen]: isSidebarOpened,
          [classes.drawerClose]: !isSidebarOpened,
        }),
      }}
      open={isSidebarOpened}
    >
      <div className={classes.toolbar} />
      <div className={classes.mobileBackButton}>
        <IconButton onClick={() => toggleSidebar(layoutDispatch)}>
          <ArrowBackIcon
            classes={{
              root: classNames(classes.headerIcon, classes.headerIconCollapse),
            }}
          />
        </IconButton>
      </div>
      <List className={classes.sidebarList}>
        {structure.map(link => (
          <SidebarLink
            key={link.id}
            location={location}
            isSidebarOpened={isSidebarOpened}
            {...link}
          />
        ))}
      </List>
    </Drawer>
  );

  // ##################################################################
  function handleWindowWidthChange() {
    var windowWidth = window.innerWidth;
    var breakpointWidth = theme.breakpoints.values.md;
    var isSmallScreen = windowWidth < breakpointWidth;

    if (isSmallScreen && isPermanent) {
      setPermanent(false);
    } else if (!isSmallScreen && !isPermanent) {
      setPermanent(true);
    }
  }
}

export default withRouter(Sidebar);
