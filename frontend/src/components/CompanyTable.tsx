import Lists from "./Lists"
import React, { useState } from 'react';
const companies = [
    { id: 'Lindsay Walton', liked: 'Front-end Developer', status: 'lindsay.walton@example.com', name: 'Member' },
    // More people...
  ]
  
  // todo do i need this? 
  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
  }


  // tdo look into e: React.ChangeEvent<HTMLInputElement
const CustomCheckbox = ({ checked, onChange, id }: { checked: boolean, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, id: string }) => (
    <div className="relative flex items-center">
        <input
            type="checkbox"
            id={id}
            checked={checked}
            onChange={onChange}
            className="sr-only"
        />
        <div className={classNames(
            checked ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-gray-300',
            'h-5 w-5 rounded border transition-colors duration-200 ease-in-out'
        )}>
            <svg className={classNames(
                checked ? 'opacity-100' : 'opacity-0',
                'h-4 w-4 text-white transition-opacity duration-200 ease-in-out'
            )} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
        </div>
    </div>
);
export default function CompanyTable() {
    const [selectedCompanies, setSelectedCompanies] = useState<{ [key: string]: boolean }>({});
    const [selectAll, setSelectAll] = useState(false);

    const toggleCompanySelection = (companyId: string) => {
        setSelectedCompanies(prev => ({
            ...prev,
            [companyId]: !prev[companyId]
        }));
    };

    const toggleSelectAll = () => {
        const newSelectAll = !selectAll;
        setSelectAll(newSelectAll);
        const newSelectedCompanies: { [key: string]: boolean } = {};
        companies.forEach(company => {
            newSelectedCompanies[company.id] = newSelectAll;
        });
        setSelectedCompanies(newSelectedCompanies);
    };

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="mt-8 flow-root">
                <div className="flex"> 
                    <div className="sm:flex-auto">
                    <h1 className="text-2xl  font-semibold leading-6 text-gray-900">Companies</h1>
                </div>
                 <Lists />
                <div className="mt-4 sm:mt-0 sm:flex-none">
                    <button
                    type="button"
                    className="block rounded-md bg-black px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                    Save
                    </button>
                </div></div>
               
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead>
                                <tr>
                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:pl-8">
                                        <CustomCheckbox
                                            checked={selectAll}
                                            onChange={toggleSelectAll}
                                            id="select-all"
                                        />
                                    </th>
                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:pl-8">
                                        ID
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Liked
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Status
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Company Name
                                    </th>
                                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 lg:pr-8">
                                        <span className="sr-only">Edit</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {companies.map((company) => (
                                    <tr key={company.id}>
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
                                            <CustomCheckbox
                                                checked={selectedCompanies[company.id] || false}
                                                onChange={() => toggleCompanySelection(company.id)}
                                                id={`company-${company.id}`}
                                            />
                                        </td>
                                        <td className="flexwhitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">

                                            {company.id}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            {company.liked}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            {company.status}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            {company.name}
                                        </td>
                                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8">
                                            <a href="#" className="text-indigo-600 hover:text-indigo-900">
                                                Edit<span className="sr-only">, {company.name}</span>
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}