import React, { useCallback, useEffect, useState, useRef, useLayoutEffect } from "react";
import { getCollectionsById, updateLikedCollection, ICollection, ICompany } from "../utils/jam-api";
import Lists from "./Lists";

interface CompanyWithLoading extends ICompany {
  isLoading?: boolean;
}

interface CompanyTableProps {
  selectedCollectionId: string | undefined;
  collections: ICollection[];
}
// todo figure out why it isn't ordering the companies by id 

const CompanyTable = ({
    selectedCollectionId,
  }: CompanyTableProps) => {
  const [companies, setCompanies] = useState<CompanyWithLoading[]>([]);
  const [total, setTotal] = useState<number>(0);
//   const [offset, setOffset] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(25);
  const [selectedCompanies, setSelectedCompanies] = useState<CompanyWithLoading[]>([]);

  const checkboxRef = useRef<HTMLInputElement>(null);
  const [checked, setChecked] = useState<boolean>(false);
  const [indeterminate, setIndeterminate] = useState<boolean>(false);

  useEffect(() => {
    if (selectedCollectionId) {
      fetchCompanies();
    }
  }, [selectedCollectionId, page, pageSize]);

  const fetchCompanies = async () => {
    const offset = page * pageSize;
    const response = await getCollectionsById(selectedCollectionId!, offset, pageSize);
    setCompanies(response.companies);
    setTotal(response.total);
  };

  useEffect(() => {
    setPage(0);
  }, [selectedCollectionId]);

  useLayoutEffect(() => {
    updateCheckboxState();
  }, [selectedCompanies]);



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

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newPageSize = Number(event.target.value);
    setPageSize(newPageSize);
    setPage(0);  // Reset to first page when changing page size
    
  };
  const handleAddToLiked = useCallback(async () => {
    if (selectedCompanies.length === 0) return;
  
    // Set loading state for selected companies
    setCompanies(prevCompanies => 
      prevCompanies.map(company => 
        selectedCompanies.some(selected => selected.id === company.id)
          ? { ...company, isLoading: true }
          : company
      )
    );
  
    try {
      const selectedIds = selectedCompanies.map(company => company.id);
      await updateLikedCollection(selectedIds);
      
      // Update companies state to reflect liked status and remove loading state
      setCompanies(prevCompanies => 
        prevCompanies.map(company => 
          selectedCompanies.some(selected => selected.id === company.id)
            ? { ...company, liked: true, isLoading: false }
            : company
        )
      );
  
      // Clear selected companies
      setSelectedCompanies([]);
    } catch (error) {
      console.error('Error updating liked companies:', error);
      
      // Remove loading state in case of error
      setCompanies(prevCompanies => 
        prevCompanies.map(company => 
          selectedCompanies.some(selected => selected.id === company.id)
            ? { ...company, isLoading: false }
            : company
        )
      );
    }
  }, [selectedCompanies, setCompanies, setSelectedCompanies]);


  
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <TableHeader handleAddToLiked={handleAddToLiked} total={total} />
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
      <Pagination
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
};

interface TableHeaderProps {
    handleAddToLiked: () => void;
    total: number;
  }

const TableHeader = ({ handleAddToLiked, total }: TableHeaderProps) => (
  <div className="mt-4 flex flex-col">
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-semibold text-gray-900">Companies</h1>
      <div className="flex items-center">
        <Lists />
        <div className="h-6 w-px mr-4 ml-2 bg-gray-300" />
        <button
          type="button"
          onClick={handleAddToLiked}
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

interface TableHeadProps {
    checkboxRef: React.RefObject<HTMLInputElement>;
    checked: boolean;
    toggleAll: () => void;
  }

const TableHead = ({ checkboxRef, checked, toggleAll }: TableHeadProps) => (
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

interface TableBodyProps {
    companies: CompanyWithLoading[];
    selectedCompanies: CompanyWithLoading[];
    toggleCompany: (company: ICompany) => void;
  }
  
  const TableBody = ({ companies, selectedCompanies, toggleCompany }: TableBodyProps) => (
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

// todo: look into whether or not using React. is outdated
interface PaginationProps {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  }
  
  const Pagination = ({
    page,
    pageSize,
    total,
    onPageChange,
    onPageSizeChange,
  }: PaginationProps) => {  
    const totalPages = Math.ceil(total / pageSize);
  
    return (
      <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            onClick={() => onPageChange(Math.max(0, page - 1))}
            disabled={page === 0}
            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Previous
          </button>
          <button
            onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))}
            disabled={page === totalPages - 1}
            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{page * pageSize + 1}</span> to{" "}
              <span className="font-medium">{Math.min((page + 1) * pageSize, total)}</span> of{" "}
              <span className="font-medium">{total}</span> results
            </p>
          </div>
          <div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button
                onClick={() => onPageChange(Math.max(0, page - 1))}
                disabled={page === 0}
                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              >
                <span className="sr-only">Previous</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                </svg>
              </button>
              <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
                {page + 1} of {totalPages}
              </span>
              <button
                onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))}
                disabled={page === totalPages - 1}
                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              >
                <span className="sr-only">Next</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
        <div className="mt-2 flex items-center">
          <span className="mr-2 text-sm text-gray-700">Page Size:</span>
          <select
            value={pageSize}
            onChange={onPageSizeChange}
            className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
      </div>
    );
  };
  

export default CompanyTable;