import { Box, Modal } from "@mui/material"
import { ModalContent } from "./ModalContent"


const columnStyle = {display: "flex", gap: "5px", flexDirection: "column", alignItems: "stretch", alignContent: "flex-start"}
const rowStyle = {display: "flex", gap: "5px", flexDirection: "row", alignItems: "stretch", alignContent: "flex-start"}


export const ButtonColumn = ({children}) => {
  return <Box style={columnStyle} children={children}/>
} 


export const ButtonRow = ({children}) => {
  return <Box style={rowStyle} children={children}/>
} 


export const InfoModal = ({message, onClose}) => (
  <div>
    <Modal open={!!message} onClose={onClose}>
      <div>
        <ModalContent response header={"Information"} onOk={onClose}>
          <div>{ message ? message : "" }</div>
        </ModalContent>
      </div>
    </Modal>
  </div>
)