import React, { useState, useRef, useLayoutEffect } from 'react';
import Lists from "./Lists";

const companies = [
    { id: 'Lindsay Walton', liked: 'Front-end Developer', status: 'lindsay.walton@example.com', name: 'Member' },
    { id: 'John Doe', liked: 'Back-end Developer', status: 'john.doe@example.com', name: 'Admin' },
    { id: 'Jane Smith', liked: 'UX Designer', status: 'jane.smith@example.com', name: 'Member' },
    // Add more company data as needed
];

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

export default function AdvancedCompanyTable() {
    const checkbox = useRef<HTMLInputElement>(null);
    const [checked, setChecked] = useState(false);
    const [indeterminate, setIndeterminate] = useState(false);
    const [selectedCompanies, setSelectedCompanies] = useState<typeof companies>([]);

    useLayoutEffect(() => {
        const isIndeterminate = selectedCompanies.length > 0 && selectedCompanies.length < companies.length;
        setChecked(selectedCompanies.length === companies.length);
        setIndeterminate(isIndeterminate);
        if (checkbox.current) {
            checkbox.current.indeterminate = isIndeterminate;
        }
    }, [selectedCompanies]);

    function toggleAll() {
        setSelectedCompanies(checked || indeterminate ? [] : companies);
        setChecked(!checked && !indeterminate);
        setIndeterminate(false);
    }

    function toggleCompany(company: (typeof companies)[number]) {
        if (selectedCompanies.includes(company)) {
            setSelectedCompanies(selectedCompanies.filter(c => c !== company));
        } else {
            setSelectedCompanies([...selectedCompanies, company]);
        }
    }

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8">
<div className="mt-4 flex flex-col">
        <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">Companies</h1>
            <div className="flex items-center "> {/* Added space-x-4 for gap between items */}
                <Lists />
                <div className="h-6 w-px mr-4 ml-2 bg-gray-300"></div> {/* This is the divider */}
                <button
                    type="button"
                    className="border-0 block rounded-md bg-black px-4 py-2 text-center text-sm font-semibold text-white shadow-sm "
                >
                    Save
                </button>
            </div>
        </div>
        <div className="mt-2 text-sm text-gray-600 self-end"> {/* self-end aligns to the right */}
            <span className="font-medium">5.3k results</span>
            <span className="ml-1 text-gray-400">(1.4s)</span>
        </div>
    </div>
            <div className="mt-2 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full align-middle">
                        <div className="relative">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="border-t border-gray-200">
                                <tr>
                                    <th scope="col" className="relative px-7 sm:w-12 sm:px-6">
                                        <input
                                            type="checkbox"
                                            className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-0"
                                            ref={checkbox}
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
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {companies.map((company) => (
                                        <tr key={company.id} className={selectedCompanies.includes(company) ? 'bg-gray-50' : undefined}>
                                            <td className="border-b relative px-7 sm:w-12 sm:px-6">
                                                <input
                                                    type="checkbox"
                                                    className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-0"
                                                    checked={selectedCompanies.includes(company)}
                                                    onChange={() => toggleCompany(company)}
                                                />
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-1.5 text-sm border-b  text-gray-500">
                                                {company.id}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-1.5 text-sm text-gray-500 border-l border-b border-gray-200">
                                                {company.liked}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-1.5 text-sm text-gray-500 border-l border-b border-gray-200">
                                                {company.status}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-1.5 text-sm text-gray-500 border-l border-b border-gray-200">
                                                {company.name}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}