// import "./App.css";

import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useEffect, useState } from "react";
// import CompanyTable from "./components/OldCompanyTable";
import CompanyTable from "./components/CompanyTable";
import Sidebar from "./components/Sidebar";
import { getCollectionsMetadata } from "./utils/jam-api";
import useApi from "./utils/useApi";


// const darkTheme = createTheme({
//   palette: {
//     mode: "dark",
//   },
// });

function App() {
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>();
  const { data: collectionResponse } = useApi(() => getCollectionsMetadata());

  useEffect(() => {
    setSelectedCollectionId(collectionResponse?.[0]?.id);
  }, [collectionResponse]);

  return (
      // <CssBaseline />
      
      <div className="flex" >
        
        <Sidebar />
        <CompanyTable/>
        
      </div>
  );
}

export default App;
