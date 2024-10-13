import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { EllipsisHorizontalIcon } from '@heroicons/react/20/solid';

// todo add smooth transistion to the menu items

export default function Lists() {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <MenuButton className="px-1 mb-1 pb-1  border-0 flex items-center bg-white text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-0">
        <span className="sr-only">Open options</span>
        <EllipsisHorizontalIcon className="h-5 w-5" aria-hidden="true" />
      </MenuButton>
      
      <MenuItems className="border border-gray-200 shadow-md rounded-lg absolute right-0 w-56  bg-white focus:outline-none z-10">
          <MenuItem>
            <a href="#" className="mx-1 mt-1 rounded-md hover:bg-gray-100 text-black block px-1 py-1 rounded-t-md text-xs">
              Add to liked
            </a>
          </MenuItem>
          <MenuItem>
            <a href="#" className="mx-1 rounded-md hover:bg-gray-100 text-black block px-1 py-1 text-xs">
              Add to AI Companies
            </a>
          </MenuItem>
          <MenuItem>
            <a href="#" className="mx-1 mb-1 rounded-md hover:bg-gray-100 text-black block px-1 py-1  text-xs">
              Create new list
            </a>
          </MenuItem>
      </MenuItems>
    </Menu>
  );
}