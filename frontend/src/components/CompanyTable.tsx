import React, { useCallback, useEffect, useState, useRef, useLayoutEffect } from "react";
import { getCollectionsById, ICollection, ICompany } from "../utils/jam-api";
import Lists from "./Lists";

interface CompanyWithLoading extends ICompany {
  isLoading?: boolean;
}

interface CompanyTableProps {
  selectedCollectionId: string | undefined;
  collections: ICollection[];
}

const CompanyTable: React.FC<CompanyTableProps> = ({
  selectedCollectionId,
}) => {
  const [companies, setCompanies] = useState<CompanyWithLoading[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [offset, setOffset] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(25);
  const [selectedCompanies, setSelectedCompanies] = useState<CompanyWithLoading[]>([]);

  const checkboxRef = useRef<HTMLInputElement>(null);
  const [checked, setChecked] = useState<boolean>(false);
  const [indeterminate, setIndeterminate] = useState<boolean>(false);

  useEffect(() => {
    if (selectedCollectionId) {
      fetchCompanies();
    }
  }, [selectedCollectionId, offset, pageSize]);

  useEffect(() => {
    setOffset(0);
  }, [selectedCollectionId]);

  useLayoutEffect(() => {
    updateCheckboxState();
  }, [selectedCompanies]);

  const fetchCompanies = async () => {
    const response = await getCollectionsById(selectedCollectionId!, offset, pageSize);
    setCompanies(response.companies);
    setTotal(response.total);
  };

  const updateCheckboxState = () => {
    const isIndeterminate = selectedCompanies.length > 0 && selectedCompanies.length < companies.length;
    setChecked(selectedCompanies.length === companies.length);
    setIndeterminate(isIndeterminate);
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = isIndeterminate;
    }
  };

  const toggleAll = () => {
    setSelectedCompanies(checked || indeterminate ? [] : companies);
    setChecked(!checked && !indeterminate);
    setIndeterminate(false);
  };

  const toggleCompany = (company: ICompany) => {
    setSelectedCompanies(prevSelected =>
      prevSelected.includes(company)
        ? prevSelected.filter(c => c.id !== company.id)
        : [...prevSelected, company]
    );
  };

//   const handleAddToLiked = useCallback(async () => {
//     setCompanies(prevResponse => 
//       prevResponse.map(row => 
//         selectionModel.includes(row.id) ? { ...row, isLoading: true } : row
//       )
//     );

//     setSelectionModel([]);

//     try {
//       const selectedIds = selectionModel.map(id => Number(id));
//       await updateLikedCollection(selectedIds);
      
//       setResponse(prevResponse => 
//         prevResponse.map(row => 
//           selectionModel.includes(row.id) ? { ...row, liked: true, isLoading: false } : row
//         )
//       );
//     } catch (error) {
//       console.error('Error updating liked companies:', error);
//       setResponse(prevResponse => 
//         prevResponse.map(row => 
//           selectionModel.includes(row.id) ? { ...row, isLoading: false } : row
//         )
//       );
//     }
//   }, [selectionModel]);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <TableHeader total={total} />
      <div className="mt-2 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full divide-y divide-gray-300">
              <TableHead
                checkboxRef={checkboxRef}
                checked={checked}
                toggleAll={toggleAll}
              />
              <TableBody
                companies={companies}
                selectedCompanies={selectedCompanies}
                toggleCompany={toggleCompany}
              />
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const TableHeader: React.FC<{ total: number }> = ({ total }) => (
  <div className="mt-4 flex flex-col">
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-semibold text-gray-900">Companies</h1>
      <div className="flex items-center">
        <Lists />
        <div className="h-6 w-px mr-4 ml-2 bg-gray-300" />
        <button
          type="button"
          className="border-0 block rounded-md bg-black px-4 py-2 text-center text-sm font-semibold text-white shadow-sm"
        >
          Save
        </button>
      </div>
    </div>
    <div className="mt-2 text-sm text-gray-600 self-end">
      <span className="font-medium">{total} results</span>
      <span className="ml-1 text-gray-400">(1.4s)</span>
    </div>
  </div>
);

const TableHead: React.FC<{
  checkboxRef: React.RefObject<HTMLInputElement>;
  checked: boolean;
  toggleAll: () => void;
}> = ({ checkboxRef, checked, toggleAll }) => (
  <thead className="border-t border-gray-200">
    <tr>
      <th scope="col" className="relative px-7 sm:w-12 sm:px-6">
        <input
          type="checkbox"
          className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-0"
          ref={checkboxRef}
          checked={checked}
          onChange={toggleAll}
        />
      </th>
      <th scope="col" className="py-1 pr-3 text-left text-sm font-semibold text-gray-600">
        ID
      </th>
      <th scope="col" className="px-3 py-1.5 text-left text-sm font-semibold text-gray-600 border-l border-gray-200">
        Liked
      </th>
      <th scope="col" className="px-3 py-1.5 text-left text-sm font-semibold text-gray-600 border-l border-gray-200">
        Status
      </th>
      <th scope="col" className="px-3 py-1.5 text-left text-sm font-semibold text-gray-600 border-l border-gray-200">
        Company Name
      </th>
    </tr>
  </thead>
);

const TableBody: React.FC<{
  companies: CompanyWithLoading[];
  selectedCompanies: CompanyWithLoading[];
  toggleCompany: (company: ICompany) => void;
}> = ({ companies, selectedCompanies, toggleCompany }) => (
  <tbody className="divide-y divide-gray-200 bg-white">
    {companies.map((company) => (
      <tr
        key={company.id}
        className={selectedCompanies.includes(company) ? "bg-gray-50" : undefined}
      >
        <td className="border-b relative px-7 sm:w-12 sm:px-6">
          <input
            type="checkbox"
            className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-0"
            checked={selectedCompanies.includes(company)}
            onChange={() => toggleCompany(company)}
          />
        </td>
        <td className="whitespace-nowrap px-3 py-1.5 text-sm border-b text-gray-500">
          {company.id}
        </td>
        <td className="whitespace-nowrap px-3 py-1.5 text-sm text-gray-500 border-l border-b border-gray-200">
            {company.liked ? 'true' : 'false'}
        </td>
        <td className="whitespace-nowrap px-3 py-1.5 text-sm text-gray-500 border-l border-b border-gray-200">
          {/* {company.status} */}
        </td>
        <td className="whitespace-nowrap px-3 py-1.5 text-sm text-gray-500 border-l border-b border-gray-200">
          {company.company_name}
        </td>
      </tr>
    ))}
  </tbody>
);

export default CompanyTable;