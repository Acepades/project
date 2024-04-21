import React from "react";
import ShowCollaborations, {ShowCompletedCollaborations } from "./ShowCollaborations";
import TaskComponent from "./TaskComponent";

function Collaboration() {
  return (
    <div style={{display: 'flex', justifyContent: "space-between"}}>
      <div style={{width: '50%'}}><ShowCollaborations/></div>
      <div style={{width: '49%'}}><ShowCompletedCollaborations /></div> 
    </div>
    
);
}

export default Collaboration;
