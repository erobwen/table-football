import React from "react";
import { Button, Paper } from "@mui/material";

export const ModalContent = ({header, onOk, okEnabled=true, children}) => {
  return (
    <Paper style={{
      position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "60%", height: "60%",
      display: "flex", flexDirection: "column", justifyContent:"space-between", alignItems: "flex-start", padding: "20px"
      }}>
      <h3 style={{marginTop: "0px"}}>{header}</h3>
      {children}
      <div style={{display: "flex", flexDirection: "row", justifyContent: "flex-end", width: "100%"}}>
        {onOk && <Button disabled={!okEnabled} onClick={onOk}>OK</Button>}
      </div>
    </Paper>
  )
}
  