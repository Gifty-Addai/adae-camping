import ClickOutside from '@/components/ui/click-outside';
import { Icons } from '@/components/ui/icons';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const DropdownUser = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)}>
      <li className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center space-x-3"
        >
          <span className="hidden lg:block">
            <span className="block text-sm font-medium text-gray-700 dark:text-white">
              Jane Doe
            </span>
            <span className="block text-xs text-gray-500">Administrator</span>
          </span>
          <Icons.profile className="h-8 w-8 rounded-full text-gray-400 dark:text-gray-500" />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-md dark:bg-gray-700">
            <ul>
              <li className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600">
                <Link to="/profile" className="flex items-center space-x-2">
                  <Icons.profile className="h-5 w-5 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Profile
                  </span>
                </Link>
              </li>
              <li className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600">
                <Link to="/settings" className="flex items-center space-x-2">
                  <Icons.settings className="h-5 w-5 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Settings
                  </span>
                </Link>
              </li>
              <li className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600">
                <button className="flex items-center space-x-2 w-full">
                  <Icons.logout className="h-5 w-5 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Logout
                  </span>
                </button>
              </li>
            </ul>
          </div>
        )}
      </li>
    </ClickOutside>
  );
};

export default DropdownUser;
