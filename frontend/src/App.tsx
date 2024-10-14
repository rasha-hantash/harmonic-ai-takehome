import { useEffect, useState } from "react";
import CompanyTable from "./components/CompanyTable";
import Sidebar from "./components/Sidebar";
import { getCollectionsMetadata } from "./utils/jam-api";
import useApi from "./utils/useApi";
// import './App.css';

function App() {
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>();
  const { data: collections } = useApi(() => getCollectionsMetadata());
  // const {data: companies} = useApi(() => getC());

  useEffect(() => {
    setSelectedCollectionId(collections?.[0]?.id);
  }, [collections]);

  return (

      <div className="flex" >        
        <Sidebar 
        collections={collections || []} 
        selectedCollectionId={selectedCollectionId}
        setSelectedCollectionId={setSelectedCollectionId}
      />
      <CompanyTable
        selectedCollectionId={selectedCollectionId}
        collections={collections || []}
      />     
      </div>
  );
}

export default App;
