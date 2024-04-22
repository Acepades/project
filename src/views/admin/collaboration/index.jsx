import React from "react";
import ShowCollaborations, {ShowCompletedCollaborations } from "./ShowCollaborations";

function Collaboration() {
  return (
    <>
    <div style={{ height: "5vh" }}></div>
    <div style={{display: 'flex', justifyContent: "space-between"}}>
      <div style={{width: '50%'}}><ShowCollaborations/></div>
      <div style={{width: '49%'}}><ShowCompletedCollaborations /></div> 
    </div>
    <div style={{ height: "80vh" }}></div>
    </>

);
}

export default Collaboration;
