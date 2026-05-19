import ClickOutside from '@/components/ui/click-outside';
import { Icons } from '@/components/ui/icons';
import { useState } from 'react';
import { Link } from 'react-router-dom';


const DropdownNotification = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifying, setNotifying] = useState(true);

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)}>
      <li className="relative">
        <button
          onClick={() => {
            setNotifying(false);
            setDropdownOpen(!dropdownOpen);
          }}
          className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-800"
        >
          {notifying && (
            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
          )}
          <Icons.bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white shadow-md rounded-md dark:bg-gray-700">
            <div className="px-4 py-2">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Notifications
              </h4>
            </div>
            <ul>
              <li className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600">
                <Link to="#" className="text-sm text-gray-600 dark:text-gray-300">
                  You have 3 new messages.
                </Link>
              </li>
              <li className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600">
                <Link to="#" className="text-sm text-gray-600 dark:text-gray-300">
                  Your order has been shipped.
                </Link>
              </li>
            </ul>
          </div>
        )}
      </li>
    </ClickOutside>
  );
};

export default DropdownNotification;
