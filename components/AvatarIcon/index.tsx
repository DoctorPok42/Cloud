import { IconButton, ListItemIcon, Menu, MenuItem } from "@mui/material";
import Image from "next/image";
import React, { useState } from "react";
import styles from "./style.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";

interface AvatarProps {
  username: string;
}

const AvatarIcon = ({
  username
}: AvatarProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handlClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handlClose = () => {
    setAnchorEl(null);
  };

  const handlLogout = () => {
    fetch(`/api/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (res.status === 200) {
        window.location.href = "/";
      }
    });
  };

  return (
    <div className={styles.avatar}>
      <IconButton
        onClick={handlClick}
        aria-controls={open ? "account-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        <img
          alt={username}
          src={`https://api.dicebear.com/7.x/adventurer-neutral/png?seed=${username}&radius=50`}
        />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handlClose}
        onClick={handlClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.3,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 17,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handlLogout}>
          <FontAwesomeIcon
            icon={faArrowRightFromBracket}
            style={{ marginRight: "10px", color: "var(--red)" }}
          />
          <h2
            style={{
              color: "var(--red)",
              fontSize: "1rem",
              fontWeight: "bold",
            }}
          >
            Logout
          </h2>
        </MenuItem>
      </Menu>
    </div>
  );
};

export default AvatarIcon;
