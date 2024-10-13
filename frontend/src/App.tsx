import { useEffect, useState } from "react";
import CompanyTable from "./components/CompanyTable";
import Sidebar from "./components/Sidebar";
import { getCollectionsMetadata } from "./utils/jam-api";
import useApi from "./utils/useApi";
// import './App.css';

function App() {
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>();
  const { data: collectionResponse } = useApi(() => getCollectionsMetadata());

  useEffect(() => {
    setSelectedCollectionId(collectionResponse?.[0]?.id);
  }, [collectionResponse]);

  return (

      <div className="flex" >        
        <Sidebar />
        <CompanyTable/>       
      </div>
  );
}

export default App;
