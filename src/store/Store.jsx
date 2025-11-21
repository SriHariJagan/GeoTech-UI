import React from "react";
import ProjectProvider from "./Context/ProjectContext";
import SupervisorProvider from "./Context/SupervisorContext";
import { VendorProvider } from "./Context/VendorContext";
import { MachineryProvider } from "./Context/MachineryContext";
import { DERProvider } from "./Context/DERContext";
const Store = ({ children }) => {
  return (
    <>
      <ProjectProvider>
        <SupervisorProvider>
          <VendorProvider>
            <MachineryProvider>
              <DERProvider>{children}</DERProvider>
            </MachineryProvider>
          </VendorProvider>
        </SupervisorProvider>
      </ProjectProvider>
    </>
  );
};

export default Store;
