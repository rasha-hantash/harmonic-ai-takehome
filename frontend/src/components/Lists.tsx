import React from 'react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { EllipsisHorizontalIcon } from '@heroicons/react/20/solid';

export default function Lists() {
  return (
    <Menu as="div" className="relative inline-block text-left">
      {({ open }) => (
        <>
          <div>
            <MenuButton className="flex items-center bg-white text-gray-400 hover:text-gray-600 focus:outline-none">
              <span className="sr-only">Open options</span>
              <EllipsisHorizontalIcon className="h-5 w-5" aria-hidden="true" />
            </MenuButton>
          </div>

          {open && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-[60]" aria-hidden="true" />
          )}

          <MenuItems className="fixed right-4 z-[70] mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              <MenuItem>
                {({ active }) => (
                  <a
                    href="#"
                    className={`block px-4 py-2 text-sm ${
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                    }`}
                  >
                    Add to liked
                  </a>
                )}
              </MenuItem>
              <MenuItem>
                {({ active }) => (
                  <a
                    href="#"
                    className={`block px-4 py-2 text-sm ${
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                    }`}
                  >
                    Add to watchlist
                  </a>
                )}
              </MenuItem>
              <MenuItem>
                {({ active }) => (
                  <a
                    href="#"
                    className={`block px-4 py-2 text-sm ${
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                    }`}
                  >
                    Create new list
                  </a>
                )}
              </MenuItem>
            </div>
          </MenuItems>
        </>
      )}
    </Menu>
  );
}