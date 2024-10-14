"use client";

import { useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  TransitionChild,
} from "@headlessui/react";
import {
  Bars3Icon,
  BuildingOffice2Icon,
  XMarkIcon,
  DocumentMagnifyingGlassIcon,
  ClipboardDocumentListIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { ICollection } from "../utils/jam-api";

const navigation = [
  {
    name: "Search",
    href: "/search",
    icon: MagnifyingGlassIcon,
    current: false,
  },
  {
    name: "Companies",
    href: "/companies",
    icon: BuildingOffice2Icon,
    current: true,
  },
  { name: "People", href: "/people", icon: UserCircleIcon, current: false },
  {
    name: "Searches",
    href: "/searches",
    icon: DocumentMagnifyingGlassIcon,
    current: false,
  },
  {
    name: "Lists",
    href: "/lists",
    icon: ClipboardDocumentListIcon,
    current: false,
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
interface SidebarProps {
  collections: ICollection[];
  selectedCollectionId: string | undefined;
  setSelectedCollectionId: (id: string) => void;
}

// todo look up difference between export default function Example() and const Example = () => {

export default function Sidebar({
  collections,
  selectedCollectionId,
  setSelectedCollectionId,
}: SidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <div>
        {/* Mobile sidebar */}
        <Dialog
          open={sidebarOpen}
          onClose={setSidebarOpen}
          className="relative z-50 lg:hidden"
        >
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
          />

          <div className="fixed inset-0 flex">
            <DialogPanel
              transition
              className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full"
            >
              <TransitionChild>
                <div className="absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0">
                  <button
                    type="button"
                    onClick={() => setSidebarOpen(false)}
                    className="-m-2.5 p-2.5"
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon
                      aria-hidden="true"
                      className="h-6 w-6 text-white"
                    />
                  </button>
                </div>
              </TransitionChild>
              {/* Sidebar component, swap this element with another sidebar if you like */}
              <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-2">
                <div className="flex h-16 shrink-0 items-center">
                  <img
                    alt="Your Company"
                    src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
                    className="h-8 w-auto"
                  />
                </div>
                <nav className="flex flex-1 flex-col">
                  <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" className="-mx-2 space-y-1">
                        {navigation.map((item) => (
                          <li key={item.name}>
                            <a
                              href={item.href}
                              className={classNames(
                                item.current
                                  ? "bg-gray-50 text-indigo-600"
                                  : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
                                "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                              )}
                            >
                              <item.icon
                                aria-hidden="true"
                                className={classNames(
                                  item.current
                                    ? "text-indigo-600"
                                    : "text-gray-400 group-hover:text-indigo-600",
                                  "h-6 w-6 shrink-0"
                                )}
                              />
                              {item.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </li>
                    <li>
                      <div className="text-xs font-semibold leading-6 text-gray-400">
                        Favorites
                      </div>
                      <ul role="list" className="-mx-2 mt-2 space-y-1">
                        {collections.map((collection) => (
                          <li key={collection.id}>
                            <a
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                setSelectedCollectionId(collection.id);
                              }}
                              className={classNames(
                                selectedCollectionId === collection.id
                                  ? "bg-gray-50 text-indigo-600"
                                  : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
                                "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                              )}
                            >
                              <span
                                className={classNames(
                                  selectedCollectionId === collection.id
                                    ? "border-indigo-600 text-indigo-600"
                                    : "border-gray-200 text-gray-400 group-hover:border-indigo-600 group-hover:text-indigo-600",
                                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border bg-white text-[0.625rem] font-medium"
                                )}
                              >
                                {collection.collection_name
                                  .charAt(0)
                                  .toUpperCase()}
                              </span>
                              <span className="truncate">
                                {collection.collection_name}
                              </span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </li>
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </div>
        </Dialog>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
            <div className="flex h-16 shrink-0 items-center">
              <img
                alt="Your Company"
                src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
                className="h-8 w-auto"
              />
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <a
                          href={item.href}
                          className={classNames(
                            item.current
                              ? "bg-gray-50 text-indigo-600"
                              : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
                            "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                          )}
                        >
                          <item.icon
                            aria-hidden="true"
                            className={classNames(
                              item.current
                                ? "text-indigo-600"
                                : "text-gray-400 group-hover:text-indigo-600",
                              "h-6 w-6 shrink-0"
                            )}
                          />
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
                <li>
                  <div className="flex text-xs font-semibold leading-6 text-gray-400">
                    Favorites
                  </div>
                  <ul role="list" className="-mx-2 mt-2 space-y-1">
                    {collections.map((collection) => (
                      <li key={collection.id}>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setSelectedCollectionId(collection.id);
                          }}
                          className={classNames(
                            selectedCollectionId === collection.id
                              ? "bg-gray-50 text-indigo-600"
                              : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
                            "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                          )}
                        >
                          <span
                            className={classNames(
                              selectedCollectionId === collection.id
                                ? "border-indigo-600 text-indigo-600"
                                : "border-gray-200 text-gray-400 group-hover:border-indigo-600 group-hover:text-indigo-600",
                              "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border bg-white text-[0.625rem] font-medium"
                            )}
                          >
                            {collection.collection_name.charAt(0).toUpperCase()}
                          </span>
                          <span className="truncate">
                            {collection.collection_name}
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
                <li className="-mx-6 mt-auto">
                  <a
                    href="#"
                    className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50"
                  >
                    <img
                      alt=""
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      className="h-8 w-8 rounded-full bg-gray-50"
                    />
                    <span className="sr-only">Your profile</span>
                    <span aria-hidden="true">Tom Cook</span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="sticky top-0 z-40 flex items-center justify-between bg-white px-4 py-4 shadow-sm sm:px-6 lg:hidden">
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="bg-white -m-2.5 p-2.5 text-black-700 lg:hidden"
            >
              <span className="bg-white sr-only">Open sidebar</span>
              <Bars3Icon aria-hidden="true" className="text-black h-6 w-6" />
            </button>
            <div className="text-sm font-semibold leading-6 text-gray-900 ml-4">
              Dashboard
            </div>
          </div>

          <div className="flex-shrink-0">
            <a href="#">
              <span className="sr-only">Your profile</span>
              <img
                alt=""
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                className="h-8 w-8 rounded-full bg-gray-50"
              />
            </a>
          </div>
        </div>

        <main className="py-5 lg:pl-72">
          {/* <div className="px-4 sm:px-6 lg:px-8">helloYour content</div> */}
        </main>
      </div>
    </>
  );
}
