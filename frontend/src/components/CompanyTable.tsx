import { DataGrid, GridRowSelectionModel, GridColDef } from "@mui/x-data-grid";
import { Button } from '@mui/material';
import { useEffect, useState, useCallback } from "react";
import { getCollectionsById, updateLikedCollection, ICompany } from "../utils/jam-api";
import PulsingLoadingBar from './LoadingBar';
import { Heart } from 'lucide-react';

interface CompanyWithLoading extends ICompany {
  isLoading?: boolean;
}

const CompanyTable = (props: { selectedCollectionId: string }) => {
  const [response, setResponse] = useState<CompanyWithLoading[]>([]);
  const [total, setTotal] = useState<number>();
  const [offset, setOffset] = useState<number>(0);
  const [pageSize, setPageSize] = useState(25);
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>([]);

  useEffect(() => {
    getCollectionsById(props.selectedCollectionId, offset, pageSize).then(
      (newResponse) => {
        setResponse(newResponse.companies);
        setTotal(newResponse.total);
      }
    );
  }, [props.selectedCollectionId, offset, pageSize]);

  useEffect(() => {
    setOffset(0);
  }, [props.selectedCollectionId]);

  const handleAddToLiked = useCallback(async () => {
    setResponse(prevResponse => 
      prevResponse.map(row => 
        selectionModel.includes(row.id) ? { ...row, isLoading: true } : row
      )
    );

    setSelectionModel([]);

    try {
      const selectedIds = selectionModel.map(id => Number(id));
      await updateLikedCollection(selectedIds);
      
      setResponse(prevResponse => 
        prevResponse.map(row => 
          selectionModel.includes(row.id) ? { ...row, liked: true, isLoading: false } : row
        )
      );
    } catch (error) {
      console.error('Error updating liked companies:', error);
      setResponse(prevResponse => 
        prevResponse.map(row => 
          selectionModel.includes(row.id) ? { ...row, isLoading: false } : row
        )
      );
    }
  }, [selectionModel]);

  const columns: GridColDef[] = [
    { 
      field: "liked", 
      headerName: "Liked", 
      width: 90,
      renderCell: (params) => {
        return params.value  ? (
          <div className="p-1 flex items-center justify-center">
            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
          </div>
        ) : <div className="p-1 flex items-center justify-center">
              <Heart className="w-5 h-5 text-red-500" />
            </div>;
      }
    },
    { field: "id", headerName: "ID", width: 90 },
    { 
      field: "status", 
      headerName: "Status", 
      renderCell: (params) => {
        if (params.row.isLoading) {
          return <PulsingLoadingBar />;
        }
        if (!params.row.liked) {
          return "";
        }
        return params.value ? "" : "complete";
      }, 
      width: 90 
    },
    { field: "company_name", headerName: "Company Name", width: 200 },
  ];

  return (
    <div style={{ height: 800, width: "100%" }}>
      <div className="flex justify-end mb-4">
        <Button
          variant="contained"
          onClick={handleAddToLiked}
          disabled={selectionModel.length === 0}
        >
          Add Selected to Liked
        </Button>
      </div>
      <DataGrid
        rows={response}
        rowHeight={30}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 25 },
          },
        }}
        rowCount={total}
        pagination
        checkboxSelection
        paginationMode="server"
        onRowSelectionModelChange={(newSelectionModel) => {
          setSelectionModel(newSelectionModel);
        }}
        rowSelectionModel={selectionModel}
        onPaginationModelChange={(newMeta) => {
          setPageSize(newMeta.pageSize);
          setOffset(newMeta.page * newMeta.pageSize);
        }}
      />
    </div>
  );
};

export default CompanyTable;