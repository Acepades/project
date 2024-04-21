import React from "react";
import ShowTasks, {ShowCompletedCollaborations } from "./ShowCollaborations";
import TaskComponent from "./TaskComponent";

function Collaboration() {
  return (
    <div style={{display: 'flex', justifyContent: "space-between"}}>
      <div style={{width: '50%'}}><showCollaborations/></div>
      <div style={{width: '50%'}}><ShowCompletedCollaborations /></div> 
    </div>
    
);
}

export default Collaboration;

/*import React from "react";
import ShowTasks, { ShowCompletedCollaborations } from "./ShowCollaborations";
import TaskComponent from "./TaskComponent";

function Collaboration() {
  return (
    <div style={{display: 'flex', justifyContent: "space-between"}}>
      <div style={{width: '50%'}}><ShowCollaborations /></div>
      <div style={{width: '50%'}}><ShowCompletedCollaborations /></div> 
    </div>
    
);
}

export default Collaboration;*/