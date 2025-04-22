import React, { useState } from 'react';
import Select from "react-select";
import { useClickAway } from "@uidotdev/usehooks";

import styles from './style.module.scss';

interface SharePopupProps {
  item: {
    filename: string;
    type: string;
    id: string;
  } | undefined;
  userId: string | undefined;
  cookies: string;
  onClose: () => void;
}

const SharePopup = ({
  item,
  userId,
  cookies,
  onClose,
}: SharePopupProps) => {
  const [optionSelected, setOptionSelected] = useState<string>("none");
  const [code, setCode] = useState<string>("");

  const ref = useClickAway(() => {
    onClose();
  }) as React.MutableRefObject<HTMLDivElement | null>;

  const options = [
    { value: "none", label: "None", color : "red" },
    { value: "read", label: "Readers", color : "blue" },
    { value: "write", label: "Writers", color : "green" },
  ];

  const handleCopyLink = async () => {
    try {
      console.log(userId, item, cookies.split(";").find((item) => item.trim().startsWith("token="))?.split("=")[1]);
      const response = await fetch("/api/getShareLink", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          itemId: item?.filename,
          token: cookies.split(";").find((item) => item.trim().startsWith("token="))?.split("=")[1],
        }),
      });
      const data = await response.json();
      setCode(data.code);
      if (data.error) {
        console.error("Error fetching share link:", data.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  if (!item) return null;
  return (
    <div className={styles.SharePopup_container}>
      <div ref={ref} className={styles.content}>
        <div className={styles.title}>
          <h1>Share "<span>{item.filename}</span>"</h1>
        </div>

        <div className={styles.body}>
          <span>General Access</span>

          <div className={styles.headband}>
            <Select
              classNamePrefix="react-select"
              options={options}
              value={options.filter(option => option.value === optionSelected)}
              onChange={(e: any) => setOptionSelected(e.value)}
              styles={{
                control: (base: any, state: any) => ({
                  ...base,
                  backgroundColor: "#f5F5F5",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  fontFamily: "Nunito",
                  transition: "all .2s ease",
                  cursor: state.isDisabled ? "none" : "pointer",
                  zIndex: state.selectProps.menuIsOpen ? "10" : "0",
                  padding: ".5rem",
                  borderColor: "transparent",
                  width: "100%",
                  maxWidth: "100%",
                  overflow: "hidden",
                }),

                container: (base: any) => ({
                  ...base,
                  width: "100%",
                  maxWidth: "100%",
                }),

                indicatorSeparator: (base: any) => ({
                  ...base,
                  display: "none",
                }),

                valueContainer: (base: any) => ({
                  ...base,
                  padding: 0,
                  position: "relative",
                  alignContent: "center",
                  display: "flex",
                  width: "100%",
                  overflow: "hidden",
                }),
                singleValue: (base: any) => ({
                  ...base,
                  maxWidth: "95%",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                }),
                clearIndicator: (base: any, state: any) => ({
                  ...base,
                  position: "absolute",
                  right: "calc(20px + .5rem)",
                  padding: 0,
                }),
                input: (base: any, state: any) => ({
                  ...base,
                  position: "absolute",
                  margin: 0,
                  padding: 0,
                  paddingBlock: 0,
                  paddingInline: 0,
                  width: "100%",
                  height: "fit-content",
                }),
                menu: (base: any, state: any) => ({
                  ...base,
                  borderRadius: 8,
                  fontSize: "16px",
                  fontWeight: "bold",
                  fontFamily: "Nunito",
                  zIndex: state.selectProps.menuIsOpen ? "10" : "0",
                  width: "100%",
                  overflow: "hidden",
                }),
                menuList: (base: any, state: any) => ({
                  ...base,
                  borderRadius: 8,
                  fontSize: "16px",
                  fontWeight: "bold",
                  fontFamily: "Nunito",
                  width: "100%",
                  overflowY: "scroll",
                  padding: 0,
                }),
                dropdownIndicator: (base: any, state: any) => ({
                  ...base,
                  color: state.isDisabled ? "#aeaead" : "#1fb7ba",
                  transition: "all .2s ease",
                  transform: state.selectProps.menuIsOpen ? "rotate(180deg)" : null,
                  display: "flex",
                  alignItems: "center",
                  padding: 0,
                }),
                indicatorsContainer: (base: any) => ({
                  ...base,
                  padding: 0,
                  width: "fit-content",
                }),
                noOptionsMessage: (base: any) => ({
                  ...base,
                  color: "#e74c3c",
                  fontSize: "16px",
                  fontWeight: "bold",
                  fontFamily: "Nunito",
                }),
                placeholder: (base: any, state: any) => ({
                  ...base,
                  color: state.isDisabled ? "#aeaead" : "#414443",
                  fontSize: "16px",
                  fontWeight: "bold",
                  fontFamily: "Nunito",
                  margin: 0,
                  width: "max-content",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                }),
                option: (base: any, state: any) => ({
                  ...base,
                  backgroundColor: state.isSelected ? "#1fb7ba" : state.isFocused ? "#f5F5F5" : "#fff",
                  color: state.isSelected ? "#fff" : "#414443",
                  cursor: "pointer",
                  transition: "all .2s ease",
                  fontSize: "16px",
                  fontWeight: "bold",
                  fontFamily: "Nunito",
                  "&:hover": {
                    backgroundColor: "#1fb7ba",
                    color: "#f5F5F5",
                  },
                }),
              }}
            />

            {code && (
              <div className={styles.code}>
                <span>Code: {`https://cloud.doctorpok.io/share/${code}`}</span>
              </div>
            )}

            <div className={styles.copy}>
              <button className={styles.button} onClick={handleCopyLink}>
                <span>Copy link</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharePopup;
